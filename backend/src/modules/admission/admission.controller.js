import * as svc from "./admission.service.js";

// PUBLIC: Get form config (filtered to only enabled items)
export async function getPublicConfig(req, res) {
  try {
    const hostelId = req.query.hostelId || null;
    const config = await svc.getConfig(hostelId);
    // Only expose enabled fields/docs to public
    const publicConfig = {
      fields: config.fields.filter(f => f.enabled),
      documents: config.documents.filter(d => d.enabled)
    };
    res.json({ success: true, data: publicConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUBLIC: Submit application
export async function submitApplication(req, res) {
  try {
    const hostelId = req.body.hostelId || null;
    // Extract text fields (exclude hostelId)
    const { hostelId: _hid, ...fields } = req.body;
    const files = req.files || [];
    const app = await svc.submitApplication(fields, files, hostelId);
    res.status(201).json({ success: true, data: app, message: "Application submitted successfully! We will contact you soon." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ADMIN: List applications
export async function listApplications(req, res) {
  try {
    const { status, hostelId, page, limit } = req.query;
    const result = await svc.listApplications({ status, hostelId, page, limit });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ADMIN: Get single application
export async function getApplication(req, res) {
  try {
    const app = await svc.getApplication(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ADMIN: Approve / Reject
export async function updateStatus(req, res) {
  try {
    const { status, remarks } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const app = await svc.updateStatus(req.params.id, status, remarks);
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ADMIN: Get full config (for editing)
export async function getAdminConfig(req, res) {
  try {
    const hostelId = req.query.hostelId || null;
    const config = await svc.getConfig(hostelId);
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ADMIN: Update config
export async function updateAdminConfig(req, res) {
  try {
    const hostelId = req.query.hostelId || null;
    const config = await svc.updateConfig(req.body, hostelId);
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
