import { prisma } from "../../../config/prisma.js";
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

// Update application status
export async function updateStatus(id, status, remarks = null) {
  return prisma.admissionApplication.update({
    where: { id: Number(id) },
    data: { status, remarks }
  });
}
