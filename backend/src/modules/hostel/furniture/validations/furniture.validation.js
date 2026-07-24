import { z } from "zod";

export const furnitureSchema = z.object({
  name: z.string().min(1, "Furniture item name is required"),
  roomId: z.number().int("Room ID must be an integer"),
  status: z.enum(["good", "damaged", "under-maintenance"]).optional(),
});
