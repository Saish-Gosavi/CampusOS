# Admin - Hostel Management

| Field | Value |
|--------|--------|
| Role | Admin |
| Phase | TBD |
| Depends on | Authentication_Role_Based_Access |

## Cross-cutting

Add, edit, delete, and manage hostels within the institute. This module enables the Admin to create and maintain multiple hostel records, including hostel details, capacities, blocks, floors, and room configurations. It enforces strict RBAC for the Admin role and maintains audit logs for all administrative actions.

## Sub-modules & Goals

1. **Hostel Registration**: Add new hostels for the institute with complete hostel information.
2. **Hostel Management**: View, edit, activate/deactivate, and delete hostel records.
3. **Capacity Management**: Configure hostel capacity, blocks, floors, and room availability.
4. **Hostel Assignment**: Assign wardens and manage hostel administrators.
5. **Validation**: Ensure hostel names, capacities, and configurations are valid.
6. **Logging**: Record all hostel-related activities for auditing.

## Data (Existing vs New)

### Existing
- Users
- Admin
- Warden
- Room
- Student

### New
- Hostel
- Hostel_Block
- Hostel_Floor

## API Checklist

- [ ] GET /api/admin/hostels
- [ ] GET /api/admin/hostels/:id
- [ ] POST /api/admin/hostels
- [ ] PUT /api/admin/hostels/:id
- [ ] DELETE /api/admin/hostels/:id
- [ ] PATCH /api/admin/hostels/:id/status
- [ ] GET /api/admin/hostels/:id/rooms
- [ ] GET /api/admin/hostels/:id/wardens
