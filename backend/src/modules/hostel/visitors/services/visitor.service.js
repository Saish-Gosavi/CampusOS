import { VisitorRepository } from "../repository/visitor.repository.js";

export class VisitorService {
  static async getAll() {
    return VisitorRepository.findAll();
  }

  /** Returns only Pending requests — for Warden review queue */
  static async getPending() {
    return VisitorRepository.findPending();
  }

  /** Returns warden-processed requests — for Hostel Admin view */
  static async getProcessed() {
    return VisitorRepository.findProcessed();
  }

  static async getById(id) {
    return VisitorRepository.findById(id);
  }

  static async create(data) {
    const payload = {
      studentName: data.studentName?.trim() || "Unknown Student",
      fullName: data.fullName?.trim(),
      visitorPhone: data.visitorPhone || null,
      visitorIdProof: data.visitorIdProof || null,
      relationship: data.relationship,
      purpose: data.purpose || null,
      status: "Pending", // always starts as Pending
      checkIn: data.checkIn ? new Date(data.checkIn) : null,
      checkOut: data.checkOut ? new Date(data.checkOut) : null,
    };
    return VisitorRepository.create(payload);
  }

  /** Warden-specific review: can only set Approved or Rejected */
  static async wardenReview(id, { status, wardenRemarks, reviewedBy }) {
    if (!["Approved", "Rejected"].includes(status)) {
      throw new Error("Warden can only set status to Approved or Rejected");
    }
    return VisitorRepository.update(id, {
      status,
      wardenRemarks: wardenRemarks || null,
      reviewedBy: reviewedBy || "Warden",
      remarks: wardenRemarks || (status === "Approved"
        ? "Approved by Warden."
        : "Rejected by Warden."),
    });
  }

  static async update(id, data) {
    const payload = { ...data };
    if (payload.checkIn) payload.checkIn = new Date(payload.checkIn);
    if (payload.checkOut) payload.checkOut = new Date(payload.checkOut);
    delete payload.studentId;
    return VisitorRepository.update(id, payload);
  }

  static async delete(id) {
    return VisitorRepository.delete(id);
  }
}
