import {
  BookPlus,
  BookOpen,
  Undo2,
  BookMarked,
  IndianRupee,
  Gift,
  Megaphone
} from "lucide-react";
const libraryActivities = [
  { id: "l1", title: "Book Issued", meta: "Atomic Habits \u2192 Aarav Mehta", time: "3 min ago", icon: BookOpen, tint: "#0D9488" },
  { id: "l2", title: "Book Returned", meta: "Clean Code \u2192 Riya Shah", time: "22 min ago", icon: Undo2, tint: "#22C55E" },
  { id: "l3", title: "Reservation Placed", meta: "Deep Work \u2192 Kabir Verma", time: "1 hr ago", icon: BookMarked, tint: "#7B4CED" },
  { id: "l4", title: "New Book Added", meta: "Designing Data-Intensive Apps", time: "2 hr ago", icon: BookPlus, tint: "#2563EB" },
  { id: "l5", title: "Fine Collected", meta: "\u20B9120 \u2014 Neel Deshmukh", time: "4 hr ago", icon: IndianRupee, tint: "#EAB308" },
  { id: "l6", title: "Donation Received", meta: "12 books \u2014 Alumni Cell", time: "Yesterday", icon: Gift, tint: "#EF4444" },
  { id: "l7", title: "Notice Published", meta: "Library timings for exams", time: "Yesterday", icon: Megaphone, tint: "#3B82F6" }
];
const books = [
  { id: "b1", title: "Atomic Habits", isbn: "978-0735211292", author: "James Clear", category: "Self Help", copies: 8, available: 3, status: "Available", cover: "AH" },
  { id: "b2", title: "Clean Code", isbn: "978-0132350884", author: "Robert C. Martin", category: "Computer Science", copies: 6, available: 0, status: "Issued", cover: "CC" },
  { id: "b3", title: "Deep Work", isbn: "978-1455586691", author: "Cal Newport", category: "Productivity", copies: 5, available: 1, status: "Reserved", cover: "DW" },
  { id: "b4", title: "Designing Data-Intensive Apps", isbn: "978-1449373320", author: "Martin Kleppmann", category: "Computer Science", copies: 4, available: 2, status: "Available", cover: "DD" },
  { id: "b5", title: "The Pragmatic Programmer", isbn: "978-0135957059", author: "Dave Thomas", category: "Computer Science", copies: 5, available: 4, status: "Available", cover: "PP" },
  { id: "b6", title: "Sapiens", isbn: "978-0062316097", author: "Yuval Noah Harari", category: "History", copies: 6, available: 0, status: "Out of Stock", cover: "SP" },
  { id: "b7", title: "Introduction to Algorithms", isbn: "978-0262033848", author: "Cormen et al.", category: "Computer Science", copies: 7, available: 3, status: "Available", cover: "IA" },
  { id: "b8", title: "The Lean Startup", isbn: "978-0307887894", author: "Eric Ries", category: "Business", copies: 3, available: 1, status: "Reserved", cover: "LS" },
  { id: "b9", title: "Thinking, Fast and Slow", isbn: "978-0374533557", author: "Daniel Kahneman", category: "Psychology", copies: 4, available: 2, status: "Available", cover: "TF" },
  { id: "b10", title: "Refactoring", isbn: "978-0134757599", author: "Martin Fowler", category: "Computer Science", copies: 5, available: 5, status: "Available", cover: "RF" }
];
const bookCopies = [
  { id: "bc1", bookTitle: "Atomic Habits", accession: "ACC-00121", shelf: "SH-3B", condition: "Good", status: "Issued" },
  { id: "bc2", bookTitle: "Atomic Habits", accession: "ACC-00122", shelf: "SH-3B", condition: "New", status: "Available" },
  { id: "bc3", bookTitle: "Clean Code", accession: "ACC-00201", shelf: "CS-1A", condition: "Good", status: "Issued" },
  { id: "bc4", bookTitle: "Clean Code", accession: "ACC-00202", shelf: "CS-1A", condition: "Damaged", status: "Maintenance" },
  { id: "bc5", bookTitle: "Deep Work", accession: "ACC-00301", shelf: "SH-3C", condition: "Good", status: "Reserved" },
  { id: "bc6", bookTitle: "Sapiens", accession: "ACC-00410", shelf: "HS-2A", condition: "Good", status: "Issued" },
  { id: "bc7", bookTitle: "Refactoring", accession: "ACC-00512", shelf: "CS-1B", condition: "New", status: "Available" },
  { id: "bc8", bookTitle: "Introduction to Algorithms", accession: "ACC-00610", shelf: "CS-2C", condition: "Good", status: "Available" }
];
const issuedBooks = [
  { id: "i1", member: "Aarav Mehta", memberId: "VP2023CS012", bookTitle: "Atomic Habits", accession: "ACC-00121", issueDate: "2026-07-05", dueDate: "2026-07-19", status: "Issued" },
  { id: "i2", member: "Riya Shah", memberId: "VP2022EX045", bookTitle: "Clean Code", accession: "ACC-00201", issueDate: "2026-06-28", dueDate: "2026-07-12", status: "Overdue" },
  { id: "i3", member: "Kabir Verma", memberId: "VP2021ME101", bookTitle: "Sapiens", accession: "ACC-00410", issueDate: "2026-07-10", dueDate: "2026-07-24", status: "Issued" },
  { id: "i4", member: "Isha Patel", memberId: "VP2023IT077", bookTitle: "Deep Work", accession: "ACC-00301", issueDate: "2026-07-01", dueDate: "2026-07-15", status: "Overdue" },
  { id: "i5", member: "Sara Iyer", memberId: "VP2024CS220", bookTitle: "Refactoring", accession: "ACC-00512", issueDate: "2026-07-15", dueDate: "2026-07-29", status: "Issued" }
];
const reservations = [
  { id: "rv1", member: "Kabir Verma", memberId: "VP2021ME101", bookTitle: "Deep Work", reservedOn: "2026-07-16", position: 1, status: "Ready" },
  { id: "rv2", member: "Neel Deshmukh", memberId: "VP2020CV019", bookTitle: "Sapiens", reservedOn: "2026-07-17", position: 2, status: "Pending" },
  { id: "rv3", member: "Ananya Nair", memberId: "VP2021EX131", bookTitle: "Clean Code", reservedOn: "2026-07-18", position: 3, status: "Pending" },
  { id: "rv4", member: "Vivaan Rao", memberId: "VP2022ME088", bookTitle: "The Lean Startup", reservedOn: "2026-07-14", position: 1, status: "Ready" }
];
const bookRequests = [
  { id: "rq1", member: "Aarav Mehta", memberId: "VP2023CS012", bookTitle: "System Design Interview Vol. 2", author: "Alex Xu", requestedOn: "2026-07-18", status: "Pending" },
  { id: "rq2", member: "Sara Iyer", memberId: "VP2024CS220", bookTitle: "Grokking Algorithms", author: "Aditya Bhargava", requestedOn: "2026-07-16", status: "Approved" },
  { id: "rq3", member: "Riya Shah", memberId: "VP2022EX045", bookTitle: "The Art of Electronics", author: "Horowitz & Hill", requestedOn: "2026-07-12", status: "Rejected" }
];
const fines = [
  { id: "fn1", member: "Riya Shah", memberId: "VP2022EX045", bookTitle: "Clean Code", daysOverdue: 8, amount: 80, status: "Pending" },
  { id: "fn2", member: "Isha Patel", memberId: "VP2023IT077", bookTitle: "Deep Work", daysOverdue: 5, amount: 50, status: "Pending" },
  { id: "fn3", member: "Neel Deshmukh", memberId: "VP2020CV019", bookTitle: "Sapiens", daysOverdue: 12, amount: 120, status: "Paid" },
  { id: "fn4", member: "Vivaan Rao", memberId: "VP2022ME088", bookTitle: "Refactoring", daysOverdue: 3, amount: 30, status: "Waived" }
];
const donations = [
  { id: "d1", donor: "Alumni Cell \u2014 Batch of 2015", type: "Alumni", books: 12, date: "2026-07-17", status: "Cataloged" },
  { id: "d2", donor: "Prof. S. Deshpande", type: "Faculty", books: 6, date: "2026-07-14", status: "Received" },
  { id: "d3", donor: "Rotary Club, Mumbai", type: "External", books: 34, date: "2026-07-10", status: "Cataloged" },
  { id: "d4", donor: "Ananya Nair", type: "Student", books: 3, date: "2026-07-19", status: "Pending" }
];
const bookCirculation = [
  { month: "Feb", issued: 320, returned: 305 },
  { month: "Mar", issued: 410, returned: 388 },
  { month: "Apr", issued: 380, returned: 360 },
  { month: "May", issued: 460, returned: 442 },
  { month: "Jun", issued: 520, returned: 495 },
  { month: "Jul", issued: 580, returned: 540 }
];
const fineCollection = [
  { month: "Feb", amount: 4200 },
  { month: "Mar", amount: 5300 },
  { month: "Apr", amount: 4800 },
  { month: "May", amount: 6100 },
  { month: "Jun", amount: 7200 },
  { month: "Jul", amount: 6600 }
];
const mostBorrowed = [
  { name: "Clean Code", value: 84 },
  { name: "Atomic Habits", value: 72 },
  { name: "Sapiens", value: 65 },
  { name: "Deep Work", value: 58 },
  { name: "Refactoring", value: 47 }
];
const departmentUsage = [
  { name: "Computer", value: 320 },
  { name: "IT", value: 260 },
  { name: "EXTC", value: 195 },
  { name: "Mechanical", value: 168 },
  { name: "Civil", value: 122 }
];
export {
  bookCirculation,
  bookCopies,
  bookRequests,
  books,
  departmentUsage,
  donations,
  fineCollection,
  fines,
  issuedBooks,
  libraryActivities,
  mostBorrowed,
  reservations
};
