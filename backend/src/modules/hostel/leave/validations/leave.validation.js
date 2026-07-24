import { z } from "zod";

export const leaveSchema = z.object({
  studentId: z.number().int("Student ID must be an integer"),
  reason: z.string().min(1, "Reason is required"),
  startDate: z.string().datetime("Start date must be a valid ISO datetime"),
  endDate: z.string().datetime("End date must be a valid ISO datetime"),
});
