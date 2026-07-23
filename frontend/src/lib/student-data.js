import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Gift,
  MessageSquareWarning,
  UserRoundCheck,
  BookUp
} from "lucide-react";
const studentProfile = {
  name: "Aarav Mehta",
  enrollment: "VP2023CS012",
  department: "Computer Engineering",
  year: "Third Year",
  email: "aarav.mehta@vppcoe.edu",
  mobile: "+91 98214 55210",
  bloodGroup: "B+",
  dob: "2004-03-12",
  address: "22, Shivaji Nagar, Pune, Maharashtra 411005",
  emergencyContact: "+91 98765 22314",
  photo: "AM",
  father: { name: "Rajesh Mehta", occupation: "Chartered Accountant", mobile: "+91 98901 22114" },
  mother: { name: "Neha Mehta", occupation: "Homemaker", mobile: "+91 98765 22314" },
  hostel: {
    name: "Vivekanand Hostel",
    block: "B",
    floor: "3rd Floor",
    room: "B-314",
    bed: "Bed 2",
    warden: { name: "Prof. S. Deshpande", mobile: "+91 98120 41288" },
    roommates: [
      { name: "Kabir Verma", enrollment: "VP2021ME101", bed: "Bed 1" },
      { name: "Vivaan Rao", enrollment: "VP2022ME088", bed: "Bed 3" }
    ]
  }
};
const myLeaves = [
  { id: "l1", type: "Home Visit", from: "2026-07-24", to: "2026-07-27", reason: "Cousin's wedding at hometown.", status: "Pending" },
  { id: "l2", type: "Medical", from: "2026-07-05", to: "2026-07-07", reason: "Dental surgery \u2014 follow up appointment.", status: "Approved", remarks: "Take rest. Submit medical certificate." },
  { id: "l3", type: "Personal", from: "2026-06-18", to: "2026-06-19", reason: "Bank documentation.", status: "Approved" },
  { id: "l4", type: "Event", from: "2026-05-22", to: "2026-05-24", reason: "Hackathon at IIT Bombay.", status: "Rejected", remarks: "Overlap with mid-semester exams." }
];
const myComplaints = [
  { id: "c1", category: "Wi-Fi", priority: "High", description: "Intermittent connectivity on 3rd floor since 2 days.", raisedOn: "2026-07-19", status: "In Progress" },
  { id: "c2", category: "Plumbing", priority: "Medium", description: "Leaky tap in washroom near B-314.", raisedOn: "2026-07-15", status: "Resolved" },
  { id: "c3", category: "Furniture", priority: "Low", description: "Study chair wobbles.", raisedOn: "2026-07-10", status: "Open" }
];
const myVisitors = [
  { id: "v1", name: "Rajesh Mehta", relation: "Father", mobile: "+91 98901 22114", date: "2026-07-25", purpose: "Weekend visit", status: "Pending" },
  { id: "v2", name: "Neha Mehta", relation: "Mother", mobile: "+91 98765 22314", date: "2026-07-11", purpose: "Bring home food & medicines", status: "Checked-Out" },
  { id: "v3", name: "Karan Mehta", relation: "Cousin", mobile: "+91 98211 51201", date: "2026-06-22", purpose: "Social visit", status: "Approved" }
];
const myFees = [
  { id: "f1", term: "Semester 6 \u2014 Autumn 2026", amount: 42e3, dueDate: "2026-08-15", status: "Pending" },
  { id: "f2", term: "Semester 5 \u2014 Spring 2026", amount: 42e3, dueDate: "2026-01-15", paidOn: "2026-01-08", status: "Paid", receipt: "RCT-24019" },
  { id: "f3", term: "Semester 4 \u2014 Autumn 2025", amount: 4e4, dueDate: "2025-08-15", paidOn: "2025-08-04", status: "Paid", receipt: "RCT-19821" },
  { id: "f4", term: "Mess Charges \u2014 Jul 2026", amount: 4500, dueDate: "2026-07-10", status: "Overdue" }
];
const myFurniture = [
  { id: "rf1", name: "Single Bed", quantity: 3, condition: "Good", status: "In Use" },
  { id: "rf2", name: "Study Table", quantity: 3, condition: "Good", status: "In Use" },
  { id: "rf3", name: "Study Chair", quantity: 3, condition: "Fair", status: "In Use" },
  { id: "rf4", name: "Wardrobe", quantity: 3, condition: "Good", status: "In Use" },
  { id: "rf5", name: "Ceiling Fan", quantity: 2, condition: "Good", status: "In Use" },
  { id: "rf6", name: "Tube Light", quantity: 3, condition: "Damaged", status: "Under Maintenance" }
];
const hostelNoticesFeed = [
  { id: "hn1", title: "Water supply maintenance \u2014 Sunday", body: "Water supply will be interrupted on Sunday between 10:00 AM and 2:00 PM for tank cleaning at Vivekanand Hostel.", category: "Maintenance", audience: "All Residents", publishedOn: "2026-07-20", pinned: true },
  { id: "hn2", title: "Mess menu updated for August", body: "The new mess menu goes live from 1st August. Please share feedback via the mess committee QR.", category: "Mess", audience: "All Residents", publishedOn: "2026-07-18" },
  { id: "hn3", title: "Late night study hall extended", body: "Study hall on ground floor will remain open till 2:00 AM during pre-exam weeks.", category: "Academics", audience: "All Residents", publishedOn: "2026-07-15" },
  { id: "hn4", title: "Fire safety drill \u2014 Wednesday 6 PM", body: "Mandatory fire safety drill for all residents. Attendance will be marked at the assembly point.", category: "Safety", audience: "All Residents", publishedOn: "2026-07-10", pinned: true }
];
const libraryNoticesFeed = [
  { id: "ln1", title: "Extended library hours during exams", body: "Central library will remain open till midnight from 25th July to 10th August.", category: "Timings", audience: "All Students", publishedOn: "2026-07-19", pinned: true },
  { id: "ln2", title: "New arrivals \u2014 System Design", body: "20 new titles added to the Computer Science section including System Design Interview Vol. 2.", category: "New Arrivals", audience: "All Students", publishedOn: "2026-07-16" },
  { id: "ln3", title: "Fine amnesty week", body: "50% waiver on overdue fines from 22nd to 28th July. Visit the counter to settle dues.", category: "Fines", audience: "All Students", publishedOn: "2026-07-12" }
];
const libraryCatalog = [
  { id: "lb1", title: "Atomic Habits", author: "James Clear", category: "Self Help", cover: "AH", copiesAvailable: 3, totalCopies: 8 },
  { id: "lb2", title: "Clean Code", author: "Robert C. Martin", category: "Computer Science", cover: "CC", copiesAvailable: 0, totalCopies: 6 },
  { id: "lb3", title: "Deep Work", author: "Cal Newport", category: "Productivity", cover: "DW", copiesAvailable: 1, totalCopies: 5 },
  { id: "lb4", title: "Designing Data-Intensive Apps", author: "Martin Kleppmann", category: "Computer Science", cover: "DD", copiesAvailable: 2, totalCopies: 4 },
  { id: "lb5", title: "The Pragmatic Programmer", author: "Dave Thomas", category: "Computer Science", cover: "PP", copiesAvailable: 4, totalCopies: 5 },
  { id: "lb6", title: "Sapiens", author: "Yuval Noah Harari", category: "History", cover: "SP", copiesAvailable: 0, totalCopies: 6 },
  { id: "lb7", title: "Introduction to Algorithms", author: "Cormen et al.", category: "Computer Science", cover: "IA", copiesAvailable: 3, totalCopies: 7 },
  { id: "lb8", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", cover: "TF", copiesAvailable: 2, totalCopies: 4 },
  { id: "lb9", title: "Refactoring", author: "Martin Fowler", category: "Computer Science", cover: "RF", copiesAvailable: 5, totalCopies: 5 }
];
const myBorrowed = [
  { id: "bb1", title: "Atomic Habits", author: "James Clear", issueDate: "2026-07-14", dueDate: "2026-07-28", status: "Issued", cover: "AH" },
  { id: "bb2", title: "Deep Work", author: "Cal Newport", issueDate: "2026-07-05", dueDate: "2026-07-19", status: "Overdue", cover: "DW" },
  { id: "bb3", title: "Refactoring", author: "Martin Fowler", issueDate: "2026-07-16", dueDate: "2026-07-30", status: "Issued", cover: "RF" }
];
const myBorrowHistory = [
  { id: "bh1", title: "Clean Code", author: "Robert C. Martin", issueDate: "2026-05-02", returnDate: "2026-05-16", fine: 0 },
  { id: "bh2", title: "Sapiens", author: "Yuval Noah Harari", issueDate: "2026-04-11", returnDate: "2026-04-30", fine: 40 },
  { id: "bh3", title: "The Pragmatic Programmer", author: "Dave Thomas", issueDate: "2026-03-04", returnDate: "2026-03-18", fine: 0 },
  { id: "bh4", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", issueDate: "2026-02-08", returnDate: "2026-02-22", fine: 0 },
  { id: "bh5", title: "Introduction to Algorithms", author: "Cormen et al.", issueDate: "2026-01-15", returnDate: "2026-02-05", fine: 60 }
];
const myReservations = [
  { id: "rs1", title: "Clean Code", reservedOn: "2026-07-17", position: 2, status: "Pending" },
  { id: "rs2", title: "Sapiens", reservedOn: "2026-07-12", position: 1, status: "Ready" }
];
const myLibraryFines = [
  { id: "lf1", book: "Deep Work", daysOverdue: 4, amount: 40, status: "Pending", date: "2026-07-19" },
  { id: "lf2", book: "Sapiens", daysOverdue: 4, amount: 40, status: "Paid", date: "2026-04-30" },
  { id: "lf3", book: "Introduction to Algorithms", daysOverdue: 6, amount: 60, status: "Paid", date: "2026-02-05" }
];
const studentActivities = [
  { id: "a1", title: "Book issued", meta: "Refactoring \xB7 Central Library", time: "2 hr ago", icon: BookUp, tint: "#0D9488" },
  { id: "a2", title: "Leave approved", meta: "Medical \u2014 5 to 7 Jul", time: "3 days ago", icon: CheckCircle2, tint: "#22C55E" },
  { id: "a3", title: "Complaint updated", meta: "Wi-Fi issue moved to In Progress", time: "4 days ago", icon: MessageSquareWarning, tint: "#EF4444" },
  { id: "a4", title: "Visitor checked out", meta: "Neha Mehta \xB7 Mother", time: "1 week ago", icon: UserRoundCheck, tint: "#06B6D4" },
  { id: "a5", title: "Fee paid", meta: "Semester 5 \xB7 \u20B942,000", time: "6 months ago", icon: Gift, tint: "#EAB308" },
  { id: "a6", title: "Book due soon", meta: "Atomic Habits \xB7 6 days left", time: "Today", icon: BookOpen, tint: "#2563EB" },
  { id: "a7", title: "Leave request submitted", meta: "Home Visit \u2014 24 to 27 Jul", time: "Yesterday", icon: CalendarDays, tint: "#F97316" }
];
const notificationsFeed = [
  { id: "n1", source: "Hostel", title: "Leave application pending review", body: "Your Home Visit leave (24\u201327 Jul) awaits warden approval.", time: "2 hr ago", unread: true },
  { id: "n2", source: "Library", title: "Book due in 2 days", body: "Atomic Habits is due on 28 Jul. Renew online to avoid fines.", time: "3 hr ago", unread: true },
  { id: "n3", source: "College", title: "Mid-semester timetable published", body: "Semester 6 mid-sem schedule uploaded to the academics portal.", time: "1 day ago" },
  { id: "n4", source: "Hostel", title: "Fire safety drill on Wednesday", body: "Mandatory attendance at the assembly point at 6:00 PM.", time: "2 days ago" },
  { id: "n5", source: "Library", title: "Fine waived", body: "\u20B940 fine on Sapiens has been waived under amnesty week.", time: "3 days ago" },
  { id: "n6", source: "College", title: "Placement talk \u2014 Google", body: "Pre-placement talk on 26 Jul at auditorium, 4 PM.", time: "4 days ago" }
];
const myDocuments = [
  { id: "d1", name: "Hostel Fee Receipt \u2014 Sem 5", type: "Hostel Receipt", issuedOn: "2026-01-08", size: "184 KB" },
  { id: "d2", name: "Hostel Fee Receipt \u2014 Sem 4", type: "Hostel Receipt", issuedOn: "2025-08-04", size: "178 KB" },
  { id: "d3", name: "Library Fine Receipt \u2014 Apr", type: "Library Receipt", issuedOn: "2026-04-30", size: "92 KB" },
  { id: "d4", name: "Leave Approval \u2014 Medical", type: "Leave Approval", issuedOn: "2026-07-04", size: "112 KB" },
  { id: "d5", name: "Gate Pass \u2014 GP-2298", type: "Gate Pass", issuedOn: "2026-06-22", size: "76 KB" }
];
const attendanceTrend = [
  { month: "Feb", present: 92 },
  { month: "Mar", present: 88 },
  { month: "Apr", present: 94 },
  { month: "May", present: 91 },
  { month: "Jun", present: 96 },
  { month: "Jul", present: 90 }
];
const upcomingDueDates = [
  { id: "u1", label: "Hostel Fee \u2014 Sem 6", date: "2026-08-15", tint: "#EF4444" },
  { id: "u2", label: "Book due: Atomic Habits", date: "2026-07-28", tint: "#2563EB" },
  { id: "u3", label: "Book due: Refactoring", date: "2026-07-30", tint: "#0D9488" },
  { id: "u4", label: "Mid-sem \u2014 Data Structures", date: "2026-08-04", tint: "#7B4CED" }
];
export {
  attendanceTrend,
  hostelNoticesFeed,
  libraryCatalog,
  libraryNoticesFeed,
  myBorrowHistory,
  myBorrowed,
  myComplaints,
  myDocuments,
  myFees,
  myFurniture,
  myLeaves,
  myLibraryFines,
  myReservations,
  myVisitors,
  notificationsFeed,
  studentActivities,
  studentProfile,
  upcomingDueDates
};
