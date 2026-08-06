# CampusOS-PDD

CampusOS is a comprehensive Hostel Management System built with React.js, Node.js, Express.js, and MySQL. This repository contains the Prompt-Driven Development (PDD) documentation, designed to guide AI coding assistants (such as Claude Code, Cursor, GitHub Copilot, Windsurf, Lovable) in implementing the system feature by feature.

## Development Order

The modules should be implemented in the following order to ensure all data dependencies are met:

1. **[Authentication](01_Authentication.md)**: Handles , logout, forgot password, reset password, JWT authentication, role-based access control, session management and audit logging.
2. **[Database Design](02_Database_Design.md)**: Maintains every database table required for the project including students, hostels, rooms, room allocation, attendance, fees, complaints, visitors, notices, notifications and reports.
3. **[Hostel Management](03_Hostel_Management.md)**: Manage hostel information including hostel creation, blocks, floors, capacity, availability and hostel configuration.
4. **[Admin Management](04_Admin_Management.md)**: Manage hostel administrators, assign hostels, activate/deactivate admins and monitor administrator activities.
5. **[Student Management](05_Student_Management.md)**: Manage student profiles, admissions, guardian information, emergency contacts and hostel registration.
6. **[Room Management](06_Room_Management.md)**: Manage hostel rooms, capacities, room types, occupancy and maintenance status.
7. **[Room Allocation](07_Room_Allocation.md)**: Allocate rooms, change rooms, vacate rooms and maintain allocation history.
8. **[Attendance Management](08_Attendance_Management.md)**: Maintain student attendance, check-in/check-out history and attendance reports.
9. **[Fee Management](09_Fee_Management.md)**: Manage hostel fee structures, invoices, payments, dues, penalties and receipts.
10. **[Leave Management](10_Leave_Management.md)**: Students apply for leave while wardens approve or reject requests and maintain leave history.
11. **[Complaint Management](11_Complaint_Management.md)**: Students raise complaints and hostel staff manage, assign and resolve them.
12. **[Visitor Management](12_Visitor_Management.md)**: Visitor requests, approvals, visitor logs, QR verification and visitor history.
13. **[Notice Management](13_Notice_Management.md)**: Create notices, target audiences and maintain notice history.
14. **[Mess Management](14_Mess_Management.md)**: Meal plans, mess attendance, menu management and feedback.
15. **[Furniture Management](15_Furniture_Management.md)**: Manage hostel assets, furniture allocation, maintenance and inventory.
16. **[Profile Management](16_Profile_Management.md)**: Manage user profiles, password changes, profile photos and personal settings.
17. **[Security Management](17_Security_Management.md)**: QR scanning, entry/exit logs, visitor verification and security dashboard.
18. **[Reports & Analytics](18_Reports_Analytics.md)**: Generate hostel occupancy, fee, complaint, attendance and visitor reports with export support.
19. **[Notifications](19_Notifications.md)**: Email, SMS, in-app and push notifications for system events.
20. **[Search & Filter](20_Search_Filter.md)**: Global search, advanced filtering, sorting and export across every module.
21. **[System Settings](21_System_Settings.md)**: General application settings, hostel configuration, permissions and master settings.
22. **[Common Services](22_Common_Services.md)**: Reusable utilities including pagination, audit logs, file upload, exports, logging, caching and shared helpers.
