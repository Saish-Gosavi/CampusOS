# Reports - Attendance Report

| Field | Value |
|--------|--------|
| Role | Admin, Warden |
| Phase | TBD |
| Depends on | Database_Attendance_Database |

## Cross-cutting

Student attendance summaries. This feature handles the core business logic for Attendance Report within the Reports domain. It requires strict RBAC enforcement for the Admin, Warden role and audit logging of all significant actions.

## Sub-modules & Goals

1. **Primary Interface**: Provide UI/API for Attendance Report.
2. **Validation**: Ensure data integrity and business rules are met.
3. **Logging**: Record actions for audit.

## Data (Existing vs New)

### Existing
- Relevant module tables

### New
- N/A (Extends existing schema or creates specific pivot tables)

## API Checklist

- [ ] GET /api/reports/attendance-report
- [ ] POST /api/reports/attendance-report
