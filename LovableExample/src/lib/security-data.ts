// Dummy data for the Security portal (frontend only).
import type { LucideIcon } from "lucide-react";
import {
  LogIn,
  LogOut,
  UserCheck,
  ShieldAlert,
  Ticket,
  QrCode,
} from "lucide-react";

export type GatePassStatus = "Active" | "Expired" | "Verified" | "Rejected" | "Pending";
export type GatePass = {
  id: string;
  student: string;
  enrollment: string;
  room: string;
  purpose: string;
  issuedBy: string;
  validFrom: string;
  validUntil: string;
  status: GatePassStatus;
};

export const gatePasses: GatePass[] = [
  { id: "GP-2401", student: "Aarav Mehta", enrollment: "VP2023CS012", room: "A-204", purpose: "Home visit — Andheri", issuedBy: "Warden R. Kulkarni", validFrom: "2026-07-22 08:00", validUntil: "2026-07-24 20:00", status: "Active" },
  { id: "GP-2402", student: "Riya Shah", enrollment: "VP2022EX045", room: "B-118", purpose: "Medical — Sion Hospital", issuedBy: "Warden M. Pawar", validFrom: "2026-07-22 07:30", validUntil: "2026-07-22 14:00", status: "Verified" },
  { id: "GP-2403", student: "Kabir Verma", enrollment: "VP2021ME101", room: "C-302", purpose: "Family function", issuedBy: "Warden R. Kulkarni", validFrom: "2026-07-20 09:00", validUntil: "2026-07-21 21:00", status: "Expired" },
  { id: "GP-2404", student: "Isha Patel", enrollment: "VP2023IT077", room: "A-210", purpose: "Personal errand", issuedBy: "Warden M. Pawar", validFrom: "2026-07-22 10:00", validUntil: "2026-07-22 18:00", status: "Pending" },
  { id: "GP-2405", student: "Neel Deshmukh", enrollment: "VP2020CV019", room: "D-105", purpose: "Sports tournament", issuedBy: "Warden R. Kulkarni", validFrom: "2026-07-22 06:00", validUntil: "2026-07-22 21:00", status: "Active" },
  { id: "GP-2406", student: "Vivaan Rao", enrollment: "VP2021EC088", room: "C-215", purpose: "Late night out", issuedBy: "Warden R. Kulkarni", validFrom: "2026-07-21 18:00", validUntil: "2026-07-21 23:00", status: "Rejected" },
];

export type IncidentType = "Medical" | "Fire" | "Theft" | "Unauthorized Entry" | "Fight" | "Damage" | "Other";
export type IncidentStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type Incident = {
  id: string;
  type: IncidentType;
  student?: string;
  location: string;
  dateTime: string;
  description: string;
  status: IncidentStatus;
  reportedBy: string;
  severity: "High" | "Medium" | "Low";
};

export const incidents: Incident[] = [
  { id: "INC-501", type: "Unauthorized Entry", location: "Main Gate", dateTime: "2026-07-22 02:14", description: "Unidentified person tried to enter without ID.", status: "Resolved", reportedBy: "S. Rane", severity: "High" },
  { id: "INC-502", type: "Medical", student: "Isha Patel", location: "Girls Hostel · A-210", dateTime: "2026-07-21 22:40", description: "Student reported severe fever, escorted to Sion Hospital.", status: "Closed", reportedBy: "P. Naik", severity: "High" },
  { id: "INC-503", type: "Theft", location: "Boys Hostel Common Room", dateTime: "2026-07-20 19:05", description: "Missing wall clock reported.", status: "In Progress", reportedBy: "A. Kadam", severity: "Medium" },
  { id: "INC-504", type: "Fight", student: "Vivaan Rao", location: "Boys Hostel · C-215", dateTime: "2026-07-19 23:30", description: "Verbal altercation between roommates, warden informed.", status: "Resolved", reportedBy: "S. Rane", severity: "Medium" },
  { id: "INC-505", type: "Damage", location: "Girls Hostel · Corridor B2", dateTime: "2026-07-18 15:00", description: "Broken window glass, maintenance raised.", status: "Open", reportedBy: "P. Naik", severity: "Low" },
  { id: "INC-506", type: "Fire", location: "Mess Kitchen", dateTime: "2026-07-15 12:20", description: "Minor LPG leak; extinguished before ignition.", status: "Closed", reportedBy: "N. Salunke", severity: "High" },
];

export type DailyLog = {
  id: string;
  date: string;
  shift: "Morning" | "Afternoon" | "Night";
  staff: string;
  remarks: string;
  entries: number;
  exits: number;
  incidents: number;
};

export const dailyLogs: DailyLog[] = [
  { id: "LOG-901", date: "2026-07-22", shift: "Morning", staff: "S. Rane", remarks: "Peaceful morning shift. All routine entries/exits logged.", entries: 82, exits: 74, incidents: 0 },
  { id: "LOG-902", date: "2026-07-22", shift: "Afternoon", staff: "P. Naik", remarks: "One student late return, informed hostel warden.", entries: 68, exits: 91, incidents: 1 },
  { id: "LOG-903", date: "2026-07-21", shift: "Night", staff: "N. Salunke", remarks: "Unauthorized entry attempt at 02:14 — resolved.", entries: 12, exits: 4, incidents: 1 },
  { id: "LOG-904", date: "2026-07-21", shift: "Afternoon", staff: "A. Kadam", remarks: "Visitor rush during weekend. Smooth handling.", entries: 74, exits: 88, incidents: 0 },
  { id: "LOG-905", date: "2026-07-20", shift: "Morning", staff: "S. Rane", remarks: "Routine day.", entries: 79, exits: 71, incidents: 0 },
];

export type SecurityActivity = {
  id: string;
  title: string;
  meta: string;
  time: string;
  icon: LucideIcon;
  tint: string;
};

export const securityActivities: SecurityActivity[] = [
  { id: "sa1", title: "Student Entry", meta: "Riya Shah · B-118 · Hostel Gate", time: "2 min ago", icon: LogIn, tint: "#22C55E" },
  { id: "sa2", title: "Student Exit", meta: "Aarav Mehta · A-204 · QR Scan", time: "12 min ago", icon: LogOut, tint: "#F97316" },
  { id: "sa3", title: "Visitor Checked-In", meta: "Reshma Patel → Isha Patel", time: "30 min ago", icon: UserCheck, tint: "#06B6D4" },
  { id: "sa4", title: "Gate Pass Verified", meta: "GP-2402 · Riya Shah", time: "45 min ago", icon: Ticket, tint: "#7B4CED" },
  { id: "sa5", title: "Incident Logged", meta: "Unauthorized entry · Main Gate", time: "2 hr ago", icon: ShieldAlert, tint: "#EF4444" },
  { id: "sa6", title: "QR Scan", meta: "Kabir Verma · C-302 · Main Gate", time: "3 hr ago", icon: QrCode, tint: "#2563EB" },
];

export const hourlyMovement = [
  { hour: "6 AM", entries: 4, exits: 18 },
  { hour: "8 AM", entries: 12, exits: 42 },
  { hour: "10 AM", entries: 22, exits: 16 },
  { hour: "12 PM", entries: 30, exits: 20 },
  { hour: "2 PM", entries: 26, exits: 24 },
  { hour: "4 PM", entries: 38, exits: 30 },
  { hour: "6 PM", entries: 52, exits: 22 },
  { hour: "8 PM", entries: 44, exits: 10 },
  { hour: "10 PM", entries: 18, exits: 4 },
];
