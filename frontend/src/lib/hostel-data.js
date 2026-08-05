import {
  UserPlus,
  BedDouble,
  MessageSquareWarning,
  IndianRupee,
  Megaphone,
  UserCog
} from "lucide-react";
const hostelActivities = [];
const students = [];
const rooms = [];
const staff = [
  { id: 1, name: "Ramesh Kumar", role: "Electrician", block: "Block A & B" },
  { id: 2, name: "Ganesh Pujari", role: "Plumber", block: "All Blocks" },
  { id: 3, name: "Suresh Patil", role: "IT Tech", block: "Block C & D" },
  { id: 4, name: "Mahesh Shinde", role: "Mess Supervisor", block: "Central Mess" },
  { id: 5, name: "Prakash Jadhav", role: "Carpenter", block: "All Blocks" },
  { id: 6, name: "Sunil Kadam", role: "Housekeeping Lead", block: "All Blocks" }
];
const fees = [];
const feeStructure = [];
const complaints = [
  {
    id: 101,
    code: "CMP-0101",
    title: "Water Leakage in Bathroom Sink",
    description: "The sink pipe in Room 304 is leaking heavily, causing water pooling on the floor.",
    category: "Plumbing",
    priority: "High",
    status: "Open",
    raisedBy: "Rohan Sharma",
    enrollment: "EN20248912",
    room: "Room 304 (Block A)",
    hostel: "Boys Hostel 1",
    contact: "+91 98765 43210",
    createdAt: "2026-08-04 09:30",
    assigned: null,
    resolution: null,
    updates: [
      { at: "2026-08-04 09:30", by: "Rohan Sharma", note: "Complaint registered." }
    ]
  },
  {
    id: 102,
    code: "CMP-0102",
    title: "Ceiling Fan Making Loud Noise & Wobbling",
    description: "The fan in room 212 is making rattling noises and wobbles dangerously when set to full speed.",
    category: "Electrical",
    priority: "High",
    status: "In Progress",
    raisedBy: "Aarav Patel",
    enrollment: "EN20247651",
    room: "Room 212 (Block B)",
    hostel: "Boys Hostel 1",
    contact: "+91 98123 45678",
    createdAt: "2026-08-03 14:15",
    assigned: "Ramesh Kumar",
    resolution: null,
    updates: [
      { at: "2026-08-03 14:15", by: "Aarav Patel", note: "Complaint registered." },
      { at: "2026-08-03 16:00", by: "Hostel Admin", note: "Assigned to Ramesh Kumar (Electrician)." }
    ]
  },
  {
    id: 103,
    code: "CMP-0103",
    title: "Wi-Fi Router Signal Dropping Frequently",
    description: "3rd floor Wi-Fi access point in Block C drops internet connection every 10-15 minutes.",
    category: "Internet",
    priority: "Medium",
    status: "In Progress",
    raisedBy: "Priya Verma",
    enrollment: "EN20249210",
    room: "Room 308 (Block C)",
    hostel: "Girls Hostel 1",
    contact: "+91 97654 32109",
    createdAt: "2026-08-03 11:20",
    assigned: "Suresh Patil",
    resolution: null,
    updates: [
      { at: "2026-08-03 11:20", by: "Priya Verma", note: "Complaint registered." },
      { at: "2026-08-03 13:00", by: "Hostel Admin", note: "Assigned to Suresh Patil (IT Tech)." }
    ]
  },
  {
    id: 104,
    code: "CMP-0104",
    title: "Broken Study Table Leg",
    description: "Right front leg of study table bed #2 in Room 105 is cracked and unstable.",
    category: "Furniture",
    priority: "Low",
    status: "Open",
    raisedBy: "Vikram Malhotra",
    enrollment: "EN20246543",
    room: "Room 105 (Block A)",
    hostel: "Boys Hostel 1",
    contact: "+91 99887 76655",
    createdAt: "2026-08-05 08:45",
    assigned: null,
    resolution: null,
    updates: [
      { at: "2026-08-05 08:45", by: "Vikram Malhotra", note: "Complaint registered." }
    ]
  },
  {
    id: 105,
    code: "CMP-0105",
    title: "Mess Food Quality Complaint",
    description: "Dinner served on August 2nd was undercooked. Requesting quality check.",
    category: "Mess",
    priority: "High",
    status: "Resolved",
    raisedBy: "Ananya Deshmukh",
    enrollment: "EN20243210",
    room: "Room 402 (Block C)",
    hostel: "Girls Hostel 1",
    contact: "+91 98989 89898",
    createdAt: "2026-08-02 20:30",
    assigned: "Mahesh Shinde",
    resolution: "Inspection conducted by Mess Committee. Contractor issued warning and kitchen standards upgraded.",
    resolvedAt: "2026-08-03 18:00",
    updates: [
      { at: "2026-08-02 20:30", by: "Ananya Deshmukh", note: "Complaint registered." },
      { at: "2026-08-03 10:00", by: "Hostel Admin", note: "Forwarded to Mess Committee." },
      { at: "2026-08-03 18:00", by: "Hostel Admin", note: "Resolved — Warning issued to contractor." }
    ]
  },
  {
    id: 106,
    code: "CMP-0106",
    title: "Corridor Light Bulb Replacement",
    description: "Light bulb outside Room 201 near staircase fused out.",
    category: "Electrical",
    priority: "Low",
    status: "Closed",
    raisedBy: "Karan Singh",
    enrollment: "EN20241122",
    room: "Room 201 (Block B)",
    hostel: "Boys Hostel 1",
    contact: "+91 91234 56789",
    createdAt: "2026-08-01 16:00",
    assigned: "Ramesh Kumar",
    resolution: "Replaced fused bulb with 15W LED bulb.",
    resolvedAt: "2026-08-02 11:00",
    updates: [
      { at: "2026-08-01 16:00", by: "Karan Singh", note: "Complaint registered." },
      { at: "2026-08-02 11:00", by: "Ramesh Kumar", note: "Replaced fused bulb." }
    ]
  }
];
const notices = [];
const occupancyByBlock = [];
const feeCollection = [];
const complaintTrends = [];
const studentsByYear = [];
const complaintOverview = [];
const leaveRequestOverview = [];
const leaveRequests = [];
const hostels = [];
const blocks = [];
const floors = [];
const beds = [];
const allocations = [];
const visitorRequests = [];
const inOutEntries = [];
const furnitureItems = [];
export {
  allocations,
  beds,
  blocks,
  complaintOverview,
  complaintTrends,
  complaints,
  feeCollection,
  feeStructure,
  fees,
  floors,
  furnitureItems,
  hostelActivities,
  hostels,
  inOutEntries,
  leaveRequestOverview,
  leaveRequests,
  notices,
  occupancyByBlock,
  rooms,
  staff,
  students,
  studentsByYear,
  visitorRequests
};
