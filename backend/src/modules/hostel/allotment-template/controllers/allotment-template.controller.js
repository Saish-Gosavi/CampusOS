import path from "path";
import { AllotmentTemplateService } from "../services/allotment-template.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";
import { createAllotmentTemplateSchema } from "../validations/allotment-template.validation.js";
import { getTemplateFileUrl } from "../../../../middleware/templateUpload.middleware.js";

export class AllotmentTemplateController {
  /**
   * GET /allotment-template/active
   * Returns the single active template (or null if none exists).
   */
  static async getActive(req, res, next) {
    try {
      const template = await AllotmentTemplateService.getActive();

      // Enrich with public file URL if template exists
      if (template) {
        template.fileUrl = getTemplateFileUrl(req, template.fileName);
        if (template.imageFileName) {
          template.imageUrl = getTemplateFileUrl(req, template.imageFileName);
        }
        // Enrich all 4 section PDF URLs
        const sectionNames = ["header", "footer", "main", "terms"];
        for (const s of sectionNames) {
          const nameField = `${s}PdfName`;
          if (template[nameField]) {
            template[`${s}PdfUrl`] = getTemplateFileUrl(req, template[nameField]);
          }
        }
      }

      return apiResponse.success(res, template, "Active template retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /allotment-template
   * Returns all templates (for admin history view).
   */
  static async getAll(req, res, next) {
    try {
      const templates = await AllotmentTemplateService.getAll();
      return apiResponse.success(res, templates, "Templates retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /allotment-template/upload
   * Handles multipart/form-data upload of a new template.
   */
  static async upload(req, res, next) {
    try {
      // Validate body fields
      const parsed = createAllotmentTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        const firstError = parsed.error.errors[0]?.message || "Validation failed";
        return apiResponse.error(res, firstError, 400);
      }

      const { name, description } = parsed.data;
      const replaceExisting = req.body.replaceExisting === "true" || req.body.replaceExisting === true;

      const templateFile = req.files?.templateFile?.[0];
      const imageFile = req.files?.templateImage?.[0];

      const template = await AllotmentTemplateService.uploadTemplate({
        name,
        description,
        templateFile,
        imageFile,
        uploadedBy: req.user?.id,
        replaceExisting,
      });

      // Enrich with URL
      template.fileUrl = getTemplateFileUrl(req, template.fileName);
      if (template.imageFileName) {
        template.imageUrl = getTemplateFileUrl(req, template.imageFileName);
      }

      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Upload Allotment Template",
        description: `Uploaded allotment letter template: "${template.name}" (${template.fileType.toUpperCase()})`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: { id: template.id, name: template.name, fileType: template.fileType },
      });

      return apiResponse.success(res, template, "Template uploaded successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /allotment-template/save-format
   * Handles saving text-based allotment letter format.
   */
  static async saveFormat(req, res, next) {
    try {
      const { content, name } = req.body;
      if (!content || typeof content !== "string" || !content.trim()) {
        return apiResponse.error(res, "Format content is required", 400);
      }

      const template = await AllotmentTemplateService.saveFormat({
        name: name || "Room Allotment Letter Format",
        content,
        uploadedBy: req.user?.id,
      });

      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Save Allotment Format",
        description: `Saved room allotment letter format text`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: { id: template.id, name: template.name },
      });

      return apiResponse.success(res, template, "Allotment format saved successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /allotment-template/upload-pdf
   * Uploads a PDF, extracts text content, and saves as active format.
   */
  static async uploadPdf(req, res, next) {
    try {
      const pdfFile = req.files?.pdfFile?.[0] || req.file;

      if (!pdfFile) {
        return apiResponse.error(res, "Please upload a valid PDF file.", 400);
      }

      // Validate MIME type
      if (pdfFile.mimetype !== "application/pdf") {
        return apiResponse.error(res, "Only PDF files are accepted.", 400);
      }

      // Validate size (10 MB max)
      if (pdfFile.size > 10 * 1024 * 1024) {
        return apiResponse.error(res, "PDF file must be under 10 MB.", 400);
      }

      const template = await AllotmentTemplateService.uploadPdf({
        pdfFile,
        uploadedBy: req.user?.id,
      });

      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Upload PDF Allotment Format",
        description: `Uploaded PDF and extracted text as allotment format: "${template.name}"`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: { id: template.id, name: template.name, fileType: template.fileType },
      });

      return apiResponse.success(res, template, "PDF uploaded and text extracted successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /allotment-template/upload-section
   * Uploads a single PDF for one section (header | footer | main | terms).
   * Field name in form-data matches the section: "headerPdf", "footerPdf", "mainPdf", "termsPdf"
   */
  static async uploadSection(req, res, next) {
    try {
      const { section } = req.body;

      if (!section || !["header", "footer", "main", "terms"].includes(section)) {
        return apiResponse.error(
          res,
          "Invalid or missing section. Must be one of: header, footer, main, terms.",
          400
        );
      }

      // The file field name in the form equals the section + "Pdf"
      const fieldName = `${section}Pdf`;
      const pdfFile = req.files?.[fieldName]?.[0] || req.file;

      if (!pdfFile) {
        return apiResponse.error(res, `No PDF file received for field "${fieldName}". Please upload a valid PDF.`, 400);
      }

      if (pdfFile.mimetype !== "application/pdf") {
        return apiResponse.error(res, "Only PDF files are accepted.", 400);
      }

      if (pdfFile.size > 10 * 1024 * 1024) {
        return apiResponse.error(res, "PDF file must be under 10 MB.", 400);
      }

      const template = await AllotmentTemplateService.uploadSection({
        section,
        pdfFile,
        uploadedBy: req.user?.id,
      });

      // Enrich with URLs for all 4 sections
      const sectionNames = ["header", "footer", "main", "terms"];
      for (const s of sectionNames) {
        const nameField = `${s}PdfName`;
        if (template[nameField]) {
          template[`${s}PdfUrl`] = getTemplateFileUrl(req, template[nameField]);
        }
      }

      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Upload Section PDF",
        description: `Uploaded "${section}" section PDF for allotment letter format`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: { section, fileName: pdfFile.filename },
      });

      return apiResponse.success(res, template, `"${section}" PDF section uploaded successfully`, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /allotment-template/:id
   * Deletes a template record and its associated disk files.
   */
  static async deleteTemplate(req, res, next) {
    try {
      await AllotmentTemplateService.deleteTemplate(req.params.id);

      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Delete Allotment Template",
        description: `Deleted allotment letter template ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return apiResponse.success(res, null, "Template deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
