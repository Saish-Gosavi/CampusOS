import { prisma } from "../../config/prisma.js";
import { sendEmail } from "../../config/mail.js";
import bcrypt from "bcryptjs";
import path from "path";

const DEFAULT_CONFIG = {
  fields: [
    { key: "fullName",    label: "Full Name",           type: "text",     required: true,  enabled: true },
    { key: "email",       label: "Email Address",        type: "email",    required: true,  enabled: true },
    { key: "phone",       label: "Phone Number",         type: "tel",      required: true,  enabled: true },
    { key: "dob",         label: "Date of Birth",        type: "date",     required: true,  enabled: true },
    { key: "gender",      label: "Gender",               type: "select",   required: true,  enabled: true,  options: ["Male", "Female", "Other"] },
    { key: "collegeName", label: "College Name",         type: "text",     required: true,  enabled: true },
    { key: "branch",      label: "Branch / Department",  type: "text",     required: true,  enabled: true },
    { key: "year",        label: "Year of Study",        type: "select",   required: true,  enabled: true,  options: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
    { key: "address",     label: "Permanent Address",    type: "textarea", required: false, enabled: true },
    { key: "parentName",  label: "Parent / Guardian Name", type: "text",  required: false, enabled: true },
    { key: "parentPhone", label: "Parent Phone Number",  type: "tel",      required: false, enabled: false }
  ],
  documents: [
    { key: "aadharCard",        label: "Aadhar Card",           required: true,  enabled: true },
    { key: "incomeCertificate", label: "Income Certificate",    required: false, enabled: true },
    { key: "feesReceipt",       label: "College Fees Receipt",  required: true,  enabled: true },
    { key: "photo",             label: "Passport Photo",        required: true,  enabled: true },
    { key: "casteCertificate",  label: "Caste Certificate",     required: false, enabled: false }
  ]
};

// Get or create global config
export async function getConfig(hostelId = null) {
  const where = hostelId ? { hostelId: Number(hostelId) } : { hostelId: null };
  let config = await prisma.registrationConfig.findFirst({ where });
  if (!config) {
    config = await prisma.registrationConfig.create({
      data: { hostelId: hostelId ? Number(hostelId) : null, config: DEFAULT_CONFIG }
    });
  }
  return config.config;
}

// Update config
export async function updateConfig(configData, hostelId = null) {
  const where = hostelId ? { hostelId: Number(hostelId) } : { hostelId: null };
  const existing = await prisma.registrationConfig.findFirst({ where });
  if (existing) {
    return prisma.registrationConfig.update({ where: { id: existing.id }, data: { config: configData } });
  }
  return prisma.registrationConfig.create({
    data: { hostelId: hostelId ? Number(hostelId) : null, config: configData }
  });
}

// Submit application
export async function submitApplication(fields, uploadedFiles, hostelId = null) {
  const documents = uploadedFiles.map(f => ({
    key: f.fieldname,
    label: f.originalname,
    path: `/uploads/admissions/${f.filename}`,
    filename: f.filename
  }));

  return prisma.admissionApplication.create({
    data: {
      data: fields,
      documents,
      status: "pending",
      hostelId: hostelId ? Number(hostelId) : null
    }
  });
}

// List all applications
export async function listApplications({ status, hostelId, page = 1, limit = 20 }) {
  const where = {};
  if (status && status !== "all") where.status = status;
  if (hostelId) where.hostelId = Number(hostelId);

  const skip = (Number(page) - 1) * Number(limit);
  const [total, items] = await Promise.all([
    prisma.admissionApplication.count({ where }),
    prisma.admissionApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
      include: { hostel: { select: { id: true, name: true } } }
    })
  ]);
  return { total, page: Number(page), limit: Number(limit), items };
}

// Get single application
export async function getApplication(id) {
  return prisma.admissionApplication.findUnique({
    where: { id: Number(id) },
    include: { hostel: { select: { id: true, name: true } } }
  });
}

// Update application status + Create Student Account & Send Email Notification
export async function updateStatus(id, status, remarks = null) {
  const application = await prisma.admissionApplication.findUnique({
    where: { id: Number(id) }
  });

  if (!application) {
    throw new Error("Admission application not found");
  }

  const updatedApp = await prisma.admissionApplication.update({
    where: { id: Number(id) },
    data: { status, remarks }
  });

  const data = application.data || {};
  const studentEmail = data.email;
  const fullName = data.fullName || data.name || "Student";
  const phone = data.phone || "";
  let generatedPassword = null;

  if (status === "approved" && studentEmail) {
    // 1. Get or create student role
    let studentRole = await prisma.role.findFirst({
      where: { name: { equals: "student" } }
    });
    if (!studentRole) {
      studentRole = await prisma.role.create({
        data: { name: "student", description: "Hostel Student" }
      });
    }

    // 2. Create student user account if it doesn't exist
    let user = await prisma.user.findUnique({
      where: { email: studentEmail.toLowerCase() }
    });

    if (!user) {
      generatedPassword = `Student@${Math.floor(1000 + Math.random() * 9000)}`;
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      user = await prisma.user.create({
        data: {
          email: studentEmail.toLowerCase(),
          password: hashedPassword,
          name: fullName,
          roleId: studentRole.id,
          status: "active",
          hostelId: application.hostelId || null
        }
      });
    }

    // 3. Ensure student profile
    const existingStudent = await prisma.student.findUnique({
      where: { userId: user.id }
    });
    if (!existingStudent) {
      const collegeId = `STU-${Date.now().toString().slice(-6)}`;
      await prisma.student.create({
        data: {
          userId: user.id,
          fullName,
          phone: phone || "N/A",
          collegeId
        }
      });
    }

    // 4. Send Approval Email with Credentials
    try {
      await sendEmail({
        to: studentEmail,
        subject: "🎉 Admission Application Approved - CampusOS Hostel Portal",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
              <h2 style="color: #2563eb; margin: 0;">CampusOS Hostel Portal</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Hostel Admission Confirmation</p>
            </div>

            <div style="padding: 20px 0;">
              <h3 style="color: #16a34a; margin-top: 0;">Congratulations ${fullName}! 🎉</h3>
              <p style="color: #334155; line-height: 1.6;">
                We are pleased to inform you that your hostel admission application has been <strong style="color: #16a34a;">APPROVED</strong> by the hostel administration.
              </p>

              ${remarks ? `<div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px; margin: 16px 0; border-radius: 4px;">
                <strong style="color: #475569; font-size: 13px;">Admin Remarks:</strong>
                <p style="color: #334155; margin: 4px 0 0 0; font-size: 14px;">${remarks}</p>
              </div>` : ''}

              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 12px 0; color: #0f172a;">🔑 Your Student Login Credentials:</h4>
                <p style="margin: 6px 0; color: #334155;"><strong>Portal URL:</strong> <a href="http://localhost:5173/login" style="color: #2563eb; text-decoration: underline;">http://localhost:5173/login</a></p>
                <p style="margin: 6px 0; color: #334155;"><strong>Email:</strong> ${studentEmail}</p>
                ${generatedPassword ? `<p style="margin: 6px 0; color: #334155;"><strong>Temporary Password:</strong> <code style="background-color: #e2e8f0; padding: 3px 8px; border-radius: 4px; color: #0f172a; font-weight: bold; font-size: 15px;">${generatedPassword}</code></p>` : `<p style="margin: 6px 0; color: #64748b;">(Use your existing account password to sign in)</p>`}
              </div>

              <p style="color: #64748b; font-size: 13px;">
                Please sign in to your student portal to view your assigned hostel details and manage your account.
              </p>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
              &copy; ${new Date().getFullYear()} CampusOS College Management System
            </div>
          </div>
        `
      });
    } catch (mailErr) {
      console.error("[Email Notification Failed]", mailErr.message);
    }
  }

  if (status === "rejected" && studentEmail) {
    // Send Rejection Email
    try {
      await sendEmail({
        to: studentEmail,
        subject: "Status Update: Hostel Admission Application - CampusOS",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
              <h2 style="color: #2563eb; margin: 0;">CampusOS Hostel Portal</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Hostel Admission Update</p>
            </div>

            <div style="padding: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">Hello ${fullName},</h3>
              <p style="color: #334155; line-height: 1.6;">
                Thank you for applying for hostel accommodation. We regret to inform you that your admission application has been <strong style="color: #dc2626;">REJECTED</strong> at this time.
              </p>

              ${remarks ? `<div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 16px 0; border-radius: 4px;">
                <strong style="color: #991b1b; font-size: 13px;">Reason / Remarks:</strong>
                <p style="color: #7f1d1d; margin: 4px 0 0 0; font-size: 14px;">${remarks}</p>
              </div>` : ''}

              <p style="color: #64748b; font-size: 13px; margin-top: 20px;">
                If you have questions or believe this decision was made in error, please contact the hostel administration office.
              </p>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
              &copy; ${new Date().getFullYear()} CampusOS College Management System
            </div>
          </div>
        `
      });
    } catch (mailErr) {
      console.error("[Email Notification Failed]", mailErr.message);
    }
  }

  return {
    ...updatedApp,
    generatedPassword
  };
}


