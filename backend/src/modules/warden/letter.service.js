import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import { AuditLogService } from "../../core/audit/auditLog.service.js";

export class WardenLetterService {
  /**
   * Generates a physical PDF on the backend, overlays admin templates, and places student details.
   */
  static async generateLetterFile(letterReq, referenceNo, signedByName) {
    const pdfDoc = await PDFDocument.create();
    // A4 size standard dimensions in points
    const page = pdfDoc.addPage([595.276, 841.890]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 1. Fetch active template
    const activeTemplate = await prisma.allotmentTemplate.findFirst({
      where: { isActive: true }
    });

    // Helper to embed full A4 overlay from uploaded PDFs
    const embedTemplateSection = async (sectionPath) => {
      if (!sectionPath) return;

      let fullPath = sectionPath;
      if (!path.isAbsolute(fullPath)) {
        fullPath = path.join(process.cwd(), "uploads", "allotment-templates", sectionPath);
      }

      if (fs.existsSync(fullPath)) {
        try {
          const sectionBytes = fs.readFileSync(fullPath);
          const srcDoc = await PDFDocument.load(sectionBytes);
          if (srcDoc.getPageCount() > 0) {
            const [embeddedPage] = await pdfDoc.embedPages([srcDoc.getPages()[0]]);
            page.drawPage(embeddedPage, {
              x: 0,
              y: 0,
              width: page.getWidth(),
              height: page.getHeight()
            });
          }
        } catch (e) {
          console.warn("Failed to overlay PDF section: " + sectionPath, e.message);
        }
      }
    };

    // 2. Draw/embed Header
    if (activeTemplate?.headerPdfPath) {
      await embedTemplateSection(activeTemplate.headerPdfPath);
    } else {
      // Vector fallback Header accent bar
      page.drawRectangle({
        x: 0,
        y: 835,
        width: 595.276,
        height: 7,
        color: rgb(123 / 255, 76 / 255, 237 / 255)
      });
    }

    // Embed Logo/Main formatting template
    if (activeTemplate?.mainPdfPath) {
      await embedTemplateSection(activeTemplate.mainPdfPath);
    }

    // Embed terms (College Stamp) template
    if (activeTemplate?.termsPdfPath) {
      await embedTemplateSection(activeTemplate.termsPdfPath);
    }

    // 3. Draw Document Title & Header Text
    page.drawText("CAMPUS OS — HOSTEL ALLOCATION LETTER", {
      x: 100,
      y: 750,
      size: 16,
      font: fontBold,
      color: rgb(15 / 255, 23 / 255, 42 / 255)
    });

    page.drawText("Official Resident Room Allocation Certificate", {
      x: 160,
      y: 730,
      size: 10,
      font,
      color: rgb(100 / 255, 116 / 255, 139 / 255)
    });

    page.drawLine({
      start: { x: 50, y: 715 },
      end: { x: 545, y: 715 },
      thickness: 0.5,
      color: rgb(226 / 255, 232 / 255, 240 / 255)
    });

    // 4. Draw Reference Box
    page.drawRectangle({
      x: 50,
      y: 640,
      width: 495,
      height: 60,
      color: rgb(248 / 255, 250 / 255, 252 / 255),
      borderColor: rgb(203 / 255, 213 / 255, 225 / 255),
      borderWidth: 0.5
    });

    page.drawText(`Reference No: ${referenceNo}`, {
      x: 70,
      y: 675,
      size: 10,
      font: fontBold,
      color: rgb(123 / 255, 76 / 255, 237 / 255)
    });

    page.drawText(`Issue Date: ${new Date().toLocaleDateString()}`, {
      x: 350,
      y: 675,
      size: 10,
      font: fontBold,
      color: rgb(123 / 255, 76 / 255, 237 / 255)
    });

    page.drawText(`Status: Official Allocation Certificate`, {
      x: 70,
      y: 655,
      size: 9,
      font,
      color: rgb(100 / 255, 116 / 255, 139 / 255)
    });

    page.drawText(`Signed By: ${signedByName}`, {
      x: 350,
      y: 655,
      size: 9,
      font,
      color: rgb(100 / 255, 116 / 255, 139 / 255)
    });

    // 5. Draw Details Title & Grid
    page.drawText("Resident & Allocation Details", {
      x: 50,
      y: 595,
      size: 12,
      font: fontBold,
      color: rgb(15 / 255, 23 / 255, 42 / 255)
    });

    const student = letterReq.student;
    const studentName = student?.fullName || student?.user?.name || "N/A";
    const studentEmail = student?.user?.email || "N/A";
    const collegeId = student?.collegeId || "N/A";
    const alloc = student?.allocations?.[0];
    const hostelName = letterReq.hostel?.name || alloc?.bed?.room?.floor?.block?.hostel?.name || "Main Campus Hostel";
    const blockName = alloc?.bed?.room?.floor?.block?.name || "Block A";
    const floorNum = alloc?.bed?.room?.floor?.number ? `Floor ${alloc.bed.room.floor.number}` : "Ground Floor";
    const roomNum = alloc?.bed?.room?.number ? `Room ${alloc.bed.room.number}` : "Unassigned";
    const bedNum = alloc?.bed?.number ? `Bed ${alloc.bed.number}` : "Bed 1";

    let gridY = 565;
    const drawRow = (label1, val1, label2, val2) => {
      page.drawText(label1, { x: 70, y: gridY, size: 9, font: fontBold, color: rgb(100 / 255, 116 / 255, 139 / 255) });
      page.drawText(val1, { x: 180, y: gridY, size: 9, font, color: rgb(15 / 255, 23 / 255, 42 / 255) });
      page.drawText(label2, { x: 320, y: gridY, size: 9, font: fontBold, color: rgb(100 / 255, 116 / 255, 139 / 255) });
      page.drawText(val2, { x: 420, y: gridY, size: 9, font, color: rgb(15 / 255, 23 / 255, 42 / 255) });
      gridY -= 20;
    };

    drawRow("Student Name:", studentName, "Hostel Name:", hostelName);
    drawRow("College ID:", collegeId, "Block / Wing:", blockName);
    drawRow("Email Address:", studentEmail, "Floor / Level:", floorNum);
    drawRow("Approval Status:", "Approved & Valid", "Room & Bed:", `${roomNum} (${bedNum})`);

    // 6. Draw Guidelines Box
    page.drawRectangle({
      x: 50,
      y: 330,
      width: 495,
      height: 120,
      color: rgb(248 / 255, 250 / 255, 252 / 255),
      borderColor: rgb(226 / 255, 232 / 255, 240 / 255),
      borderWidth: 0.5
    });

    page.drawText("Rules & Regulations Guidelines", {
      x: 70,
      y: 430,
      size: 10,
      font: fontBold,
      color: rgb(15 / 255, 23 / 255, 42 / 255)
    });

    const guidelines = [
      "1. Resident must strictly adhere to hostel curfew rules and maintain peace.",
      "2. Unauthorized transfer of room or bed assignment is strictly prohibited.",
      "3. Residents are responsible for keeping their room and common areas clean.",
      "4. This allocation letter is valid for the academic semester and subject to warden review.",
      "5. Possession of prohibited substances or damaging hostel property will cause immediate cancellation."
    ];

    let guideY = 405;
    guidelines.forEach((g) => {
      page.drawText(g, { x: 70, y: guideY, size: 8, font, color: rgb(71 / 255, 85 / 255, 105 / 255) });
      guideY -= 15;
    });

    // 7. Draw Signatures
    page.drawLine({ start: { x: 70, y: 220 }, end: { x: 220, y: 220 }, thickness: 0.5, color: rgb(203 / 255, 213 / 255, 225 / 255) });
    page.drawText("Student Signature", { x: 100, y: 205, size: 9, font: fontBold, color: rgb(15 / 255, 23 / 255, 42 / 255) });

    page.drawLine({ start: { x: 375, y: 220 }, end: { x: 525, y: 220 }, thickness: 0.5, color: rgb(203 / 255, 213 / 255, 225 / 255) });
    page.drawText("Warden Signature & Stamp", { x: 385, y: 205, size: 9, font: fontBold, color: rgb(15 / 255, 23 / 255, 42 / 255) });

    // Embed Footer
    if (activeTemplate?.footerPdfPath) {
      await embedTemplateSection(activeTemplate.footerPdfPath);
    } else {
      page.drawText(`Generated via CampusOS Portal on ${new Date().toLocaleString()}`, {
        x: 180,
        y: 30,
        size: 8,
        font,
        color: rgb(148 / 255, 163 / 255, 184 / 255)
      });
    }

    // 8. Save PDF file on backend disk
    const lettersDir = path.join(process.cwd(), "uploads/letters");
    if (!fs.existsSync(lettersDir)) {
      fs.mkdirSync(lettersDir, { recursive: true });
    }

    const fileName = `letter-${referenceNo}.pdf`;
    const fullPath = path.join(lettersDir, fileName);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(fullPath, pdfBytes);

    return `/uploads/letters/${fileName}`;
  }

  /**
   * Fetch all letter requests for Warden's hostel (or all requests for admin).
   */
  static async getWardenRequests(user) {
    const userRole = (user.role || "").toLowerCase();
    let hostelId = user.hostelId;

    if (userRole === "warden") {
      const warden = await prisma.warden.findUnique({ where: { userId: user.id } });
      if (warden?.hostelId) {
        hostelId = warden.hostelId;
      }
    }

    const where = hostelId ? { hostelId: Number(hostelId) } : {};

    return prisma.letterRequest.findMany({
      where,
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            allocations: {
              where: { status: "active" },
              include: {
                bed: {
                  include: {
                    room: {
                      include: {
                        floor: {
                          include: {
                            block: {
                              include: { hostel: true }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        hostel: { select: { id: true, name: true, city: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
        allotmentLetter: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  /**
   * Approve a letter request.
   */
  static async approveRequest(requestId, user, reqMeta = {}) {
    // --- Mock Data Handling for Frontend Testing ---
    if (String(requestId).startsWith("dummy-")) {
      return { id: requestId, status: "Approved" };
    }
    // -----------------------------------------------
    const id = Number(requestId);
    const existing = await prisma.letterRequest.findUnique({
      where: { id },
      include: { student: { include: { user: { select: { name: true, email: true } } } } }
    });

    if (!existing) {
      throw new AppError("Letter request not found", 404);
    }

    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        status: "Approved",
        rejectionReason: null,
        approvedById: user.id
      },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        hostel: { select: { id: true, name: true } },
        allotmentLetter: true
      }
    });

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: "Approve Letter Request",
      description: `Warden approved allocation letter request #${id} for student ${existing.student?.fullName || existing.student?.user?.name}`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return updated;
  }

  /**
   * Reject a letter request with reason.
   */
  static async rejectRequest(requestId, user, rejectionReason, reqMeta = {}) {
    // --- Mock Data Handling for Frontend Testing ---
    if (String(requestId).startsWith("dummy-")) {
      if (!rejectionReason || !rejectionReason.trim()) {
        throw new AppError("Rejection reason is required", 400);
      }
      return { id: requestId, status: "Rejected", rejectionReason };
    }
    // -----------------------------------------------
    const id = Number(requestId);
    const existing = await prisma.letterRequest.findUnique({
      where: { id },
      include: { student: { include: { user: { select: { name: true, email: true } } } } }
    });

    if (!existing) {
      throw new AppError("Letter request not found", 404);
    }

    if (!rejectionReason || !rejectionReason.trim()) {
      throw new AppError("Rejection reason is required", 400);
    }

    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        status: "Rejected",
        rejectionReason: rejectionReason.trim(),
        approvedById: user.id
      },
      include: {
        student: { include: { user: { select: { name: true, email: true } } } },
        hostel: { select: { id: true, name: true } }
      }
    });

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: "Reject Letter Request",
      description: `Warden rejected allocation letter request #${id} for student ${existing.student?.fullName || existing.student?.user?.name}. Reason: ${rejectionReason}`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return updated;
  }

  /**
   * Generate Allotment Letter for an approved request.
   */
  static async generateLetter(requestId, user, reqMeta = {}) {
    // --- Mock Data Handling for Frontend Testing ---
    if (String(requestId).startsWith("dummy-")) {
      const referenceNo = `MOCK-AL-${new Date().getFullYear()}-001`;
      const signedByName = user?.name || "Warden Office";
      
      const mockReq = {
        student: {
          fullName: "Test Student (Dummy)",
          user: { email: "test@campusos.com", name: "Test Student (Dummy)" },
          collegeId: "STU-TEST-001",
          allocations: [{ bed: { number: "T1", room: { number: "T-100", floor: { number: 1, block: { name: "Test Block", hostel: { name: "Main Campus Hostel" } } } } } }]
        },
        hostel: { name: "Main Campus Hostel" }
      };
      
      const pdfPath = await this.generateLetterFile(mockReq, referenceNo, signedByName);
      return { pdfPath, referenceNo };
    }
    // -----------------------------------------------

    const id = Number(requestId);
    const letterReq = await prisma.letterRequest.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            allocations: {
              where: { status: "active" },
              include: {
                bed: {
                  include: {
                    room: {
                      include: {
                        floor: {
                          include: {
                            block: {
                              include: { hostel: true }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        hostel: true,
        allotmentLetter: true
      }
    });

    if (!letterReq) {
      throw new AppError("Letter request not found", 404);
    }

    if (letterReq.status !== "Approved" && letterReq.status !== "Generated") {
      throw new AppError("Only approved requests can have a letter generated", 400);
    }

    let letter = letterReq.allotmentLetter;
    const isRegenerate = Boolean(letter);

    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    const referenceNo = letter?.referenceNo || `AL-${year}-${rand}`;
    const signedByName = user.name || "Warden Office";

    // 1. Generate & save PDF on backend
    const pdfPath = await this.generateLetterFile(letterReq, referenceNo, signedByName);

    if (!letter) {
      const activeAllocation = letterReq.student?.allocations?.[0];

      letter = await prisma.roomAllotmentLetter.create({
        data: {
          letterRequestId: letterReq.id,
          allocationId: activeAllocation?.id || null,
          referenceNo,
          issuedDate: new Date(),
          signedBy: signedByName,
          generatedById: user.id,
          pdfPath
        }
      });

      await prisma.letterRequest.update({
        where: { id },
        data: { status: "Generated" }
      });
    } else {
      // Update letter with new generated date & path
      letter = await prisma.roomAllotmentLetter.update({
        where: { id: letter.id },
        data: {
          issuedDate: new Date(),
          generatedById: user.id,
          pdfPath
        }
      });
    }

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: isRegenerate ? "Regenerated Letter" : "Letter Generated",
      description: `${isRegenerate ? "Regenerated" : "Generated"} room allocation letter ref: ${letter.referenceNo} for student ${letterReq.student?.fullName || letterReq.student?.user?.name}`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return letter;
  }

  /**
   * Student submits letter request.
   */
  static async studentSubmitRequest(user, reqMeta = {}) {
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        allocations: {
          where: { status: "active" },
          include: { bed: { include: { room: { include: { floor: { include: { block: true } } } } } } }
        }
      }
    });

    if (!student) {
      throw new AppError("Student profile not found", 404);
    }

    // Check existing pending request
    const existingPending = await prisma.letterRequest.findFirst({
      where: {
        studentId: student.id,
        status: { in: ["Pending", "Approved"] }
      }
    });

    if (existingPending) {
      throw new AppError("You already have an active allocation letter request in process", 400);
    }

    const hostelId = student.allocations?.[0]?.bed?.room?.floor?.block?.hostelId || user.hostelId || null;

    const request = await prisma.letterRequest.create({
      data: {
        studentId: student.id,
        hostelId: hostelId ? Number(hostelId) : null,
        status: "Pending"
      },
      include: {
        hostel: { select: { name: true } }
      }
    });

    await AuditLogService.logAction({
      userId: user.id,
      module: "Hostel Operations",
      action: "Request Submitted",
      description: `Student ${student.fullName} submitted a Hostel Allocation Letter Request`,
      status: "Success",
      ipAddress: reqMeta.ip,
      userAgent: reqMeta.userAgent
    });

    return request;
  }

  /**
   * Student views their letter requests.
   */
  static async studentGetRequests(user) {
    const student = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return [];

    return prisma.letterRequest.findMany({
      where: { studentId: student.id },
      include: {
        hostel: { select: { id: true, name: true, city: true } },
        approvedBy: { select: { name: true } },
        allotmentLetter: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
