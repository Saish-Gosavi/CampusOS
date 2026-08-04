import { z } from "zod";

// Reusable validation messages
export const VALIDATION_MESSAGES = {
  required: (field) => `${field} is required`,
  invalidEmail: "Enter a valid email address",
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  phone: "Enter a valid phone number",
  number: (field) => `${field} must be a number`,
  positive: (field) => `${field} must be a positive number`,
};

// Reusable login validation schema
export const loginSchema = z.object({
  email: z.string().min(1, VALIDATION_MESSAGES.required("Email or College ID")).refine((val) => {
    const trimmed = (val || "").trim();
    if (!trimmed.includes("@")) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }, {
    message: VALIDATION_MESSAGES.invalidEmail,
  }),
  password: z.string().min(1, VALIDATION_MESSAGES.required("Password")),
  remember: z.boolean().optional(),
});

// Reusable room validation schema
export const roomSchema = z.object({
  roomNumber: z.string().min(1, VALIDATION_MESSAGES.required("Room Number")),
  blockName: z.string().min(1, VALIDATION_MESSAGES.required("Block Name")),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().int().positive(VALIDATION_MESSAGES.positive("Capacity"))
  ),
  rent: z.preprocess(
    (val) => Number(val),
    z.number().positive(VALIDATION_MESSAGES.positive("Rent"))
  ),
});

// Reusable student validation schema
export const studentSchema = z.object({
  fullName: z.string().min(1, VALIDATION_MESSAGES.required("Full Name")),
  email: z.string().min(1, VALIDATION_MESSAGES.required("Email")).email(VALIDATION_MESSAGES.invalidEmail),
  phone: z.string().min(1, VALIDATION_MESSAGES.required("Phone Number")).regex(/^\+?[1-9]\d{1,14}$/, VALIDATION_MESSAGES.phone),
  collegeId: z.string().min(1, VALIDATION_MESSAGES.required("College ID")),
  roomNumber: z.string().optional(),
});
