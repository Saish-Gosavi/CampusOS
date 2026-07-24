import { z } from "zod";

export const complaintSchema = z.object({
  studentId: z.number().int("Student ID must be an integer"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"]).optional(),
});
