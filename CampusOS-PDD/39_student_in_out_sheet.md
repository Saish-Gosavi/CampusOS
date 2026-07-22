# Student - In Out sheet

| Field | Value |
|--------|--------|
| Role | Student |
| Phase | TBD |
| Depends on | Security_In_Out_sheet |

## Cross-cutting

The Student In/Out Sheet tracks the real-time physical presence of students inside or outside the hostel. It integrates heavily with the Security Scanner, Leave Management system, and Notifications.

## Sub-modules & Goals

1. **Dashboard Widget**: Display current status (Inside/Outside) and the last 5 entry/exit logs.
2. **QR/Barcode Integration**: Provide a unique, rotating QR Code on the student app to be scanned by Security at the gate.
3. **Leave Auto-Activation**: If a student has an approved 'Leave' starting today, scanning OUT automatically activates their Leave status.
4. **Curfew Tracking**: If a student is OUT past the hostel curfew (e.g., 10 PM), an automatic alert is triggered to the Warden.
5. **Log History View**: A paginated historical view of all in/out timestamps for the student.

## Data (Existing vs New)

### Existing
- Relevant module tables

### New
- N/A (Extends existing schema or creates specific pivot tables)

## API Checklist

- [ ] GET /api/student/in-out-sheet
- [ ] POST /api/student/in-out-sheet
