import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.string().optional().default(""),
  isActive: z.coerce.boolean().optional().default(true),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional().default(null),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional().default(null),
});

export const updateNoticeSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  content: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  scheduledAt: z.string().datetime({ offset: true }).nullable().optional(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
});
