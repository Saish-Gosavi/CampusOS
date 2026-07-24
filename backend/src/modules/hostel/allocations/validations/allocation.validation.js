import { z } from "zod";

export const allocationSchema = z.object({
  bedId: z.number().int("Bed ID must be an integer"),
  studentId: z.number().int("Student ID must be an integer"),
  startDate: z.string().datetime("Start date must be a valid ISO datetime"),
  endDate: z.string().datetime("End date must be a valid ISO datetime"),
});
