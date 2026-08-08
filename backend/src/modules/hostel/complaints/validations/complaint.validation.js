import { z } from "zod";

export const complaintSchema = z.object({
  studentId: z.number().int("Student ID must be an integer").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().optional().default("medium"),
  status: z.string().optional().default("open"),
});

export const updateComplaintSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
});

export const rejectComplaintSchema = z.object({
  rejectionReason: z.string().min(1, "Rejection reason is required"),
});

export const resolveComplaintSchema = z.object({
  resolution: z.string().min(1, "Resolution note is required"),
});
