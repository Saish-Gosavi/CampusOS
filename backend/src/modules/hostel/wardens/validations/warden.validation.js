import { z } from "zod";

export const createWardenSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  hostelId: z.number().int("Hostel ID must be an integer"),
  shift: z.string().optional().default("Day"),
});

export const updateWardenSchema = z.object({
  fullName: z.string().min(1, "Full name cannot be empty").optional(),
  phone: z.string().optional(),
  shift: z.string().optional(),
  hostelId: z.number().int().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});
