import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  collegeId: z.string().min(3, "College ID must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hostelId: z.number().optional().nullable(),
  status: z.enum(["active", "suspended", "inactive"]).optional().default("active"),
});

export const updateStudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  collegeId: z.string().min(3, "College ID must be at least 3 characters").optional(),
  status: z.enum(["active", "suspended", "inactive"]).optional(),
});
