# Authentication - Forgot Password

| Field | Value |
|--------|--------|
| Role | All Users |
| Phase | TBD |
| Depends on | Authentication_Login |

## Cross-cutting

Password reset using email verification or OTP. This feature handles the core business logic for Forgot Password within the Authentication domain. It requires strict RBAC enforcement for the All Users role and audit logging of all significant actions.

## Sub-modules & Goals

1. **Primary Interface**: Provide UI/API for Forgot Password.
2. **Validation**: Ensure data integrity and business rules are met.
3. **Logging**: Record actions for audit.

## Data (Existing vs New)

### Existing
- Relevant module tables

### New
- N/A (Extends existing schema or creates specific pivot tables)

## API Checklist

- [ ] GET /api/authentication/forgot-password
- [ ] POST /api/authentication/forgot-password
