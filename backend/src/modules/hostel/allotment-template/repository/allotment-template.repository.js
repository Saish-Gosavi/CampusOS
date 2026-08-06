import { prisma } from "../../../../config/prisma.js";

export class AllotmentTemplateRepository {
  /**
   * Get the currently active template (only one at a time).
   */
  static async getActive() {
    return prisma.allotmentTemplate.findFirst({
      where: { isActive: true },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get all templates (active + archived).
   */
  static async getAll() {
    return prisma.allotmentTemplate.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get a single template by ID.
   */
  static async getById(id) {
    return prisma.allotmentTemplate.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Deactivate ALL currently active templates.
   * Called before inserting a new template.
   */
  static async deactivateAll() {
    return prisma.allotmentTemplate.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  /**
   * Create a new template record.
   */
  static async create(data) {
    return prisma.allotmentTemplate.create({ data });
  }

  /**
   * Update an existing template record by ID.
   */
  static async update(id, data) {
    return prisma.allotmentTemplate.update({
      where: { id: Number(id) },
      data,
    });
  }

  /**
   * Ensure there is exactly one active "sections" template.
   * If none exists, create a stub. Returns the template.
   */
  static async ensureActive(uploadedBy = null) {
    const existing = await prisma.allotmentTemplate.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;

    // Create a placeholder active template for section PDFs
    return prisma.allotmentTemplate.create({
      data: {
        name: "Room Allotment Letter Format",
        filePath: "sections_format",
        fileName: "sections.pdf",
        fileType: "pdf",
        isActive: true,
        uploadedBy: uploadedBy ? Number(uploadedBy) : null,
      },
    });
  }

  /**
   * Delete a template record by ID.
   */
  static async deleteById(id) {
    return prisma.allotmentTemplate.delete({
      where: { id: Number(id) },
    });
  }
}
