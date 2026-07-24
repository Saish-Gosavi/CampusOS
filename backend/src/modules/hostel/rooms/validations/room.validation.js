import { z } from "zod";

export const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  floorId: z.number().int("Floor ID must be an integer"),
  capacity: z.number().int("Capacity must be an integer").positive("Capacity must be positive"),
  rent: z.number().positive("Rent must be positive"),
});
