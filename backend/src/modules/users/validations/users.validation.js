import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  email: z.string().email("Enter a valid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  status: z.string().optional(),
  roleId: z.number().int().optional(),
  roleName: z.string().optional(),
  campus: z.string().optional(),
});

export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.number().int("Role ID must be an integer").optional(),
  roleName: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  campus: z.string().optional(),
  collegeId: z.number().optional(),
});
