import { z } from "zod";

export const createVisitorSchema = z.object({
  studentName: z.string({ required_error: "Student name is required" }).min(1, "Student name is required"),
  fullName: z.string({ required_error: "Visitor name is required" }).min(1, "Visitor name is required"),
  visitorPhone: z.string().optional().nullable(),
  visitorIdProof: z.string().optional().nullable(),
  relationship: z.string({ required_error: "Relationship is required" }).min(1, "Relationship is required"),
  purpose: z.string().optional().nullable(),
  checkIn: z.string().optional().nullable(),
  checkOut: z.string().optional().nullable(),
});

export const updateVisitorSchema = z.object({
  fullName: z.string().optional(),
  visitorPhone: z.string().optional().nullable(),
  visitorIdProof: z.string().optional().nullable(),
  relationship: z.string().optional(),
  purpose: z.string().optional().nullable(),
  checkIn: z.string().optional().nullable(),
  checkOut: z.string().optional().nullable(),
  status: z.enum(["Pending", "Approved", "Rejected", "Checked-In", "Checked-Out"]).optional(),
  remarks: z.string().optional().nullable(),
  reviewedBy: z.string().optional().nullable(),
  wardenRemarks: z.string().optional().nullable(),
});

export const wardenReviewSchema = z.object({
  status: z.enum(["Approved", "Rejected"], {
    required_error: "Status must be Approved or Rejected",
  }),
  wardenRemarks: z.string().optional().nullable(),
  reviewedBy: z.string().optional().nullable(),
});

export const visitorSchema = createVisitorSchema;

