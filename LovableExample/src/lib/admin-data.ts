// Dummy data for the Super Admin dashboard (frontend only).
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Home,
  BookOpen,
  Package,
  UserCog,
  Megaphone,
} from "lucide-react";

export type Stat = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  tint: string;
};

export const stats: Stat[] = [
  { label: "Total Colleges", value: "24", delta: "+3 this month", trend: "up", icon: Building2, tint: "#2563EB" },
  { label: "Total Hostels", value: "58", delta: "+5 this month", trend: "up", icon: Home, tint: "#7B4CED" },
  { label: "Total Libraries", value: "31", delta: "+2 this month", trend: "up", icon: BookOpen, tint: "#3B82F6" },
  { label: "Inventory Stores", value: "42", delta: "+4 this month", trend: "up", icon: Package, tint: "#22C55E" },
  { label: "Hostel Admins", value: "76", delta: "+6 this month", trend: "up", icon: UserCog, tint: "#7B4CED" },
  { label: "Library Admins", value: "48", delta: "+3 this month", trend: "up", icon: UserCog, tint: "#3B82F6" },
  { label: "Inventory Admins", value: "55", delta: "+4 this month", trend: "up", icon: UserCog, tint: "#22C55E" },
  { label: "Total Students", value: "18,472", delta: "+312 this month", trend: "up", icon: UserCog, tint: "#EAB308" },
  { label: "Active Users", value: "12,981", delta: "-1.2% vs last week", trend: "down", icon: UserCog, tint: "#EF4444" },
];

export type Activity = {
  id: string;
  title: string;
  meta: string;
  time: string;
  icon: LucideIcon;
  tint: string;
};

export const activities: Activity[] = [
  { id: "a1", title: "College Created", meta: "VPPCOE — Mumbai Campus", time: "2 min ago", icon: Building2, tint: "#2563EB" },
  { id: "a2", title: "Hostel Created", meta: "Boys Hostel — Block C", time: "24 min ago", icon: Home, tint: "#7B4CED" },
  { id: "a3", title: "Admin Assigned", meta: "R. Sharma → Library Admin", time: "1 hr ago", icon: UserCog, tint: "#3B82F6" },
  { id: "a4", title: "Library Created", meta: "Central Library — VPPCOE", time: "3 hr ago", icon: BookOpen, tint: "#3B82F6" },
  { id: "a5", title: "Inventory Store Created", meta: "Science Store — Room 204", time: "5 hr ago", icon: Package, tint: "#22C55E" },
  { id: "a6", title: "Notice Published", meta: "Semester schedule update", time: "Yesterday", icon: Megaphone, tint: "#EAB308" },
];

export const recentColleges = [
  { name: "VPPCOE", city: "Mumbai", students: 3200, status: "Active" },
  { name: "Nova Institute", city: "Pune", students: 2100, status: "Active" },
  { name: "Meridian College", city: "Delhi", students: 1850, status: "Pending" },
  { name: "Aurora Tech", city: "Bengaluru", students: 2740, status: "Active" },
];

export const recentHostels = [
  { name: "Block A — Boys", college: "VPPCOE", capacity: 240, status: "Active" },
  { name: "Block B — Girls", college: "VPPCOE", capacity: 200, status: "Active" },
  { name: "Nova Residency", college: "Nova Institute", capacity: 320, status: "Active" },
  { name: "Meridian Heights", college: "Meridian College", capacity: 180, status: "Pending" },
];

export const recentLibraries = [
  { name: "Central Library", college: "VPPCOE", books: "48,200", status: "Active" },
  { name: "Nova Reading Hub", college: "Nova Institute", books: "22,140", status: "Active" },
  { name: "Meridian Archives", college: "Meridian College", books: "31,050", status: "Active" },
];

export const recentStores = [
  { name: "Science Store", college: "VPPCOE", items: 1240, status: "Active" },
  { name: "Sports Inventory", college: "Nova Institute", items: 480, status: "Active" },
  { name: "Central Store", college: "Aurora Tech", items: 2010, status: "Pending" },
];

// Charts
export const collegeDistribution = [
  { name: "Mumbai", value: 8 },
  { name: "Pune", value: 6 },
  { name: "Delhi", value: 4 },
  { name: "Bengaluru", value: 3 },
  { name: "Hyderabad", value: 3 },
];

export const hostelCapacity = [
  { name: "Block A", occupied: 220, capacity: 240 },
  { name: "Block B", occupied: 180, capacity: 200 },
  { name: "Nova Res.", occupied: 290, capacity: 320 },
  { name: "Meridian", occupied: 150, capacity: 180 },
  { name: "Aurora", occupied: 260, capacity: 280 },
];

export const studentDistribution = [
  { name: "First Year", value: 5200 },
  { name: "Second Year", value: 4800 },
  { name: "Third Year", value: 4400 },
  { name: "Final Year", value: 4072 },
];

export const moduleUsage = [
  { month: "Jan", Hostel: 3200, Library: 4100, Inventory: 1800 },
  { month: "Feb", Hostel: 3400, Library: 4500, Inventory: 2000 },
  { month: "Mar", Hostel: 3700, Library: 4700, Inventory: 2200 },
  { month: "Apr", Hostel: 3600, Library: 5000, Inventory: 2400 },
  { month: "May", Hostel: 3900, Library: 5300, Inventory: 2600 },
  { month: "Jun", Hostel: 4200, Library: 5600, Inventory: 2900 },
];

export const adminDistribution = [
  { name: "Hostel", value: 76 },
  { name: "Library", value: 48 },
  { name: "Inventory", value: 55 },
];
