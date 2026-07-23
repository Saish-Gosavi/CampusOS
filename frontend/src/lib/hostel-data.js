import {
  UserPlus,
  BedDouble,
  MessageSquareWarning,
  IndianRupee,
  Megaphone,
  UserCog
} from "lucide-react";
const hostelActivities = [
  { id: "h1", title: "Student Registered", meta: "Aarav Mehta \u2014 CS, Year 2", time: "5 min ago", icon: UserPlus, tint: "#2563EB" },
  { id: "h2", title: "Room Allocated", meta: "Riya Shah \u2192 Block A \xB7 204", time: "20 min ago", icon: BedDouble, tint: "#7B4CED" },
  { id: "h3", title: "Complaint Raised", meta: "Water leak \u2014 Block B \xB7 118", time: "1 hr ago", icon: MessageSquareWarning, tint: "#EF4444" },
  { id: "h4", title: "Fee Paid", meta: "\u20B942,000 \u2014 Kabir Verma", time: "3 hr ago", icon: IndianRupee, tint: "#22C55E" },
  { id: "h5", title: "Notice Published", meta: "Mess menu update \u2014 Nov", time: "Yesterday", icon: Megaphone, tint: "#EAB308" },
  { id: "h6", title: "Staff Assigned", meta: "R. Kulkarni \u2192 Block C Warden", time: "Yesterday", icon: UserCog, tint: "#3B82F6" }
];
const students = [
  { id: "s1", name: "Aarav Mehta", enrollment: "VP2023CS012", department: "Computer", year: 2, room: "A-204", status: "Active", photo: "AM", gender: "Male", hostel: "Boys Hostel", contact: "+91 98200 10011", parentContact: "+91 98200 20011", email: "aarav.mehta@vppcoe.edu.in", dob: "2004-05-14", bloodGroup: "B+", address: "Andheri West, Mumbai", admissionYear: 2023, cgpa: 8.6, father: { name: "Rohit Mehta", occupation: "Engineer", contact: "+91 98200 20011" }, mother: { name: "Neha Mehta", occupation: "Teacher", contact: "+91 98200 20012" }, emergency: { name: "Ravi Mehta", relation: "Uncle", contact: "+91 98200 20013" }, joinedHostel: "2023-07-15" },
  { id: "s2", name: "Riya Shah", enrollment: "VP2022EX045", department: "EXTC", year: 3, room: "B-118", status: "Active", photo: "RS", gender: "Female", hostel: "Girls Hostel", contact: "+91 98200 10022", parentContact: "+91 98200 20022", email: "riya.shah@vppcoe.edu.in", dob: "2003-09-02", bloodGroup: "O+", address: "Borivali East, Mumbai", admissionYear: 2022, cgpa: 9.1, father: { name: "Nikhil Shah", occupation: "Businessman", contact: "+91 98200 20022" }, mother: { name: "Priya Shah", occupation: "Doctor", contact: "+91 98200 20023" }, emergency: { name: "Meera Shah", relation: "Aunt", contact: "+91 98200 20024" }, joinedHostel: "2022-07-10" },
  { id: "s3", name: "Kabir Verma", enrollment: "VP2021ME101", department: "Mechanical", year: 4, room: "C-302", status: "Active", photo: "KV", gender: "Male", hostel: "Boys Hostel", contact: "+91 98200 10033", parentContact: "+91 98200 20033", email: "kabir.verma@vppcoe.edu.in", dob: "2002-12-19", bloodGroup: "A+", address: "Thane West", admissionYear: 2021, cgpa: 7.8, father: { name: "Anil Verma", occupation: "Advocate", contact: "+91 98200 20033" }, mother: { name: "Sunita Verma", occupation: "Homemaker", contact: "+91 98200 20034" }, emergency: { name: "Dev Verma", relation: "Brother", contact: "+91 98200 20035" }, joinedHostel: "2021-07-12" },
  { id: "s4", name: "Isha Patel", enrollment: "VP2023IT077", department: "IT", year: 2, room: "A-210", status: "On Leave", photo: "IP", gender: "Female", hostel: "Girls Hostel", contact: "+91 98200 10044", parentContact: "+91 98200 20044", email: "isha.patel@vppcoe.edu.in", dob: "2004-02-08", bloodGroup: "AB+", address: "Vashi, Navi Mumbai", admissionYear: 2023, cgpa: 8.2, father: { name: "Jayesh Patel", occupation: "CA", contact: "+91 98200 20044" }, mother: { name: "Kinjal Patel", occupation: "Banker", contact: "+91 98200 20045" }, emergency: { name: "Ronak Patel", relation: "Cousin", contact: "+91 98200 20046" }, joinedHostel: "2023-07-16" },
  { id: "s5", name: "Neel Deshmukh", enrollment: "VP2020CV019", department: "Civil", year: 4, room: "D-105", status: "Active", photo: "ND", gender: "Male", hostel: "Boys Hostel", contact: "+91 98200 10055", parentContact: "+91 98200 20055", email: "neel.deshmukh@vppcoe.edu.in", dob: "2002-06-25", bloodGroup: "O-", address: "Pune, Maharashtra", admissionYear: 2020, cgpa: 8, father: { name: "Suresh Deshmukh", occupation: "Farmer", contact: "+91 98200 20055" }, mother: { name: "Vaishali Deshmukh", occupation: "Homemaker", contact: "+91 98200 20056" }, emergency: { name: "Amit Deshmukh", relation: "Brother", contact: "+91 98200 20057" }, joinedHostel: "2020-07-05" },
  { id: "s6", name: "Sara Iyer", enrollment: "VP2024CS220", department: "Computer", year: 1, room: "A-101", status: "Active", photo: "SI", gender: "Female", hostel: "Girls Hostel", contact: "+91 98200 10066", parentContact: "+91 98200 20066", email: "sara.iyer@vppcoe.edu.in", dob: "2005-11-30", bloodGroup: "B-", address: "Chennai, Tamil Nadu", admissionYear: 2024, cgpa: 8.9, father: { name: "Krishnan Iyer", occupation: "Professor", contact: "+91 98200 20066" }, mother: { name: "Lakshmi Iyer", occupation: "Scientist", contact: "+91 98200 20067" }, emergency: { name: "Ganesh Iyer", relation: "Uncle", contact: "+91 98200 20068" }, joinedHostel: "2024-07-20" },
  { id: "s7", name: "Vivaan Rao", enrollment: "VP2022ME088", department: "Mechanical", year: 3, room: "C-215", status: "Active", photo: "VR", gender: "Male", hostel: "Boys Hostel", contact: "+91 98200 10077", parentContact: "+91 98200 20077", email: "vivaan.rao@vppcoe.edu.in", dob: "2003-04-11", bloodGroup: "A-", address: "Hyderabad, Telangana", admissionYear: 2022, cgpa: 7.6, father: { name: "Raghav Rao", occupation: "Businessman", contact: "+91 98200 20077" }, mother: { name: "Shweta Rao", occupation: "Designer", contact: "+91 98200 20078" }, emergency: { name: "Karan Rao", relation: "Brother", contact: "+91 98200 20079" }, joinedHostel: "2022-07-11" },
  { id: "s8", name: "Ananya Nair", enrollment: "VP2021EX131", department: "EXTC", year: 4, room: "B-207", status: "Alumni", photo: "AN", gender: "Female", hostel: "Girls Hostel", contact: "+91 98200 10088", parentContact: "+91 98200 20088", email: "ananya.nair@vppcoe.edu.in", dob: "2002-08-22", bloodGroup: "O+", address: "Kochi, Kerala", admissionYear: 2021, cgpa: 9.3, father: { name: "Rajesh Nair", occupation: "IAS", contact: "+91 98200 20088" }, mother: { name: "Deepa Nair", occupation: "Doctor", contact: "+91 98200 20089" }, emergency: { name: "Nisha Nair", relation: "Sister", contact: "+91 98200 20090" }, joinedHostel: "2021-07-10" }
];
const rooms = [
  { id: "r1", block: "A", number: "101", beds: 3, occupied: 3, status: "Occupied", hostelId: "h1", blockId: "b1", floorId: "fl1", floor: 1, type: "Triple", rent: 8500, amenities: ["Wi-Fi", "Attached Bath", "Study Table"], description: "Corner room with balcony overlooking the quadrangle." },
  { id: "r2", block: "A", number: "102", beds: 3, occupied: 2, status: "Available", hostelId: "h1", blockId: "b1", floorId: "fl1", floor: 1, type: "Triple", rent: 8500, amenities: ["Wi-Fi", "Study Table"], description: "Standard triple-sharing with cross-ventilation." },
  { id: "r3", block: "A", number: "204", beds: 2, occupied: 2, status: "Occupied", hostelId: "h1", blockId: "b1", floorId: "fl2", floor: 2, type: "Double", rent: 10500, amenities: ["Wi-Fi", "Attached Bath", "AC"], description: "Air-conditioned double room, quiet wing." },
  { id: "r4", block: "B", number: "118", beds: 2, occupied: 1, status: "Available", hostelId: "h1", blockId: "b2", floorId: "fl6", floor: 1, type: "Double", rent: 10500, amenities: ["Wi-Fi", "Attached Bath"], description: "Bright double room near the common lounge." },
  { id: "r5", block: "B", number: "207", beds: 3, occupied: 0, status: "Maintenance", hostelId: "h1", blockId: "b2", floorId: "fl7", floor: 2, type: "Triple", rent: 8500, amenities: ["Wi-Fi"], description: "Currently under renovation \u2014 plumbing works." },
  { id: "r6", block: "C", number: "215", beds: 2, occupied: 2, status: "Occupied", hostelId: "h2", blockId: "b3", floorId: "fl11", floor: 2, type: "Double", rent: 11e3, amenities: ["Wi-Fi", "Attached Bath", "Wardrobe"], description: "Double room with dedicated study nook." },
  { id: "r7", block: "C", number: "302", beds: 1, occupied: 1, status: "Occupied", hostelId: "h2", blockId: "b3", floorId: "fl12", floor: 3, type: "Single", rent: 14500, amenities: ["Wi-Fi", "Attached Bath", "AC", "Wardrobe"], description: "Premium single room for senior residents." },
  { id: "r8", block: "D", number: "105", beds: 2, occupied: 1, status: "Available", hostelId: "h3", blockId: "b5", floorId: "fl19", floor: 1, type: "Double", rent: 12e3, amenities: ["Wi-Fi", "Attached Bath", "Balcony"], description: "Ground-floor double with balcony access." },
  { id: "r9", block: "D", number: "210", beds: 4, occupied: 0, status: "Available", hostelId: "h3", blockId: "b5", floorId: "fl20", floor: 2, type: "Dormitory", rent: 6500, amenities: ["Wi-Fi", "Lockers"], description: "Newly renovated 4-bed dormitory unit." },
  { id: "r10", block: "A", number: "205", beds: 1, occupied: 0, status: "Available", hostelId: "h1", blockId: "b1", floorId: "fl2", floor: 2, type: "Deluxe", rent: 16500, amenities: ["Wi-Fi", "Attached Bath", "AC", "Mini Fridge", "Study Table"], description: "Deluxe single with premium furnishings." },
  { id: "r11", block: "B", number: "310", beds: 2, occupied: 2, status: "Occupied", hostelId: "h1", blockId: "b2", floorId: "fl8", floor: 3, type: "Double", rent: 10500, amenities: ["Wi-Fi", "Attached Bath"], description: "Third-floor double, east-facing." },
  { id: "r12", block: "C", number: "108", beds: 3, occupied: 3, status: "Occupied", hostelId: "h2", blockId: "b4", floorId: "fl15", floor: 1, type: "Triple", rent: 9e3, amenities: ["Wi-Fi", "Study Table"], description: "Ground-floor triple, close to the mess hall." }
];
const staff = [
  { id: "st1", name: "R. Kulkarni", role: "Warden", block: "Block A", contact: "+91 98200 11122", shift: "Morning" },
  { id: "st2", name: "M. Pawar", role: "Warden", block: "Block B", contact: "+91 98200 22233", shift: "Evening" },
  { id: "st3", name: "S. Fernandes", role: "Security", block: "Main Gate", contact: "+91 98200 33344", shift: "Night" },
  { id: "st4", name: "L. Sharma", role: "Cook", block: "Mess", contact: "+91 98200 44455", shift: "Morning" },
  { id: "st5", name: "P. Gaikwad", role: "Cleaner", block: "Block C", contact: "+91 98200 55566", shift: "Morning" }
];
const fees = [
  { id: "f1", student: "Aarav Mehta", enrollment: "VP2023CS012", hostel: "Sahyadri Boys", room: "A-204", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-08-01", status: "Paid", receipt: "RCPT-0012", paidDate: "2026-07-28", method: "UPI" },
  { id: "f2", student: "Riya Shah", enrollment: "VP2022EX045", hostel: "Aravali Girls", room: "G-108", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-08-01", status: "Pending" },
  { id: "f3", student: "Kabir Verma", enrollment: "VP2021ME101", hostel: "Nilgiri Boys", room: "B-311", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-07-01", status: "Overdue" },
  { id: "f4", student: "Isha Patel", enrollment: "VP2023IT077", hostel: "Aravali Girls", room: "G-215", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-08-01", status: "Paid", receipt: "RCPT-0013", paidDate: "2026-07-25", method: "Net Banking" },
  { id: "f5", student: "Sara Iyer", enrollment: "VP2024CS220", hostel: "Aravali Girls", room: "G-101", semester: "Aug-Dec 2026", amount: 45e3, dueDate: "2026-08-01", status: "Pending" },
  { id: "f6", student: "Vivaan Rao", enrollment: "VP2022ME088", hostel: "Sahyadri Boys", room: "A-118", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-08-01", status: "Paid", receipt: "RCPT-0014", paidDate: "2026-07-30", method: "Card" },
  { id: "f7", student: "Neha Kulkarni", enrollment: "VP2023CE055", hostel: "Aravali Girls", room: "G-302", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-07-15", status: "Overdue" },
  { id: "f8", student: "Rohan Singh", enrollment: "VP2022EE063", hostel: "Nilgiri Boys", room: "B-209", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-08-01", status: "Paid", receipt: "RCPT-0015", paidDate: "2026-07-22", method: "UPI" },
  { id: "f9", student: "Meera Joshi", enrollment: "VP2024IT134", hostel: "Aravali Girls", room: "G-410", semester: "Aug-Dec 2026", amount: 45e3, dueDate: "2026-08-01", status: "Pending" },
  { id: "f10", student: "Aditya Nair", enrollment: "VP2021ME012", hostel: "Sahyadri Boys", room: "A-005", semester: "Aug-Dec 2026", amount: 42e3, dueDate: "2026-08-01", status: "Paid", receipt: "RCPT-0016", paidDate: "2026-07-18", method: "DD" }
];
const feeStructure = [
  { id: "fs1", category: "Accommodation", head: "Room Rent (Non-AC)", amount: 28e3, frequency: "Semester", applicableTo: "All Boys / Girls" },
  { id: "fs2", category: "Accommodation", head: "Room Rent (AC)", amount: 34e3, frequency: "Semester", applicableTo: "AC Blocks" },
  { id: "fs3", category: "Mess", head: "Mess Charges", amount: 12e3, frequency: "Semester", applicableTo: "All Residents" },
  { id: "fs4", category: "Security", head: "Refundable Deposit", amount: 1e4, frequency: "One-time", applicableTo: "New Admissions" },
  { id: "fs5", category: "Utilities", head: "Electricity & Water", amount: 2e3, frequency: "Semester", applicableTo: "All Residents" },
  { id: "fs6", category: "Amenities", head: "Wi-Fi & Common Area", amount: 1500, frequency: "Semester", applicableTo: "All Residents" },
  { id: "fs7", category: "Maintenance", head: "Housekeeping", amount: 1200, frequency: "Semester", applicableTo: "All Residents" }
];
const complaints = [
  { id: "c1", code: "CMP-1001", title: "Water leak in bathroom", description: "Continuous water leak from the shower pipe. Floor gets flooded within an hour.", raisedBy: "Riya Shah", enrollment: "VP2022EX045", contact: "+91 98200 10022", room: "B-118", hostel: "Girls Hostel", category: "Plumbing", priority: "High", status: "In Progress", assigned: "R. Kulkarni", createdAt: "2026-07-22 09:14", updatedAt: "2026-07-22 11:20", updates: [
    { at: "2026-07-22 09:14", by: "Riya Shah", note: "Complaint raised." },
    { at: "2026-07-22 10:02", by: "Hostel Admin", note: "Assigned to R. Kulkarni." },
    { at: "2026-07-22 11:20", by: "R. Kulkarni", note: "Plumber notified \u2014 visit scheduled today evening." }
  ] },
  { id: "c2", code: "CMP-1002", title: "Fan not working", description: "Ceiling fan stopped rotating since morning. Regulator seems fine.", raisedBy: "Aarav Mehta", enrollment: "VP2023CS012", contact: "+91 98200 10011", room: "A-204", hostel: "Boys Hostel", category: "Electrical", priority: "Medium", status: "Open", createdAt: "2026-07-22 06:40", updatedAt: "2026-07-22 06:40", updates: [
    { at: "2026-07-22 06:40", by: "Aarav Mehta", note: "Complaint raised." }
  ] },
  { id: "c3", code: "CMP-1003", title: "Mess food quality", description: "Dinner quality has dropped this week \u2014 repetitive menu and undercooked rice.", raisedBy: "Kabir Verma", enrollment: "VP2021ME101", contact: "+91 98200 10033", room: "C-302", hostel: "Boys Hostel", category: "Mess", priority: "Low", status: "Resolved", assigned: "L. Sharma", createdAt: "2026-07-20 20:15", updatedAt: "2026-07-21 12:00", resolvedAt: "2026-07-21 12:00", resolution: "Menu revised and cook briefed. Weekly review scheduled.", updates: [
    { at: "2026-07-20 20:15", by: "Kabir Verma", note: "Complaint raised." },
    { at: "2026-07-21 08:30", by: "Hostel Admin", note: "Assigned to L. Sharma." },
    { at: "2026-07-21 12:00", by: "L. Sharma", note: "Menu revised and cook briefed. Resolved." }
  ] },
  { id: "c4", code: "CMP-1004", title: "Corridor cleaning pending", description: "Second floor corridor was not cleaned for two days.", raisedBy: "Neel Deshmukh", enrollment: "VP2020CV019", contact: "+91 98200 10055", room: "D-105", hostel: "Boys Hostel", category: "Cleaning", priority: "Low", status: "Open", createdAt: "2026-07-21 18:00", updatedAt: "2026-07-21 18:00", updates: [
    { at: "2026-07-21 18:00", by: "Neel Deshmukh", note: "Complaint raised." }
  ] },
  { id: "c5", code: "CMP-1005", title: "Power outage in Block C", description: "Entire second floor lost power at 9 PM.", raisedBy: "Vivaan Rao", enrollment: "VP2021EC088", contact: "+91 98200 10088", room: "C-215", hostel: "Boys Hostel", category: "Electrical", priority: "High", status: "Resolved", assigned: "M. Pawar", createdAt: "2026-07-19 21:05", updatedAt: "2026-07-19 23:10", resolvedAt: "2026-07-19 23:10", resolution: "MCB tripped due to overload \u2014 reset and load balanced.", updates: [
    { at: "2026-07-19 21:05", by: "Vivaan Rao", note: "Complaint raised." },
    { at: "2026-07-19 21:20", by: "Hostel Admin", note: "Assigned to M. Pawar." },
    { at: "2026-07-19 23:10", by: "M. Pawar", note: "MCB reset \u2014 power restored." }
  ] },
  { id: "c6", code: "CMP-1006", title: "Wi-Fi extremely slow", description: "Router in Block A wing 2 is dropping every 10 minutes.", raisedBy: "Isha Patel", enrollment: "VP2023IT077", contact: "+91 98200 10044", room: "A-210", hostel: "Girls Hostel", category: "Internet", priority: "Medium", status: "In Progress", assigned: "S. Fernandes", createdAt: "2026-07-22 08:45", updatedAt: "2026-07-22 10:10", updates: [
    { at: "2026-07-22 08:45", by: "Isha Patel", note: "Complaint raised." },
    { at: "2026-07-22 10:10", by: "Hostel Admin", note: "Assigned to S. Fernandes \u2014 ISP engineer visit requested." }
  ] },
  { id: "c7", code: "CMP-1007", title: "Broken study chair", description: "Study chair leg cracked and unsafe to use.", raisedBy: "Sara Iyer", enrollment: "VP2022CS033", contact: "+91 98200 10077", room: "A-101", hostel: "Girls Hostel", category: "Furniture", priority: "Low", status: "Open", createdAt: "2026-07-22 07:30", updatedAt: "2026-07-22 07:30", updates: [
    { at: "2026-07-22 07:30", by: "Sara Iyer", note: "Complaint raised." }
  ] },
  { id: "c8", code: "CMP-1008", title: "Geyser not heating", description: "Bathroom geyser gives only cold water \u2014 issue since 3 days.", raisedBy: "Meera Joshi", enrollment: "VP2023CS021", contact: "+91 98200 10066", room: "A-112", hostel: "Girls Hostel", category: "Plumbing", priority: "Medium", status: "Closed", assigned: "R. Kulkarni", createdAt: "2026-07-15 07:00", updatedAt: "2026-07-17 14:00", resolvedAt: "2026-07-16 18:00", resolution: "Geyser element replaced. Closed after resident confirmation.", updates: [
    { at: "2026-07-15 07:00", by: "Meera Joshi", note: "Complaint raised." },
    { at: "2026-07-15 09:00", by: "Hostel Admin", note: "Assigned to R. Kulkarni." },
    { at: "2026-07-16 18:00", by: "R. Kulkarni", note: "Element replaced \u2014 resolved." },
    { at: "2026-07-17 14:00", by: "Hostel Admin", note: "Resident confirmed \u2014 closed." }
  ] }
];
const notices = [
  { id: "n1", title: "Mess menu update \u2014 November", body: "Revised weekly menu effective from Nov 1. Please review at the mess notice board. Suggestions may be shared with the mess committee by Nov 5.", audience: "All Blocks", category: "General", publishDate: "2026-07-20", expiryDate: "2026-08-20", publishedAt: "Today", status: "Published", attachment: { name: "mess-menu-nov.pdf", size: "184 KB" }, author: "Warden Office", pinned: true },
  { id: "n2", title: "Water tank cleaning \u2014 Block B", body: "Water supply will be paused between 10 AM and 2 PM on Friday for scheduled tank cleaning. Please store water in advance.", audience: "Block B", category: "Maintenance", publishDate: "2026-07-19", expiryDate: "2026-07-26", publishedAt: "Yesterday", status: "Published", attachment: null, author: "Maintenance", pinned: false },
  { id: "n3", title: "Diwali holiday guidelines", body: "Students planning to leave campus must fill the leave form 48 hours in advance. Hostel access will be restricted between Nov 10 and Nov 15.", audience: "All Blocks", category: "General", publishDate: "2026-07-18", expiryDate: "2026-11-15", publishedAt: "3 days ago", status: "Published", attachment: { name: "diwali-guidelines.pdf", size: "212 KB" }, author: "Chief Warden", pinned: true },
  { id: "n4", title: "Room inspection schedule", body: "Draft \u2014 to be published after warden review. Inspection tentatively planned for last week of the month.", audience: "Block A", category: "General", publishDate: "2026-07-25", expiryDate: "2026-08-05", publishedAt: "\u2014", status: "Draft", attachment: null, author: "Warden Office", pinned: false },
  { id: "n5", title: "Fire safety drill \u2014 Aug 3", body: "A mandatory fire safety drill will be conducted at 5:30 PM. All residents must assemble at the main quadrangle.", audience: "All Blocks", category: "Emergency", publishDate: "2026-07-30", expiryDate: "2026-08-04", publishedAt: "Scheduled", status: "Scheduled", attachment: null, author: "Security", pinned: false },
  { id: "n6", title: "Independence Day cultural night", body: "Cultural committee invites all residents to the Independence Day cultural night at the amphitheatre. Registrations open.", audience: "All Blocks", category: "Event", publishDate: "2026-07-15", expiryDate: "2026-08-16", publishedAt: "1 week ago", status: "Published", attachment: { name: "cultural-night.jpg", size: "1.2 MB" }, author: "Cultural Committee", pinned: false },
  { id: "n7", title: "Semester exam hall allocation", body: "Refer to the attached document for semester exam hall allocation. Report 30 minutes before your slot.", audience: "All Blocks", category: "Academic", publishDate: "2026-06-20", expiryDate: "2026-07-10", publishedAt: "Expired", status: "Expired", attachment: { name: "exam-halls.pdf", size: "96 KB" }, author: "Exam Cell", pinned: false }
];
const occupancyByBlock = [
  { name: "Block A", occupied: 84, capacity: 96 },
  { name: "Block B", occupied: 62, capacity: 88 },
  { name: "Block C", occupied: 71, capacity: 80 },
  { name: "Block D", occupied: 48, capacity: 72 }
];
const feeCollection = [
  { month: "Feb", collected: 12e5 },
  { month: "Mar", collected: 145e4 },
  { month: "Apr", collected: 162e4 },
  { month: "May", collected: 138e4 },
  { month: "Jun", collected: 174e4 },
  { month: "Jul", collected: 198e4 }
];
const complaintTrends = [
  { month: "Feb", raised: 22, resolved: 18 },
  { month: "Mar", raised: 28, resolved: 25 },
  { month: "Apr", raised: 19, resolved: 20 },
  { month: "May", raised: 34, resolved: 30 },
  { month: "Jun", raised: 26, resolved: 24 },
  { month: "Jul", raised: 31, resolved: 29 }
];
const studentsByYear = [
  { name: "Year 1", value: 88 },
  { name: "Year 2", value: 74 },
  { name: "Year 3", value: 66 },
  { name: "Year 4", value: 52 }
];
const complaintOverview = [
  { name: "Open", value: 6, color: "#EF4444" },
  { name: "In Progress", value: 3, color: "#EAB308" },
  { name: "Resolved", value: 41, color: "#22C55E" }
];
const leaveRequestOverview = [
  { name: "Pending", value: 8, color: "#EAB308" },
  { name: "Approved", value: 27, color: "#22C55E" },
  { name: "Rejected", value: 4, color: "#EF4444" }
];
const leaveRequests = [
  { id: "l1", studentId: "s1", student: "Aarav Mehta", enrollment: "VP2023CS012", room: "A-204", hostel: "Boys Hostel", contact: "+91 98200 10011", leaveType: "Family Function", from: "2026-07-22", to: "2026-07-25", days: 4, reason: "Sister's engagement ceremony at home town.", destination: "Andheri West, Mumbai", parentContact: "+91 98200 20011", appliedOn: "2026-07-18", status: "Pending", remarks: "" },
  { id: "l2", studentId: "s7", student: "Sara Iyer", enrollment: "VP2022CS033", room: "A-101", hostel: "Girls Hostel", contact: "+91 98200 10077", leaveType: "Medical", from: "2026-07-24", to: "2026-07-28", days: 5, reason: "Dental surgery and post-op recovery.", destination: "Bandra, Mumbai", parentContact: "+91 98200 20077", appliedOn: "2026-07-15", status: "Approved", remarks: "Approved \u2014 carry medical certificate on return.", reviewedBy: "Warden R. Kulkarni", reviewedOn: "2026-07-16" },
  { id: "l3", studentId: "s8", student: "Vivaan Rao", enrollment: "VP2021EC088", room: "C-215", hostel: "Boys Hostel", contact: "+91 98200 10088", leaveType: "Family Function", from: "2026-07-26", to: "2026-07-30", days: 5, reason: "Cousin's wedding ceremony.", destination: "Pune, Maharashtra", parentContact: "+91 98200 20088", appliedOn: "2026-07-19", status: "Pending", remarks: "" },
  { id: "l4", studentId: "s3", student: "Kabir Verma", enrollment: "VP2021ME101", room: "C-302", hostel: "Boys Hostel", contact: "+91 98200 10033", leaveType: "Home Visit", from: "2026-07-10", to: "2026-07-14", days: 5, reason: "Monthly home visit.", destination: "Thane West", parentContact: "+91 98200 20033", appliedOn: "2026-07-05", status: "Approved", remarks: "Approved.", reviewedBy: "Warden A. Patil", reviewedOn: "2026-07-06" },
  { id: "l5", studentId: "s4", student: "Isha Patel", enrollment: "VP2023IT077", room: "A-210", hostel: "Girls Hostel", contact: "+91 98200 10044", leaveType: "Medical", from: "2026-07-08", to: "2026-07-20", days: 13, reason: "Extended fever recovery at home.", destination: "Vashi, Navi Mumbai", parentContact: "+91 98200 20044", appliedOn: "2026-07-07", status: "Approved", remarks: "Approved on medical grounds.", reviewedBy: "Warden R. Kulkarni", reviewedOn: "2026-07-07" },
  { id: "l6", studentId: "s2", student: "Riya Shah", enrollment: "VP2022EX045", room: "B-118", hostel: "Girls Hostel", contact: "+91 98200 10022", leaveType: "Personal", from: "2026-07-02", to: "2026-07-04", days: 3, reason: "Personal errands.", destination: "Borivali East, Mumbai", parentContact: "+91 98200 20022", appliedOn: "2026-07-01", status: "Rejected", remarks: "Insufficient reason and short notice.", reviewedBy: "Warden R. Kulkarni", reviewedOn: "2026-07-01" },
  { id: "l7", studentId: "s5", student: "Neel Deshmukh", enrollment: "VP2020CV019", room: "D-105", hostel: "Boys Hostel", contact: "+91 98200 10055", leaveType: "Emergency", from: "2026-07-20", to: "2026-07-23", days: 4, reason: "Grandfather hospitalised \u2014 emergency travel.", destination: "Pune, Maharashtra", parentContact: "+91 98200 20055", appliedOn: "2026-07-20", status: "Pending", remarks: "" },
  { id: "l8", studentId: "s6", student: "Meera Joshi", enrollment: "VP2023CS021", room: "A-112", hostel: "Girls Hostel", contact: "+91 98200 10066", leaveType: "Academic", from: "2026-07-28", to: "2026-07-30", days: 3, reason: "IEEE paper presentation at IIT Bombay.", destination: "Powai, Mumbai", parentContact: "+91 98200 20066", appliedOn: "2026-07-17", status: "Pending", remarks: "" }
];
const hostels = [
  { id: "h1", name: "Vivekananda Boys Hostel", type: "Boys", address: "Sector 4, VPPCOE Campus, Sion", capacity: 320, occupied: 284, floors: 5, blocks: 2, warden: "R. Kulkarni", wardenContact: "+91 98200 11122", status: "Active", establishedYear: 2010, amenities: ["Wi-Fi", "Mess", "Gym", "Laundry", "Study Hall"], image: "from-[#2563EB] to-[#1e40af]" },
  { id: "h2", name: "Sarojini Girls Hostel", type: "Girls", address: "Sector 6, VPPCOE Campus, Sion", capacity: 240, occupied: 218, floors: 4, blocks: 2, warden: "M. Pawar", wardenContact: "+91 98200 22233", status: "Active", establishedYear: 2012, amenities: ["Wi-Fi", "Mess", "Library", "Laundry"], image: "from-[#7B4CED] to-[#5B2FCB]" },
  { id: "h3", name: "Tagore International Hostel", type: "Co-ed", address: "Sector 8, VPPCOE Campus, Sion", capacity: 180, occupied: 122, floors: 6, blocks: 1, warden: "S. Fernandes", wardenContact: "+91 98200 33344", status: "Active", establishedYear: 2018, amenities: ["Wi-Fi", "Mess", "Gym", "Recreation", "Study Hall", "Cafe"], image: "from-[#0D9488] to-[#065F46]" },
  { id: "h4", name: "Ambedkar Post Graduate Hostel", type: "Boys", address: "Sector 2, VPPCOE Campus, Sion", capacity: 160, occupied: 148, floors: 4, blocks: 1, warden: "P. Gaikwad", wardenContact: "+91 98200 55566", status: "Active", establishedYear: 2015, amenities: ["Wi-Fi", "Mess", "Reading Room"], image: "from-[#EA580C] to-[#9A3412]" },
  { id: "h5", name: "Kalpana Chawla Girls Hostel", type: "Girls", address: "Sector 6B, VPPCOE Campus, Sion", capacity: 200, occupied: 0, floors: 4, blocks: 1, warden: "Vacant", wardenContact: "\u2014", status: "Under Maintenance", establishedYear: 2020, amenities: ["Wi-Fi", "Mess", "Gym", "Laundry"], image: "from-[#DB2777] to-[#9D174D]" },
  { id: "h6", name: "Aryabhata Research Hostel", type: "Co-ed", address: "Sector 9, VPPCOE Campus, Sion", capacity: 96, occupied: 12, floors: 3, blocks: 1, warden: "L. Sharma", wardenContact: "+91 98200 44455", status: "Inactive", establishedYear: 2008, amenities: ["Wi-Fi", "Mess"], image: "from-[#475569] to-[#1F2937]" }
];
const blocks = [
  { id: "b1", name: "Block A", hostelId: "h1", floors: 5, totalRooms: 60, occupiedRooms: 54, status: "Active", inCharge: "R. Kulkarni" },
  { id: "b2", name: "Block B", hostelId: "h1", floors: 5, totalRooms: 60, occupiedRooms: 48, status: "Active", inCharge: "A. Deshpande" },
  { id: "b3", name: "Block A", hostelId: "h2", floors: 4, totalRooms: 48, occupiedRooms: 44, status: "Active", inCharge: "M. Pawar" },
  { id: "b4", name: "Block B", hostelId: "h2", floors: 4, totalRooms: 48, occupiedRooms: 40, status: "Active", inCharge: "S. Joshi" },
  { id: "b5", name: "Block A", hostelId: "h3", floors: 6, totalRooms: 72, occupiedRooms: 55, status: "Active", inCharge: "S. Fernandes" },
  { id: "b6", name: "Block A", hostelId: "h4", floors: 4, totalRooms: 40, occupiedRooms: 38, status: "Active", inCharge: "P. Gaikwad" },
  { id: "b7", name: "Block A", hostelId: "h5", floors: 4, totalRooms: 50, occupiedRooms: 0, status: "Under Maintenance", inCharge: "Vacant" },
  { id: "b8", name: "Block A", hostelId: "h6", floors: 3, totalRooms: 24, occupiedRooms: 12, status: "Inactive", inCharge: "L. Sharma" }
];
const floors = [
  { id: "fl1", number: 1, blockId: "b1", totalRooms: 12, occupiedRooms: 11, status: "Active" },
  { id: "fl2", number: 2, blockId: "b1", totalRooms: 12, occupiedRooms: 12, status: "Active" },
  { id: "fl3", number: 3, blockId: "b1", totalRooms: 12, occupiedRooms: 10, status: "Active" },
  { id: "fl4", number: 4, blockId: "b1", totalRooms: 12, occupiedRooms: 11, status: "Active" },
  { id: "fl5", number: 5, blockId: "b1", totalRooms: 12, occupiedRooms: 10, status: "Under Maintenance" },
  { id: "fl6", number: 1, blockId: "b2", totalRooms: 12, occupiedRooms: 10, status: "Active" },
  { id: "fl7", number: 2, blockId: "b2", totalRooms: 12, occupiedRooms: 11, status: "Active" },
  { id: "fl8", number: 3, blockId: "b2", totalRooms: 12, occupiedRooms: 9, status: "Active" },
  { id: "fl9", number: 4, blockId: "b2", totalRooms: 12, occupiedRooms: 10, status: "Active" },
  { id: "fl10", number: 5, blockId: "b2", totalRooms: 12, occupiedRooms: 8, status: "Active" },
  { id: "fl11", number: 1, blockId: "b3", totalRooms: 12, occupiedRooms: 12, status: "Active" },
  { id: "fl12", number: 2, blockId: "b3", totalRooms: 12, occupiedRooms: 11, status: "Active" },
  { id: "fl13", number: 3, blockId: "b3", totalRooms: 12, occupiedRooms: 11, status: "Active" },
  { id: "fl14", number: 4, blockId: "b3", totalRooms: 12, occupiedRooms: 10, status: "Active" },
  { id: "fl15", number: 1, blockId: "b4", totalRooms: 12, occupiedRooms: 10, status: "Active" },
  { id: "fl16", number: 2, blockId: "b4", totalRooms: 12, occupiedRooms: 10, status: "Active" },
  { id: "fl17", number: 3, blockId: "b4", totalRooms: 12, occupiedRooms: 10, status: "Active" },
  { id: "fl18", number: 4, blockId: "b4", totalRooms: 12, occupiedRooms: 10, status: "Under Maintenance" },
  { id: "fl19", number: 1, blockId: "b5", totalRooms: 18, occupiedRooms: 14, status: "Active" },
  { id: "fl20", number: 2, blockId: "b5", totalRooms: 18, occupiedRooms: 15, status: "Active" },
  { id: "fl21", number: 3, blockId: "b5", totalRooms: 18, occupiedRooms: 13, status: "Active" },
  { id: "fl22", number: 4, blockId: "b5", totalRooms: 18, occupiedRooms: 13, status: "Active" },
  { id: "fl23", number: 1, blockId: "b6", totalRooms: 10, occupiedRooms: 10, status: "Active" },
  { id: "fl24", number: 2, blockId: "b6", totalRooms: 10, occupiedRooms: 10, status: "Active" },
  { id: "fl25", number: 3, blockId: "b6", totalRooms: 10, occupiedRooms: 9, status: "Active" },
  { id: "fl26", number: 4, blockId: "b6", totalRooms: 10, occupiedRooms: 9, status: "Active" },
  { id: "fl27", number: 1, blockId: "b7", totalRooms: 13, occupiedRooms: 0, status: "Under Maintenance" },
  { id: "fl28", number: 2, blockId: "b7", totalRooms: 13, occupiedRooms: 0, status: "Under Maintenance" },
  { id: "fl29", number: 3, blockId: "b7", totalRooms: 12, occupiedRooms: 0, status: "Under Maintenance" },
  { id: "fl30", number: 4, blockId: "b7", totalRooms: 12, occupiedRooms: 0, status: "Under Maintenance" },
  { id: "fl31", number: 1, blockId: "b8", totalRooms: 8, occupiedRooms: 5, status: "Inactive" },
  { id: "fl32", number: 2, blockId: "b8", totalRooms: 8, occupiedRooms: 4, status: "Inactive" },
  { id: "fl33", number: 3, blockId: "b8", totalRooms: 8, occupiedRooms: 3, status: "Inactive" }
];
const beds = [
  { id: "bd1", number: "B1", roomId: "r1", studentId: "s1", type: "Single", status: "Occupied" },
  { id: "bd2", number: "B2", roomId: "r1", studentId: "s2", type: "Bunk-Upper", status: "Occupied" },
  { id: "bd3", number: "B3", roomId: "r1", studentId: "s3", type: "Bunk-Lower", status: "Occupied" },
  { id: "bd4", number: "B1", roomId: "r2", studentId: "s7", type: "Single", status: "Occupied" },
  { id: "bd5", number: "B2", roomId: "r2", type: "Bunk-Upper", status: "Available" },
  { id: "bd6", number: "B3", roomId: "r2", type: "Bunk-Lower", status: "Reserved", notes: "Held for incoming transfer" },
  { id: "bd7", number: "B1", roomId: "r3", studentId: "s4", type: "Single", status: "Occupied" },
  { id: "bd8", number: "B2", roomId: "r3", studentId: "s6", type: "Single", status: "Occupied" },
  { id: "bd9", number: "B1", roomId: "r4", studentId: "s5", type: "Single", status: "Occupied" },
  { id: "bd10", number: "B2", roomId: "r4", type: "Single", status: "Available" },
  { id: "bd11", number: "B1", roomId: "r5", type: "Single", status: "Maintenance", notes: "Frame replacement scheduled" },
  { id: "bd12", number: "B2", roomId: "r5", type: "Bunk-Upper", status: "Maintenance" },
  { id: "bd13", number: "B3", roomId: "r5", type: "Bunk-Lower", status: "Maintenance" },
  { id: "bd14", number: "B1", roomId: "r6", studentId: "s7", type: "Single", status: "Occupied" },
  { id: "bd15", number: "B2", roomId: "r6", studentId: "s8", type: "Single", status: "Occupied" },
  { id: "bd16", number: "B1", roomId: "r7", studentId: "s2", type: "Single", status: "Occupied" },
  { id: "bd17", number: "B1", roomId: "r8", studentId: "s5", type: "Single", status: "Occupied" },
  { id: "bd18", number: "B2", roomId: "r8", type: "Single", status: "Reserved", notes: "Assigned for next intake" },
  { id: "bd19", number: "B1", roomId: "r9", type: "Bunk-Upper", status: "Available" },
  { id: "bd20", number: "B2", roomId: "r9", type: "Bunk-Lower", status: "Available" },
  { id: "bd21", number: "B3", roomId: "r9", type: "Bunk-Upper", status: "Available" },
  { id: "bd22", number: "B4", roomId: "r9", type: "Bunk-Lower", status: "Available" },
  { id: "bd23", number: "B1", roomId: "r10", type: "Single", status: "Available" },
  { id: "bd24", number: "B1", roomId: "r11", studentId: "s1", type: "Single", status: "Occupied" },
  { id: "bd25", number: "B2", roomId: "r11", studentId: "s3", type: "Single", status: "Occupied" },
  { id: "bd26", number: "B1", roomId: "r12", studentId: "s4", type: "Single", status: "Occupied" },
  { id: "bd27", number: "B2", roomId: "r12", studentId: "s6", type: "Bunk-Upper", status: "Occupied" },
  { id: "bd28", number: "B3", roomId: "r12", studentId: "s8", type: "Bunk-Lower", status: "Occupied" }
];
const allocations = [
  { id: "al1", studentId: "s1", hostelId: "h1", blockId: "b1", floorId: "fl1", roomId: "r1", bedId: "bd1", allocatedOn: "2023-07-15", status: "Active" },
  { id: "al2", studentId: "s2", hostelId: "h2", blockId: "b3", floorId: "fl12", roomId: "r7", bedId: "bd16", allocatedOn: "2022-07-10", status: "Active", note: "Transferred from Block A" },
  { id: "al3", studentId: "s3", hostelId: "h1", blockId: "b2", floorId: "fl8", roomId: "r11", bedId: "bd25", allocatedOn: "2021-07-12", status: "Active" },
  { id: "al4", studentId: "s4", hostelId: "h1", blockId: "b1", floorId: "fl2", roomId: "r3", bedId: "bd7", allocatedOn: "2023-07-16", status: "Active" },
  { id: "al5", studentId: "s5", hostelId: "h3", blockId: "b5", floorId: "fl19", roomId: "r8", bedId: "bd17", allocatedOn: "2020-07-05", status: "Active" },
  { id: "al6", studentId: "s6", hostelId: "h2", blockId: "b4", floorId: "fl15", roomId: "r12", bedId: "bd27", allocatedOn: "2024-07-20", status: "Active" },
  { id: "al7", studentId: "s7", hostelId: "h2", blockId: "b3", floorId: "fl11", roomId: "r6", bedId: "bd14", allocatedOn: "2022-07-11", status: "Active" },
  { id: "al8", studentId: "s8", hostelId: "h2", blockId: "b4", floorId: "fl15", roomId: "r12", bedId: "bd28", allocatedOn: "2021-07-10", vacatedOn: "2025-05-30", status: "Vacated", note: "Graduated" },
  { id: "al9", studentId: "s2", hostelId: "h2", blockId: "b3", floorId: "fl11", roomId: "r6", bedId: "bd15", allocatedOn: "2022-07-10", vacatedOn: "2024-01-15", status: "Transferred", note: "Room change on request" },
  { id: "al10", studentId: "s3", hostelId: "h2", blockId: "b3", floorId: "fl12", roomId: "r7", bedId: "bd16", allocatedOn: "2021-07-12", vacatedOn: "2023-06-30", status: "Transferred", note: "Moved to Block B" }
];
const visitorRequests = [
  { id: "v1", visitorName: "Ramesh Mehta", visitorPhone: "+91 98200 20011", visitorIdProof: "AADHAR ****3421", studentId: "s1", student: "Aarav Mehta", enrollment: "VP2023CS012", hostel: "Boys Hostel", room: "A-204", relation: "Father", visitDate: "2026-07-23", entryTime: "10:30", exitTime: "13:00", purpose: "Weekend visit \u2014 bringing home essentials.", status: "Pending", remarks: "", requestedOn: "2026-07-21" },
  { id: "v2", visitorName: "Sunita Iyer", visitorPhone: "+91 98200 20077", visitorIdProof: "PAN ****K72J", studentId: "s7", student: "Sara Iyer", enrollment: "VP2022CS033", hostel: "Girls Hostel", room: "A-101", relation: "Mother", visitDate: "2026-07-22", entryTime: "16:00", exitTime: "18:30", purpose: "Post-surgery check-in on daughter.", status: "Approved", remarks: "Approved \u2014 please carry ID at gate.", requestedOn: "2026-07-20", reviewedBy: "Warden R. Kulkarni", reviewedOn: "2026-07-20" },
  { id: "v3", visitorName: "Aditya Rao", visitorPhone: "+91 98200 20088", visitorIdProof: "AADHAR ****9911", studentId: "s8", student: "Vivaan Rao", enrollment: "VP2021EC088", hostel: "Boys Hostel", room: "C-215", relation: "Sibling", visitDate: "2026-07-24", entryTime: "11:00", exitTime: "14:00", purpose: "Handover of wedding invitations.", status: "Pending", remarks: "", requestedOn: "2026-07-21" },
  { id: "v4", visitorName: "Nikhil Shah", visitorPhone: "+91 98111 55220", visitorIdProof: "AADHAR ****4581", studentId: "s2", student: "Riya Shah", enrollment: "VP2022EX045", hostel: "Girls Hostel", room: "B-118", relation: "Guardian", visitDate: "2026-07-22", entryTime: "17:00", exitTime: "19:00", purpose: "Local guardian meeting.", status: "Rejected", remarks: "Visitor slot already fully booked for the day.", requestedOn: "2026-07-19", reviewedBy: "Warden R. Kulkarni", reviewedOn: "2026-07-20" },
  { id: "v5", visitorName: "Manoj Verma", visitorPhone: "+91 98200 20033", visitorIdProof: "AADHAR ****7712", studentId: "s3", student: "Kabir Verma", enrollment: "VP2021ME101", hostel: "Boys Hostel", room: "C-302", relation: "Father", visitDate: "2026-07-15", entryTime: "10:00", exitTime: "12:30", purpose: "Monthly visit.", status: "Checked-Out", remarks: "Visit completed on time.", requestedOn: "2026-07-13", reviewedBy: "Security Desk", reviewedOn: "2026-07-14" },
  { id: "v6", visitorName: "Reshma Patel", visitorPhone: "+91 98200 20044", visitorIdProof: "PAN ****L92B", studentId: "s4", student: "Isha Patel", enrollment: "VP2023IT077", hostel: "Girls Hostel", room: "A-210", relation: "Mother", visitDate: "2026-07-22", entryTime: "09:30", exitTime: "12:00", purpose: "Dropping off medicines.", status: "Checked-In", remarks: "Currently inside campus.", requestedOn: "2026-07-21", reviewedBy: "Warden M. Pawar", reviewedOn: "2026-07-21" },
  { id: "v7", visitorName: "Kunal Joshi", visitorPhone: "+91 98200 20066", visitorIdProof: "AADHAR ****3390", studentId: "s6", student: "Meera Joshi", enrollment: "VP2023CS021", hostel: "Girls Hostel", room: "A-112", relation: "Sibling", visitDate: "2026-07-05", entryTime: "11:00", exitTime: "13:00", purpose: "Personal.", status: "Expired", remarks: "Visitor did not report at gate.", requestedOn: "2026-07-03", reviewedBy: "Warden M. Pawar", reviewedOn: "2026-07-04" },
  { id: "v8", visitorName: "Prakash Deshmukh", visitorPhone: "+91 98200 20055", visitorIdProof: "AADHAR ****1207", studentId: "s5", student: "Neel Deshmukh", enrollment: "VP2020CV019", hostel: "Boys Hostel", room: "D-105", relation: "Father", visitDate: "2026-07-25", entryTime: "15:00", exitTime: "17:00", purpose: "Semester result discussion.", status: "Pending", remarks: "", requestedOn: "2026-07-21" },
  { id: "v9", visitorName: "Anjali Rao", visitorPhone: "+91 98411 88220", visitorIdProof: "AADHAR ****6620", studentId: "s8", student: "Vivaan Rao", enrollment: "VP2021EC088", hostel: "Boys Hostel", room: "C-215", relation: "Relative", visitDate: "2026-07-10", entryTime: "12:00", exitTime: "14:00", purpose: "Family visit.", status: "Checked-Out", remarks: "Uneventful.", requestedOn: "2026-07-08", reviewedBy: "Security Desk", reviewedOn: "2026-07-09" }
];
const inOutEntries = [
  { id: "io1", studentId: "s1", student: "Aarav Mehta", enrollment: "VP2023CS012", hostel: "Boys Hostel", room: "A-204", purpose: "Class", destination: "Academic Block", outDate: "2026-07-22", outTime: "08:45", expectedReturn: "17:00", status: "Outside", gate: "Hostel Gate", loggedBy: "Security \xB7 S. Rane", method: "QR Scan" },
  { id: "io2", studentId: "s2", student: "Riya Shah", enrollment: "VP2022EX045", hostel: "Girls Hostel", room: "B-118", purpose: "Library", destination: "Central Library", outDate: "2026-07-22", outTime: "09:10", expectedReturn: "13:00", inDate: "2026-07-22", inTime: "12:45", status: "Returned", gate: "Hostel Gate", loggedBy: "Security \xB7 P. Naik", method: "QR Scan" },
  { id: "io3", studentId: "s3", student: "Kabir Verma", enrollment: "VP2021ME101", hostel: "Boys Hostel", room: "C-302", purpose: "Personal", destination: "Sion Market", outDate: "2026-07-22", outTime: "10:20", expectedReturn: "13:30", status: "Outside", gate: "Main Gate", loggedBy: "Security \xB7 A. Kadam", method: "Manual" },
  { id: "io4", studentId: "s4", student: "Isha Patel", enrollment: "VP2023IT077", hostel: "Girls Hostel", room: "A-210", purpose: "Medical", destination: "Sion Hospital", outDate: "2026-07-22", outTime: "07:30", expectedReturn: "11:00", inDate: "2026-07-22", inTime: "11:35", status: "Late Return", gate: "Main Gate", loggedBy: "Security \xB7 P. Naik", method: "ID Card", remarks: "Returned 35 min late \u2014 traffic." },
  { id: "io5", studentId: "s5", student: "Neel Deshmukh", enrollment: "VP2020CV019", hostel: "Boys Hostel", room: "D-105", purpose: "Sports", destination: "District Stadium", outDate: "2026-07-22", outTime: "06:00", expectedReturn: "09:30", inDate: "2026-07-22", inTime: "09:20", status: "Returned", gate: "Side Gate", loggedBy: "Security \xB7 S. Rane", method: "QR Scan" },
  { id: "io6", studentId: "s6", student: "Meera Joshi", enrollment: "VP2023CS021", hostel: "Girls Hostel", room: "A-112", purpose: "Class", destination: "Academic Block", outDate: "2026-07-22", outTime: "08:50", expectedReturn: "17:00", status: "Outside", gate: "Hostel Gate", loggedBy: "Security \xB7 P. Naik", method: "QR Scan" },
  { id: "io7", studentId: "s7", student: "Sara Iyer", enrollment: "VP2022CS033", hostel: "Girls Hostel", room: "A-101", purpose: "Personal", destination: "Bandra", outDate: "2026-07-22", outTime: "11:00", expectedReturn: "15:00", status: "Outside", gate: "Main Gate", loggedBy: "Security \xB7 A. Kadam", method: "Manual" },
  { id: "io8", studentId: "s8", student: "Vivaan Rao", enrollment: "VP2021EC088", hostel: "Boys Hostel", room: "C-215", purpose: "Home Visit", destination: "Andheri West", outDate: "2026-07-21", outTime: "18:00", expectedReturn: "22:00", status: "Overdue", gate: "Main Gate", loggedBy: "Security \xB7 S. Rane", method: "QR Scan", remarks: "Not returned overnight \u2014 flagged." },
  { id: "io9", studentId: "s1", student: "Aarav Mehta", enrollment: "VP2023CS012", hostel: "Boys Hostel", room: "A-204", purpose: "Library", destination: "Central Library", outDate: "2026-07-21", outTime: "19:00", expectedReturn: "22:00", inDate: "2026-07-21", inTime: "21:50", status: "Returned", gate: "Hostel Gate", loggedBy: "Security \xB7 N. Salunke", method: "QR Scan" },
  { id: "io10", studentId: "s3", student: "Kabir Verma", enrollment: "VP2021ME101", hostel: "Boys Hostel", room: "C-302", purpose: "Personal", destination: "Thane West", outDate: "2026-07-20", outTime: "10:00", expectedReturn: "20:00", inDate: "2026-07-20", inTime: "22:30", status: "Late Return", gate: "Main Gate", loggedBy: "Security \xB7 N. Salunke", method: "Manual", remarks: "Late return \u2014 informed warden." },
  { id: "io11", studentId: "s4", student: "Isha Patel", enrollment: "VP2023IT077", hostel: "Girls Hostel", room: "A-210", purpose: "Class", destination: "Academic Block", outDate: "2026-07-20", outTime: "08:45", expectedReturn: "17:00", inDate: "2026-07-20", inTime: "16:50", status: "Returned", gate: "Hostel Gate", loggedBy: "Security \xB7 P. Naik", method: "QR Scan" },
  { id: "io12", studentId: "s6", student: "Meera Joshi", enrollment: "VP2023CS021", hostel: "Girls Hostel", room: "A-112", purpose: "Sports", destination: "College Ground", outDate: "2026-07-19", outTime: "16:00", expectedReturn: "18:30", inDate: "2026-07-19", inTime: "18:25", status: "Returned", gate: "Side Gate", loggedBy: "Security \xB7 A. Kadam", method: "QR Scan" }
];
const furnitureItems = [
  { id: "f1", code: "FRN-B-1001", category: "Bed", hostel: "Boys Hostel", room: "A-204", block: "A", purchaseDate: "2023-06-12", vendor: "Godrej Interio", cost: 9800, condition: "Good", status: "In Use", assignedTo: "Aarav Mehta", lastInspected: "2026-06-10" },
  { id: "f2", code: "FRN-T-1002", category: "Study Table", hostel: "Boys Hostel", room: "A-204", block: "A", purchaseDate: "2023-06-12", vendor: "Godrej Interio", cost: 4200, condition: "Good", status: "In Use", assignedTo: "Aarav Mehta", lastInspected: "2026-06-10" },
  { id: "f3", code: "FRN-C-1003", category: "Chair", hostel: "Boys Hostel", room: "A-204", block: "A", purchaseDate: "2023-06-12", vendor: "Nilkamal", cost: 1400, condition: "Fair", status: "In Use", assignedTo: "Aarav Mehta", lastInspected: "2026-06-10", notes: "Seat cushion worn." },
  { id: "f4", code: "FRN-W-1004", category: "Wardrobe", hostel: "Girls Hostel", room: "B-118", block: "B", purchaseDate: "2022-07-05", vendor: "Wooden Street", cost: 12800, condition: "Good", status: "Assigned", assignedTo: "Riya Shah", lastInspected: "2026-05-22" },
  { id: "f5", code: "FRN-F-1005", category: "Fan", hostel: "Girls Hostel", room: "B-118", block: "B", purchaseDate: "2022-07-05", vendor: "Crompton", cost: 2600, condition: "Damaged", status: "Under Maintenance", lastInspected: "2026-07-12", notes: "Motor humming \u2014 scheduled for rewinding." },
  { id: "f6", code: "FRN-M-1006", category: "Mattress", hostel: "Boys Hostel", room: "C-302", block: "C", purchaseDate: "2024-01-20", vendor: "Sleepwell", cost: 6800, condition: "Good", status: "In Use", assignedTo: "Kabir Verma", lastInspected: "2026-04-18" },
  { id: "f7", code: "FRN-D-1007", category: "Desk Lamp", hostel: "Girls Hostel", room: "A-210", block: "A", purchaseDate: "2024-01-20", vendor: "Philips", cost: 1200, condition: "Damaged", status: "Replaced", lastInspected: "2026-06-30", notes: "Replaced under warranty." },
  { id: "f8", code: "FRN-CP-1008", category: "Cupboard", hostel: "Boys Hostel", room: "D-105", block: "D", purchaseDate: "2021-08-14", vendor: "Godrej Interio", cost: 15400, condition: "Fair", status: "In Use", assignedTo: "Neel Deshmukh", lastInspected: "2026-03-11", notes: "Lock stiff." },
  { id: "f9", code: "FRN-B-1009", category: "Bed", hostel: "Girls Hostel", room: "A-101", block: "A", purchaseDate: "2023-06-12", vendor: "Godrej Interio", cost: 9800, condition: "Good", status: "In Use", assignedTo: "Sara Iyer", lastInspected: "2026-06-10" },
  { id: "f10", code: "FRN-T-1010", category: "Study Table", hostel: "Boys Hostel", room: "C-215", block: "C", purchaseDate: "2020-09-01", vendor: "Local Vendor", cost: 3800, condition: "Damaged", status: "Under Maintenance", lastInspected: "2026-07-18", notes: "Drawer detached." },
  { id: "f11", code: "FRN-C-1011", category: "Chair", hostel: "Girls Hostel", room: "A-112", block: "A", purchaseDate: "2024-02-10", vendor: "Nilkamal", cost: 1400, condition: "Good", status: "In Use", assignedTo: "Meera Joshi", lastInspected: "2026-06-05" },
  { id: "f12", code: "FRN-F-1012", category: "Fan", hostel: "Boys Hostel", room: "A-204", block: "A", purchaseDate: "2022-07-05", vendor: "Havells", cost: 2400, condition: "Good", status: "In Use", assignedTo: "Aarav Mehta", lastInspected: "2026-06-10" },
  { id: "f13", code: "FRN-M-1013", category: "Mattress", hostel: "Girls Hostel", room: "B-118", block: "B", purchaseDate: "2021-08-14", vendor: "Kurlon", cost: 5800, condition: "Damaged", status: "Retired", lastInspected: "2026-05-01", notes: "End of life \u2014 awaiting disposal." },
  { id: "f14", code: "FRN-SH-1014", category: "Shelf", hostel: "Boys Hostel", room: "C-302", block: "C", purchaseDate: "2023-11-02", vendor: "Wooden Street", cost: 3200, condition: "Good", status: "In Storage", lastInspected: "2026-01-15" },
  { id: "f15", code: "FRN-CR-1015", category: "Curtain", hostel: "Girls Hostel", room: "A-210", block: "A", purchaseDate: "2024-06-01", vendor: "D'Decor", cost: 1800, condition: "Fair", status: "In Use", assignedTo: "Isha Patel", lastInspected: "2026-06-20" },
  { id: "f16", code: "FRN-W-1016", category: "Wardrobe", hostel: "Boys Hostel", room: "A-204", block: "A", purchaseDate: "2020-09-01", vendor: "Godrej Interio", cost: 12800, condition: "Damaged", status: "Replaced", lastInspected: "2026-07-01", notes: "Replaced with new unit FRN-W-1020." }
];
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
