import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string({ required_error: "Role name is required", invalid_type_error: "Role name must be a string" })
    .trim()
    .min(1, "Role name cannot be empty"),
  description: z.string().nullable().optional(),
  permissionIds: z
    .array(z.number({ invalid_type_error: "Each permission ID must be a number" }).int("Each permission ID must be an integer"), {
      invalid_type_error: "permissionIds must be an array of numbers",
    })
    .optional()
    .default([]),
});

export const updateRoleSchema = z.object({
  name: z
    .string({ required_error: "Role name is required", invalid_type_error: "Role name must be a string" })
    .trim()
    .min(1, "Role name cannot be empty"),
  description: z.string().nullable().optional(),
  permissionIds: z
    .array(z.number({ invalid_type_error: "Each permission ID must be a number" }).int("Each permission ID must be an integer"), {
      invalid_type_error: "permissionIds must be an array of numbers",
    })
    .optional()
    .default([]),
});
