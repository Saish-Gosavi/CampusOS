import { z } from "zod";

export const visitorSchema = z.object({
  studentId: z.number().int("Student ID must be an integer"),
  fullName: z.string().min(1, "Visitor name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  checkIn: z.string().datetime("Check-in time must be a valid ISO datetime"),
});
