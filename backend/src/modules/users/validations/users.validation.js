import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
});

export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleId: z.number().int("Role ID must be an integer"),
  name: z.string().optional(),
  campus: z.string().optional(),
  status: z.string().optional(),
});
