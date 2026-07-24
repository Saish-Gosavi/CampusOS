import { z } from "zod";

export const blockSchema = z.object({
  name: z.string().min(1, "Block name is required"),
  hostelId: z.number().int("Hostel ID must be an integer"),
});
