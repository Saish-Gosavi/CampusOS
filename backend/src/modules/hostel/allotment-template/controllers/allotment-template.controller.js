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
