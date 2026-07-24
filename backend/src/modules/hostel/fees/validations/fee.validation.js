import { z } from "zod";

export const feeSchema = z.object({
  studentId: z.number().int("Student ID must be an integer"),
  amount: z.number().positive("Amount must be positive"),
  dueDate: z.string().datetime("Due date must be a valid ISO datetime"),
});
