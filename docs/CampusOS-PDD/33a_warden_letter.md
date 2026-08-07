# Warden - Room Allocation Letter (Warden Letter)

| Field | Value |
|--------|--------|
| Role | Warden |
| Phase | TBD |
| Depends on | Authentication_Role_Based_Access |

## Cross-cutting

Upload letter template sections (Header, Footer, Logo, Stamp), manage room allotment letter formats, and generate official allotment letters for resident students. This feature handles the core business logic for Warden Room Allocation Letters within the Warden domain. It requires strict RBAC enforcement for the Warden role and audit logging of all significant actions.

## Sub-modules & Goals

1. **Primary Interface**: Provide UI/API for uploading letter template sections (Header, Footer, College Logo, College Stamp) and generating room allotment letters for students.
2. **Validation**: Ensure data integrity, correct file types (PDF, PNG, JPG), file size limits (max 10MB), and valid student allocation links.
3. **Logging**: Record section uploads, template changes, and letter generation events in audit logs.

## Data (Existing vs New)

### Existing
- `AllotmentTemplate` model
- `Student`, `Hostel`, `Room`, `Bed`, `Allocation` tables

### New
- Template section uploads: `headerPdfPath`, `footerPdfPath`, `mainPdfPath`, `termsPdfPath`

## API Checklist

- [ ] GET /api/warden/allotment-template/active
- [ ] POST /api/warden/allotment-template/upload-section
- [ ] GET /api/warden/room-allotment-letters
- [ ] POST /api/warden/room-allotment-letters/generate
