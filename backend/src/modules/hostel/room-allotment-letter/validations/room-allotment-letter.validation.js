import { z } from "zod";

export const createAllotmentLetterSchema = z.object({
  allocationId: z.number().int().positive(),
  terms: z.string().optional(),
  signedBy: z.string().optional(),
});

export const updateAllotmentLetterSchema = z.object({
  terms: z.string().optional(),
  signedBy: z.string().optional(),
});
