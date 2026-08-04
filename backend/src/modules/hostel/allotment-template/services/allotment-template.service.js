import path from "path";
import { AllotmentTemplateRepository } from "../repository/allotment-template.repository.js";
import { safeDeleteFile, UPLOAD_DIR } from "../../../../middleware/templateUpload.middleware.js";
import { AppError } from "../../../../utils/AppError.js";

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
   * Delete a template record and its associated files from disk.
   */
  static async deleteTemplate(id) {
    const template = await AllotmentTemplateRepository.getById(id);
    if (!template) throw new AppError("Template not found.", 404);

    if (template.filePath) safeDeleteFile(template.filePath);
    if (template.imagePath) safeDeleteFile(template.imagePath);

    return AllotmentTemplateRepository.deleteById(id);
  }
}
