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
   * Delete a template record by ID.
   */
  static async deleteById(id) {
    return prisma.allotmentTemplate.delete({
      where: { id: Number(id) },
    });
  }
}
