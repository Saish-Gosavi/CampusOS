import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const UPLOAD_DIR = path.join(__dirname, "../../uploads/allotment-templates");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_TEMPLATE_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
};

const ALLOWED_IMAGE_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const templateStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `template-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const isTemplate =
    file.fieldname === "templateFile" &&
    Object.keys(ALLOWED_TEMPLATE_TYPES).includes(file.mimetype);

  const isImage =
    file.fieldname === "templateImage" &&
    Object.keys(ALLOWED_IMAGE_TYPES).includes(file.mimetype);

  if (isTemplate || isImage) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type for ${file.fieldname}. Allowed: PDF/DOCX for template, PNG/JPG for image.`
      ),
      false
    );
  }
};

export const templateUpload = multer({
  storage: templateStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max per file
    files: 2, // max 2 files (template + image)
  },
});

// Helper — resolve relative stored path from full disk path
export const relativeUploadPath = (fullPath) => {
  if (!fullPath) return null;
  return fullPath.replace(/\\/g, "/").split("uploads/allotment-templates/")[1] || fullPath;
};

// Helper — resolve URL path for serving static file
export const getTemplateFileUrl = (req, fileName) => {
  if (!fileName) return null;
  return `${req.protocol}://${req.get("host")}/uploads/allotment-templates/${fileName}`;
};

// Safe file deletion helper
export const safeDeleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`[templateUpload] Could not delete file: ${filePath}`, err.message);
  }
};

export { UPLOAD_DIR };
