import { LettersService } from "../services/letters.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { prisma } from "../../../config/prisma.js";

export class LettersController {
  static async getStudentRequests(req, res, next) {
    try {
      if (!req.user.role || req.user.role.toLowerCase() !== "student") {
        return apiResponse.error(res, "Only students can fetch their requests", 403);
      }
      const studentProfile = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (!studentProfile) {
        return apiResponse.error(res, "Student profile not found", 404);
      }
      const studentProfileId = studentProfile.id;

      const requests = await LettersService.getStudentRequests(studentProfileId);
      return apiResponse.success(res, requests, "Requests fetched successfully");
    } catch (err) {
      next(err);
    }
  }

  static async getHostelRequests(req, res, next) {
    try {
      if (!req.user.role || req.user.role.toLowerCase() !== "warden") {
        return apiResponse.error(res, "Only wardens can view hostel requests", 403);
      }
      const wardenProfile = await prisma.warden.findUnique({ where: { userId: req.user.id } });
      if (!wardenProfile || !wardenProfile.hostelId) {
        return apiResponse.error(res, "Warden is not assigned to a hostel", 400);
      }
      const hostelId = wardenProfile.hostelId;

      const requests = await LettersService.getHostelRequests(hostelId);
      return apiResponse.success(res, requests, "Hostel requests fetched successfully");
    } catch (err) {
      console.error("GET HOSTEL REQUESTS ERROR:", err);
      next(err);
    }
  }

  static async requestLetter(req, res, next) {
    try {
      if (!req.user.role || req.user.role.toLowerCase() !== "student") {
        return apiResponse.error(res, "Only students can request letters", 403);
      }
      const studentProfile = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (!studentProfile) {
        return apiResponse.error(res, "Student profile not found", 404);
      }
      const studentProfileId = studentProfile.id;

      const request = await LettersService.requestLetter(studentProfileId);
      return apiResponse.success(res, request, "Letter requested successfully", 201);
    } catch (err) {
      next(err);
    }
  }

  static async approveLetter(req, res, next) {
    try {
      if (!req.user.role || req.user.role.toLowerCase() !== "warden") {
        return apiResponse.error(res, "Only wardens can approve letters", 403);
      }
      const wardenProfile = await prisma.warden.findUnique({ where: { userId: req.user.id } });
      if (!wardenProfile) {
        return apiResponse.error(res, "Warden profile not found", 404);
      }
      const wardenProfileId = wardenProfile.id;

      const request = await LettersService.approveLetter(req.params.id, wardenProfileId);
      return apiResponse.success(res, request, "Letter approved successfully");
    } catch (err) {
      next(err);
    }
  }
}
