import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UserCircle2,
  BedDouble,
  CalendarDays,
  MessageSquareWarning,
  UserRoundCheck,
  IndianRupee,
  Armchair,
  Megaphone,
  BookOpen,
  BookUp,
  BookMarked,
  History,
  Bell,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  Search,
  Library
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const overviewItems = [
  { title: "Dashboard", url: "/student", icon: LayoutDashboard, exact: true },
  { title: "My Profile", url: "/student/profile", icon: UserCircle2 }
];
const hostelItems = [
  { title: "My Room", url: "/student/room", icon: BedDouble },
  { title: "Leave Application", url: "/student/leaves", icon: CalendarDays },
  { title: "Complaints", url: "/student/complaints", icon: MessageSquareWarning },
  { title: "Visitor Requests", url: "/student/visitors", icon: UserRoundCheck },
  { title: "Hostel Fees", url: "/student/fees", icon: IndianRupee },
  { title: "My Furniture", url: "/student/furniture", icon: Armchair },
  { title: "Hostel Notices", url: "/student/hostel-notices", icon: Megaphone }
];
const libraryItems = [
  { title: "Search Books", url: "/student/books", icon: Search },
  { title: "My Borrowed", url: "/student/borrowed", icon: BookOpen },
  { title: "Reserve Books", url: "/student/reserve", icon: BookMarked },
  { title: "Borrow History", url: "/student/borrow-history", icon: History },
  { title: "Fines & Payments", url: "/student/library-fines", icon: IndianRupee },
  { title: "Library Notices", url: "/student/library-notices", icon: BookUp }
];
const accountItems = [
  { title: "Notifications", url: "/student/notifications", icon: Bell },
  { title: "Documents", url: "/student/documents", icon: FileText },
  { title: "Settings", url: "/student/settings", icon: Settings }
];
function StudentSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url, exact) => exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");
  const renderMenu = (items) => <SidebarMenu>
      {items.map((item) => {
    const active = isActive(item.url, item.exact);
    return <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
      asChild
      tooltip={item.title}
      className={cn(
        "text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200",
        active && "bg-[#2563EB] text-white hover:bg-[#1d4fd8] hover:text-white"
      )}
    >
              <Link to={item.url}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>;
  })}
    </SidebarMenu>;
  return <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-full flex-col bg-primary text-white">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Edu360</p>
                <p className="truncate text-xs text-slate-400">VPPCOE · Student Portal</p>
              </div>}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 space-y-4">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Overview</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(overviewItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="flex items-center gap-1.5 text-slate-500">
                <BedDouble className="h-3 w-3" /> Hostel Services
              </SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(hostelItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="flex items-center gap-1.5 text-slate-500">
                <Library className="h-3 w-3" /> Library Services
              </SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(libraryItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Account</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(accountItems)}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
    asChild
    tooltip="Logout"
    className="cursor-pointer text-white/80 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
  >
                <Link to="/login">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>;
}
export {
  StudentSidebar
};
