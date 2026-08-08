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
    // A4 size standard dimensions in points (595.276 x 841.890)
    const page = pdfDoc.addPage([595.276, 841.890]);
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // 1. Fetch active template uploaded by Admin
    const activeTemplate = await prisma.allotmentTemplate.findFirst({
      where: { isActive: true }
    });

    // Helper to embed asset (PDF or PNG/JPG image) at specific coordinates
    const embedAsset = async (assetPath, defaultCoords = {}) => {
      if (!assetPath) return false;

      let fullPath = assetPath;
      if (!path.isAbsolute(fullPath)) {
        fullPath = path.join(process.cwd(), "uploads", "allotment-templates", assetPath);
      }

      if (!fs.existsSync(fullPath)) return false;

      try {
        const fileBytes = fs.readFileSync(fullPath);
        const ext = path.extname(fullPath).toLowerCase();

        if (ext === ".pdf") {
          const srcDoc = await PDFDocument.load(fileBytes);
          if (srcDoc.getPageCount() > 0) {
            const [embeddedPage] = await pdfDoc.embedPages([srcDoc.getPages()[0]]);
            const drawOpts = {
              x: defaultCoords.x ?? 0,
              y: defaultCoords.y ?? 0,
              width: defaultCoords.width ?? page.getWidth(),
              height: defaultCoords.height ?? page.getHeight(),
            };
            page.drawPage(embeddedPage, drawOpts);
            return true;
          }
        } else if (ext === ".png") {
          const img = await pdfDoc.embedPng(fileBytes);
          page.drawImage(img, {
            x: defaultCoords.x ?? 0,
            y: defaultCoords.y ?? 0,
            width: defaultCoords.width ?? img.width,
            height: defaultCoords.height ?? img.height,
          });
          return true;
        } else if (ext === ".jpg" || ext === ".jpeg") {
          const img = await pdfDoc.embedJpg(fileBytes);
          page.drawImage(img, {
            x: defaultCoords.x ?? 0,
            y: defaultCoords.y ?? 0,
            width: defaultCoords.width ?? img.width,
            height: defaultCoords.height ?? img.height,
          });
          return true;
        }
      } catch (e) {
        console.warn("Failed to embed section asset: " + assetPath, e.message);
      }
      return false;
    };

    // 2. Embed Header Banner (Top: y = 765 to 842)
    if (activeTemplate?.headerPdfPath) {
      await embedAsset(activeTemplate.headerPdfPath, { x: 0, y: 765, width: 595.276, height: 76.89 });
    }

    // 3. Embed College Logo (Top Right)
    if (activeTemplate?.mainPdfPath) {
      await embedAsset(activeTemplate.mainPdfPath, { x: 470, y: 772, width: 85, height: 55 });
    }

    // 4. Embed Footer Banner (Bottom: y = 0 to 50)
    if (activeTemplate?.footerPdfPath) {
      await embedAsset(activeTemplate.footerPdfPath, { x: 0, y: 0, width: 595.276, height: 50 });
    }

    // 5. Embed College Stamp (Bottom Center)
    if (activeTemplate?.termsPdfPath) {
      await embedAsset(activeTemplate.termsPdfPath, { x: 247, y: 110, width: 100, height: 100 });
    }

    // Student & Allocation details
    const student = letterReq.student;
    const studentName = student?.fullName || student?.user?.name || "N/A";
    const collegeId = student?.collegeId || "N/A";
    const alloc = student?.allocations?.[0];
    const hostelName = letterReq.hostel?.name || alloc?.bed?.room?.floor?.block?.hostel?.name || "Hostel";
    const roomNum = alloc?.bed?.room?.number ? `${alloc.bed.room.number}` : "Unassigned";
    const bedNum = alloc?.bed?.number ? ` (Bed ${alloc.bed.number})` : "";
    const collegeName = letterReq.hostel?.name || "Vasantdada Patil Pratishthan's College of Engineering and Visual Arts";

    const issueDateStr = new Date().toLocaleDateString("en-GB");
    const reportingDateStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB");

    // Title Section matching official letter format sample
    page.drawText(`[${collegeName}]`, {
      x: 50,
      y: 730,
      size: 14,
      font: fontBold,
      color: rgb(15 / 255, 23 / 255, 42 / 255),
    });

    page.drawText("Hostel Administration", {
      x: 50,
      y: 708,
      size: 13,
      font: fontBold,
      color: rgb(30 / 255, 41 / 255, 59 / 255),
    });

    page.drawText("Room Allocation Letter", {
      x: 50,
      y: 686,
      size: 13,
      font: fontBold,
      color: rgb(30 / 255, 41 / 255, 59 / 255),
    });

    page.drawText(`Date: ${issueDateStr}`, {
      x: 50,
      y: 656,
      size: 11,
      font: fontBold,
      color: rgb(30 / 255, 41 / 255, 59 / 255),
    });

    page.drawText(`Ref: ${referenceNo}`, {
      x: 420,
      y: 656,
      size: 9,
      font: fontBold,
      color: rgb(100 / 255, 116 / 255, 139 / 255),
    });

    // Recipient Details
    page.drawText("To,", {
      x: 50,
      y: 625,
      size: 11,
      font: fontBold,
      color: rgb(15 / 255, 23 / 255, 42 / 255),
    });

    page.drawText(`Student Name: ${studentName}`, {
      x: 50,
      y: 605,
      size: 11,
      font: fontBold,
      color: rgb(15 / 255, 23 / 255, 42 / 255),
    });

    page.drawText(`Roll No.: ${collegeId}`, {
      x: 50,
      y: 585,
      size: 11,
      font: fontBold,
      color: rgb(15 / 255, 23 / 255, 42 / 255),
    });

    // Wording matching exact sample format
    const bodyLine1 = `This is to inform you that you have been allotted Room No. ${roomNum}${bedNum} in ${hostelName} for`;
    const bodyLine2 = `the current academic year.`;
    const bodyLine3 = `You are requested to report on or before ${reportingDateStr} and complete the necessary hostel`;
    const bodyLine4 = `formalities. Please follow all hostel rules and maintain discipline during your stay.`;
    const bodyLine5 = `We wish you a comfortable and successful academic year.`;

    page.drawText(bodyLine1, { x: 50, y: 550, size: 10.5, font, color: rgb(15 / 255, 23 / 255, 42 / 255) });
    page.drawText(bodyLine2, { x: 50, y: 535, size: 10.5, font, color: rgb(15 / 255, 23 / 255, 42 / 255) });

    page.drawText(bodyLine3, { x: 50, y: 500, size: 10.5, font, color: rgb(15 / 255, 23 / 255, 42 / 255) });
    page.drawText(bodyLine4, { x: 50, y: 485, size: 10.5, font, color: rgb(15 / 255, 23 / 255, 42 / 255) });

    page.drawText(bodyLine5, { x: 50, y: 450, size: 10.5, font, color: rgb(15 / 255, 23 / 255, 42 / 255) });

    page.drawText("Warden", { x: 50, y: 410, size: 11, font: fontBold, color: rgb(15 / 255, 23 / 255, 42 / 255) });
    page.drawText("Hostel Administration", { x: 50, y: 395, size: 11, font: fontBold, color: rgb(15 / 255, 23 / 255, 42 / 255) });
    page.drawText("Signature & Seal", { x: 50, y: 380, size: 11, font: fontBold, color: rgb(15 / 255, 23 / 255, 42 / 255) });

    // Bottom Signatures line
    page.drawLine({ start: { x: 50, y: 220 }, end: { x: 200, y: 220 }, thickness: 0.5, color: rgb(100 / 255, 116 / 255, 139 / 255) });
    page.drawText("Head, T&P Department", { x: 65, y: 205, size: 9, font: fontBold, color: rgb(15 / 255, 23 / 255, 42 / 255) });

    page.drawLine({ start: { x: 395, y: 220 }, end: { x: 545, y: 220 }, thickness: 0.5, color: rgb(100 / 255, 116 / 255, 139 / 255) });
    page.drawText("Principal", { x: 440, y: 205, size: 9, font: fontBold, color: rgb(15 / 255, 23 / 255, 42 / 255) });

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
