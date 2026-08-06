import { z } from "zod";

export const hostelSchema = z.object({
  name: z.string().min(1, "Hostel name is required"),
  city: z.string().optional(),
  status: z.enum(["Active", "Pending", "Inactive"]).optional(),
  address: z.string().optional(),
  hasHostel: z.boolean().optional(),
  hasLibrary: z.boolean().optional(),
  hasInventory: z.boolean().optional(),
});
