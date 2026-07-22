# Warden - Room Inspection

| Field | Value |
|--------|--------|
| Role | Warden |
| Phase | TBD |
| Depends on | Database_Room_Database |

## Cross-cutting

Record room inspections and maintenance status. This feature handles the core business logic for Room Inspection within the Warden domain. It requires strict RBAC enforcement for the Warden role and audit logging of all significant actions.

## Sub-modules & Goals

1. **Primary Interface**: Provide UI/API for Room Inspection.
2. **Validation**: Ensure data integrity and business rules are met.
3. **Logging**: Record actions for audit.

## Data (Existing vs New)

### Existing
- Relevant module tables

### New
- N/A (Extends existing schema or creates specific pivot tables)

## API Checklist

- [ ] GET /api/warden/room-inspection
- [ ] POST /api/warden/room-inspection
