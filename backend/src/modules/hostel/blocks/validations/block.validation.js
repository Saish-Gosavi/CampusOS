import { z } from "zod";

export const blockSchema = z.object({
  name: z.string().min(1, "Block name is required"),
  hostelId: z.preprocess((val) => Number(val), z.number().int("Hostel ID must be an integer")),
});

export const updateBlockSchema = z.object({
  name: z.string().min(1, "Block name cannot be empty").optional(),
  hostelId: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().int().optional()),
});
