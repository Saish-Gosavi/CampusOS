import { z } from "zod";

export const floorSchema = z.object({
  number: z.number().int("Floor number must be an integer"),
  blockId: z.number().int("Block ID must be an integer"),
});
