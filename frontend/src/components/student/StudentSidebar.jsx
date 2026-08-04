import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BedDouble,
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
  FileText, LogOut,
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
  { title: "Dashboard", url: "/student", icon: LayoutDashboard, exact: true }];
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

function StudentSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url, exact) => exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");
  const renderMenu = (items) => <SidebarMenu>
      {items.map((item) => {
    const active = isActive(item.url, item.exact);
    return <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
      asChild
      tooltip={item.title}
              className={cn(
                "text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-200","dark:text-[#9999bb] dark:hover:bg-[#252545] dark:hover:text-[#e8e8f0]",
                active && "bg-white text-primary hover:bg-white hover:text-primary font-semibold shadow-sm",active && "dark:bg-[#7c5cfc] dark:text-white dark:hover:bg-[#6a48f0] dark:hover:text-white"
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
      <div className="flex h-full flex-col bg-primary dark:bg-[#1a1a2e] text-white dark:border-r dark:border-[#2e2e50]">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white/10 text-white backdrop-blur shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center min-w-0">
                <p className="truncate text-[20px] font-bold text-white leading-none tracking-normal font-sans">Campus OS</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-[#BDB5D2] mt-1.5 font-sans">Student</p>
              </div>
            )}
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

          
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="cursor-pointer text-white/70 hover:bg-white/10 hover:text-white dark:text-[#9999bb] dark:hover:bg-[#252545] dark:hover:text-[#e8e8f0] transition-colors duration-200 mt-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
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
