import { z } from "zod";

export const bedSchema = z.object({
  number: z.string().min(1, "Bed number is required"),
  roomId: z.number().int("Room ID must be an integer"),
});
