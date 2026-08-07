import { LettersRepository } from "../repository/letters.repository.js";
import { prisma } from "../../../config/prisma.js";

function generateReferenceNumber(studentCollegeId) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OCC-${year}${month}-${studentCollegeId}-${randomStr}`;
}

export class LettersService {
  static async getStudentRequests(studentProfileId) {
    return LettersRepository.findForStudent(studentProfileId);
  }

  static async getHostelRequests(hostelId) {
    return LettersRepository.findForHostel(hostelId);
  }

  static async requestLetter(studentProfileId) {
    // Check if there's already a pending request to prevent spam
    const existing = await prisma.occupancyLetterRequest.findFirst({
      where: {
        studentId: Number(studentProfileId),
        status: "pending"
      }
    });

    if (existing) {
      throw new Error("You already have a pending letter request.");
    }

    return LettersRepository.create(studentProfileId);
  }

  static async approveLetter(requestId, wardenProfileId) {
    const request = await LettersRepository.findById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }
    if (request.status !== "pending") {
      throw new Error(`Request is already ${request.status}`);
    }

    const refNo = generateReferenceNumber(request.student.collegeId);
    return LettersRepository.approve(requestId, wardenProfileId, refNo);
  }
}
