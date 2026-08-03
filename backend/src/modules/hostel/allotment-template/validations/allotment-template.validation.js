import { z } from "zod";

export const createAllotmentTemplateSchema = z.object({
  name: z
    .string({ required_error: "Template name is required" })
    .min(2, "Template name must be at least 2 characters")
    .max(100, "Template name must not exceed 100 characters")
    .trim(),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
});
