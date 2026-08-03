# Admin - Hostel Management

| Field | Value |
|--------|--------|
| Role | Admin |
| Phase | TBD |
| Depends on | Authentication_Role_Based_Access |

## Cross-cutting

Add, edit, delete, and manage hostels, blocks, floors, rooms, beds, and furniture within the institute. This module enables the Admin to create and maintain complete hostel hierarchy and infrastructure, including hostel details, capacities, blocks, floors, room configurations, bed allocations, and room furniture tracking. It enforces strict RBAC for the Admin role and maintains audit logs for all administrative actions.

## Sub-modules & Goals

1. **Hostel Registration**: Add new hostels for the institute with complete hostel information.
2. **Hostel Management**: View, edit, activate/deactivate, and delete hostel records.
3. **Block & Floor Management**: Configure blocks and floor layouts within each hostel.
4. **Room Management**: Add, update, view, and delete rooms with specific room types and capacities.
5. **Bed Management**: Configure individual beds, bed numbers, and bed availability status.
6. **Furniture Management**: Assign, track, and manage room assets and furniture inventory.
7. **Hostel Assignment**: Assign wardens and manage hostel administrators.
8. **Validation**: Ensure hostel names, capacities, floor layouts, and room configurations are valid.
9. **Logging**: Record all hostel, block, floor, room, bed, and furniture activities for auditing.

## Data (Existing vs New)

### Existing
- Users
- Admin
- Warden
- Student

### New
- Hostel
- Block / Hostel_Block
- Floor / Hostel_Floor
- Room
- Bed
- Furniture / Asset

## API Checklist

### Hostel Endpoints
- [ ] GET /api/admin/hostels
- [ ] GET /api/admin/hostels/:id
- [ ] POST /api/admin/hostels
- [ ] PUT /api/admin/hostels/:id
- [ ] DELETE /api/admin/hostels/:id
- [ ] PATCH /api/admin/hostels/:id/status
- [ ] GET /api/admin/hostels/:id/wardens

### Block & Floor Management Endpoints
- [ ] GET /api/admin/hostels/:id/blocks
- [ ] POST /api/admin/hostels/:id/blocks
- [ ] GET /api/admin/blocks/:id/floors
- [ ] POST /api/admin/blocks/:id/floors

### Room & Bed Management Endpoints
- [ ] GET /api/admin/hostels/:id/rooms
- [ ] POST /api/admin/hostels/:id/rooms
- [ ] PUT /api/admin/rooms/:id
- [ ] DELETE /api/admin/rooms/:id
- [ ] GET /api/admin/rooms/:id/beds
- [ ] POST /api/admin/rooms/:id/beds

### Furniture Management Endpoints
- [ ] GET /api/admin/furniture
- [ ] POST /api/admin/furniture
- [ ] PUT /api/admin/furniture/:id
- [ ] DELETE /api/admin/furniture/:id
