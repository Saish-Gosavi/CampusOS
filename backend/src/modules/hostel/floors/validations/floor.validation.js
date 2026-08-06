import { z } from "zod";

export const floorSchema = z.object({
  number: z.preprocess((val) => Number(val), z.number().int("Floor number must be an integer")),
  blockId: z.preprocess((val) => Number(val), z.number().int("Block ID must be an integer")),
});

export const updateFloorSchema = z.object({
  number: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().int().optional()),
  blockId: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().int().optional()),
});
