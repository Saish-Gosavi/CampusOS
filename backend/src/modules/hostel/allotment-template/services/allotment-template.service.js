import path from "path";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { AllotmentTemplateRepository } from "../repository/allotment-template.repository.js";
import { safeDeleteFile, UPLOAD_DIR } from "../../../../middleware/templateUpload.middleware.js";
import { AppError } from "../../../../utils/AppError.js";

// Map section names to DB field names
const SECTION_FIELD_MAP = {
  header: { path: "headerPdfPath", name: "headerPdfName" },
  footer: { path: "footerPdfPath", name: "footerPdfName" },
  main: { path: "mainPdfPath", name: "mainPdfName" },
  terms: { path: "termsPdfPath", name: "termsPdfName" },
};

export class AllotmentTemplateService {
  /**
   * Get the currently active allotment template.
   */
  static async getActive() {
    return AllotmentTemplateRepository.getActive();
  }

  /**
   * Get all templates (for admin history view).
   */
  static async getAll() {
    return AllotmentTemplateRepository.getAll();
  }

  /**
   * Upload a new template.
   * - Deactivates any existing active templates first.
   * - Deletes old files from disk if replaceExisting is true.
   * - Saves new template record.
   */
  static async uploadTemplate({ name, description, templateFile, imageFile, uploadedBy, replaceExisting }) {
    if (!templateFile) {
      throw new AppError("Template file is required (PDF or DOCX).", 400);
    }

    const ext = path.extname(templateFile.originalname).toLowerCase().replace(".", "");
    const fileType = ext === "docx" || ext === "doc" ? ext : "pdf";

    // If replacing, delete old files from disk
    if (replaceExisting) {
      const existing = await AllotmentTemplateRepository.getAll();
      const activeOnes = existing.filter((t) => t.isActive);
      for (const t of activeOnes) {
        if (t.filePath) safeDeleteFile(t.filePath);
        if (t.imagePath) safeDeleteFile(t.imagePath);
      }
      await AllotmentTemplateRepository.deactivateAll();
    } else {
      // Even without explicit replace, deactivate all to keep only 1 active
      await AllotmentTemplateRepository.deactivateAll();
    }

    const data = {
      name: name.trim(),
      description: description?.trim() || null,
      filePath: templateFile.path,
      fileName: templateFile.filename,
      fileType,
      isActive: true,
      uploadedBy: uploadedBy ? Number(uploadedBy) : null,
    };

    if (imageFile) {
      data.imagePath = imageFile.path;
      data.imageFileName = imageFile.filename;
    }

    return AllotmentTemplateRepository.create(data);
  }

  /**
   * Save plain text format template.
   * - Deactivates existing active templates.
   * - Saves new plain text format in DB.
   */
  static async saveFormat({ name, content, uploadedBy }) {
    if (!content || !content.trim()) {
      throw new AppError("Format content cannot be empty.", 400);
    }

    await AllotmentTemplateRepository.deactivateAll();

    const data = {
      name: name ? name.trim() : "Room Allotment Letter Format",
      description: content.trim(),
      filePath: "text_format",
      fileName: "format.txt",
      fileType: "text",
      isActive: true,
      uploadedBy: uploadedBy ? Number(uploadedBy) : null,
    };

    return AllotmentTemplateRepository.create(data);
  }

  /**
   * Upload a PDF, extract its text content, and save as the active format.
   * - Only accepts PDF files.
   * - Uses pdf-parse to extract text.
   * - Deactivates all prior active templates.
   * - Stores the PDF file path + extracted text as description.
   */
  static async uploadPdf({ pdfFile, uploadedBy }) {
    if (!pdfFile) {
      throw new AppError("A PDF file is required.", 400);
    }

    const ext = path.extname(pdfFile.originalname).toLowerCase();
    if (ext !== ".pdf") {
      safeDeleteFile(pdfFile.path);
      throw new AppError("Only PDF files are supported for text extraction.", 400);
    }

    // Dynamically import pdf-parse (CommonJS module)
    // Read file and extract text
    let extractedText = "";
    try {
      const dataBuffer = fs.readFileSync(pdfFile.path);
      const parser = new PDFParse({ data: dataBuffer });
      await parser.load();
      const parsed = await parser.getText();
      extractedText = (typeof parsed === "string" ? parsed : parsed?.text || "").trim();
    } catch (parseErr) {
      safeDeleteFile(pdfFile.path);
      throw new AppError(`PDF text extraction failed: ${parseErr.message}`, 422);
    }

    if (!extractedText) {
      safeDeleteFile(pdfFile.path);
      throw new AppError(
        "No readable text could be extracted from this PDF. The file may be scanned or image-based.",
        422
      );
    }

    // Deactivate all prior templates
    await AllotmentTemplateRepository.deactivateAll();

    const data = {
      name: "Room Allotment Letter Format",
      description: extractedText,
      filePath: pdfFile.path,
      fileName: pdfFile.filename,
      fileType: "pdf",
      isActive: true,
      uploadedBy: uploadedBy ? Number(uploadedBy) : null,
    };

    return AllotmentTemplateRepository.create(data);
  }

  /**
   * Upload a single PDF section (header | footer | main | terms).
   * Saves the file and updates the active template record.
   * Creates one if none exists.
   */
  static async uploadSection({ section, pdfFile, uploadedBy }) {
    const fields = SECTION_FIELD_MAP[section];
    if (!fields) {
      if (pdfFile?.path) safeDeleteFile(pdfFile.path);
      throw new AppError(`Invalid section: "${section}". Must be one of: header, footer, main, terms.`, 400);
    }

    if (!pdfFile) {
      throw new AppError("A PDF file is required.", 400);
    }

    // Validate PDF
    const ext = path.extname(pdfFile.originalname).toLowerCase();
    if (ext !== ".pdf" || pdfFile.mimetype !== "application/pdf") {
      safeDeleteFile(pdfFile.path);
      throw new AppError("Only PDF files are accepted (max 10 MB).", 400);
    }
    if (pdfFile.size > 10 * 1024 * 1024) {
      safeDeleteFile(pdfFile.path);
      throw new AppError("PDF file must be under 10 MB.", 400);
    }

    // Ensure there is an active template record to attach to
    const template = await AllotmentTemplateRepository.ensureActive(uploadedBy);

    // Delete the old section file if it existed
    if (template[fields.path]) {
      safeDeleteFile(template[fields.path]);
    }

    // Persist the new file reference
    const updated = await AllotmentTemplateRepository.update(template.id, {
      [fields.path]: pdfFile.path,
      [fields.name]: pdfFile.filename,
    });

    return updated;
  }

  /**
   * Delete a template record and its associated files from disk.
   */
  static async deleteTemplate(id) {
    const template = await AllotmentTemplateRepository.getById(id);
    if (!template) throw new AppError("Template not found.", 404);

    if (template.filePath) safeDeleteFile(template.filePath);
    if (template.imagePath) safeDeleteFile(template.imagePath);
    // Remove section PDFs too
    for (const fields of Object.values(SECTION_FIELD_MAP)) {
      if (template[fields.path]) safeDeleteFile(template[fields.path]);
    }

    return AllotmentTemplateRepository.deleteById(id);
  }
}
