import {
  PackagePlus,
  PackageCheck,
  ClipboardCheck,
  ArrowRightLeft,
  Truck,
  AlertTriangle,
  Undo2
} from "lucide-react";
const inventoryActivities = [
  { id: "i1", title: "New Item Added", meta: "Dell OptiPlex 7010 \xB7 12 units", time: "8 min ago", icon: PackagePlus, tint: "#2563EB" },
  { id: "i2", title: "Request Approved", meta: "PR-00184 \xB7 Computer Dept", time: "35 min ago", icon: ClipboardCheck, tint: "#22C55E" },
  { id: "i3", title: "Goods Received", meta: "GRN-00092 \xB7 Whiteboard markers", time: "1 hr ago", icon: Truck, tint: "#7B4CED" },
  { id: "i4", title: "Item Borrowed", meta: "Projector \u2192 EXTC Seminar Hall", time: "2 hr ago", icon: ArrowRightLeft, tint: "#EAB308" },
  { id: "i5", title: "Low Stock Alert", meta: "A4 Paper below reorder level", time: "3 hr ago", icon: AlertTriangle, tint: "#EF4444" },
  { id: "i6", title: "Item Returned", meta: "DSLR Camera returned by Media Cell", time: "Yesterday", icon: Undo2, tint: "#3B82F6" },
  { id: "i7", title: "Stock Reconciled", meta: "Chemistry Lab consumables", time: "Yesterday", icon: PackageCheck, tint: "#0D9488" }
];
const inventoryItems = [
  { id: "it1", name: "Dell OptiPlex 7010", category: "Electronics", sku: "SKU-EL-0012", available: 24, minStock: 10, unit: "units", location: "Store A \xB7 Rack 3", status: "In Stock" },
  { id: "it2", name: "Epson EB-X51 Projector", category: "Electronics", sku: "SKU-EL-0031", available: 3, minStock: 5, unit: "units", location: "AV Room", status: "Low Stock" },
  { id: "it3", name: "A4 Paper (500 sheets)", category: "Stationery", sku: "SKU-ST-0104", available: 12, minStock: 40, unit: "reams", location: "Store B \xB7 Rack 1", status: "Low Stock" },
  { id: "it4", name: "Whiteboard Markers", category: "Stationery", sku: "SKU-ST-0201", available: 180, minStock: 60, unit: "pcs", location: "Store B \xB7 Rack 2", status: "In Stock" },
  { id: "it5", name: "Chemistry Beakers (250ml)", category: "Lab Equipment", sku: "SKU-LB-0044", available: 0, minStock: 20, unit: "pcs", location: "Chem Lab", status: "Out of Stock" },
  { id: "it6", name: "Networking Cables (Cat6)", category: "Electronics", sku: "SKU-EL-0088", available: 92, minStock: 30, unit: "m", location: "IT Store", status: "In Stock" },
  { id: "it7", name: "Office Chairs", category: "Furniture", sku: "SKU-FN-0005", available: 8, minStock: 4, unit: "units", location: "Store C", status: "In Stock" },
  { id: "it8", name: "Safety Goggles", category: "Lab Equipment", sku: "SKU-LB-0021", available: 4, minStock: 15, unit: "pcs", location: "Physics Lab", status: "Low Stock" },
  { id: "it9", name: "First Aid Kits", category: "Medical", sku: "SKU-MD-0009", available: 14, minStock: 6, unit: "kits", location: "Infirmary", status: "In Stock" },
  { id: "it10", name: "DSLR Camera (Canon 200D)", category: "Electronics", sku: "SKU-EL-0055", available: 2, minStock: 2, unit: "units", location: "Media Cell", status: "Low Stock" }
];
const procurementRequests = [
  { id: "pr1", requester: "Prof. S. Deshpande", department: "Computer", item: "Ergonomic Keyboards", quantity: 20, raisedOn: "2026-07-18", priority: "Medium", status: "Pending" },
  { id: "pr2", requester: "Ms. R. Kulkarni", department: "EXTC", item: "Soldering Stations", quantity: 6, raisedOn: "2026-07-17", priority: "High", status: "Pending" },
  { id: "pr3", requester: "Prof. A. Nair", department: "Mechanical", item: "Vernier Calipers", quantity: 15, raisedOn: "2026-07-16", priority: "Low", status: "Approved" },
  { id: "pr4", requester: "Dr. P. Iyer", department: "Chemistry", item: "Bunsen Burners", quantity: 10, raisedOn: "2026-07-14", priority: "High", status: "Approved" },
  { id: "pr5", requester: "Mr. K. Verma", department: "Admin", item: "Toner Cartridges HP-107A", quantity: 8, raisedOn: "2026-07-12", priority: "Medium", status: "Fulfilled" },
  { id: "pr6", requester: "Prof. M. Pawar", department: "Civil", item: "Survey Tripods", quantity: 4, raisedOn: "2026-07-10", priority: "Low", status: "Rejected" }
];
const goodsReceipts = [
  { id: "gr1", grn: "GRN-00092", vendor: "Office Stationers Pvt Ltd", item: "Whiteboard Markers", quantity: 240, receivedOn: "2026-07-18", status: "Inspected" },
  { id: "gr2", grn: "GRN-00093", vendor: "TechnoSource India", item: "Networking Cables (Cat6)", quantity: 100, receivedOn: "2026-07-17", status: "Received" },
  { id: "gr3", grn: "GRN-00094", vendor: "SciLab Instruments", item: "Bunsen Burners", quantity: 10, receivedOn: "2026-07-16", status: "Pending Inspection" },
  { id: "gr4", grn: "GRN-00095", vendor: "PrintMart", item: "Toner Cartridges HP-107A", quantity: 8, receivedOn: "2026-07-13", status: "Inspected" }
];
const borrowings = [
  { id: "br1", borrower: "EXTC Seminar Hall", department: "EXTC", item: "Epson EB-X51 Projector", quantity: 1, borrowedOn: "2026-07-18", dueDate: "2026-07-22", status: "Borrowed" },
  { id: "br2", borrower: "Media Cell", department: "Cultural", item: "DSLR Camera (Canon 200D)", quantity: 1, borrowedOn: "2026-07-14", dueDate: "2026-07-18", status: "Returned" },
  { id: "br3", borrower: "Sports Committee", department: "Sports", item: "Wireless Mic Set", quantity: 2, borrowedOn: "2026-07-10", dueDate: "2026-07-16", status: "Overdue" },
  { id: "br4", borrower: "Robotics Club", department: "Computer", item: "Soldering Stations", quantity: 3, borrowedOn: "2026-07-17", dueDate: "2026-07-24", status: "Borrowed" }
];
const stockByCategory = [
  { name: "Electronics", value: 320 },
  { name: "Stationery", value: 480 },
  { name: "Lab Equipment", value: 210 },
  { name: "Furniture", value: 96 },
  { name: "Medical", value: 54 }
];
const monthlyProcurement = [
  { month: "Feb", requested: 42, approved: 34 },
  { month: "Mar", requested: 51, approved: 45 },
  { month: "Apr", requested: 38, approved: 32 },
  { month: "May", requested: 60, approved: 52 },
  { month: "Jun", requested: 55, approved: 48 },
  { month: "Jul", requested: 68, approved: 58 }
];
const departmentSpend = [
  { name: "Computer", value: 285e3 },
  { name: "EXTC", value: 21e4 },
  { name: "Mechanical", value: 178e3 },
  { name: "Civil", value: 134e3 },
  { name: "Chemistry", value: 96e3 },
  { name: "Admin", value: 152e3 }
];
const borrowingTrend = [
  { month: "Feb", borrowed: 22, returned: 20 },
  { month: "Mar", borrowed: 28, returned: 26 },
  { month: "Apr", borrowed: 19, returned: 18 },
  { month: "May", borrowed: 34, returned: 30 },
  { month: "Jun", borrowed: 26, returned: 25 },
  { month: "Jul", borrowed: 31, returned: 27 }
];
export {
  borrowingTrend,
  borrowings,
  departmentSpend,
  goodsReceipts,
  inventoryActivities,
  inventoryItems,
  monthlyProcurement,
  procurementRequests,
  stockByCategory
};
