import { Router } from "express";
import { AllotmentTemplateController } from "../controllers/allotment-template.controller.js";
import { templateUpload } from "../../../../middleware/templateUpload.middleware.js";

const router = Router();

// GET active template
router.get("/active", AllotmentTemplateController.getActive);

// GET all templates (admin history)
router.get("/", AllotmentTemplateController.getAll);

// POST save text-based format
router.post("/save-format", AllotmentTemplateController.saveFormat);

// POST upload PDF and extract text as active format
router.post(
  "/upload-pdf",
  templateUpload.fields([{ name: "pdfFile", maxCount: 1 }]),
  AllotmentTemplateController.uploadPdf
);

// POST upload a new template (multipart/form-data)
router.post(
  "/upload",
  templateUpload.fields([
    { name: "templateFile", maxCount: 1 },
    { name: "templateImage", maxCount: 1 },
  ]),
  AllotmentTemplateController.upload
);

// DELETE a template by ID
router.delete("/:id", AllotmentTemplateController.deleteTemplate);

export default router;
