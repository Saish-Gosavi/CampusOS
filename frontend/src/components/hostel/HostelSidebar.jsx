import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  UserCheck,
  FileText,
  Users,
  UserCog,
  IndianRupee,
  CalendarDays,
  UserRoundCheck,
  DoorOpen,
  MessageSquareWarning,
  Megaphone,
  BarChart3, LogOut,
  GraduationCap
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
import { useAuth } from "@/context/AuthContext";

const mainItems = [
  { title: "Dashboard", url: "/hostel-admin", icon: LayoutDashboard, exact: true },
  { title: "Hostel", url: "/hostel-admin/hostels", icon: Building2 },
  { title: "New Admission Approval", url: "/hostel-admin/admission-approval", icon: UserCheck },
  { title: "Room Allocation Letter", url: "/hostel-admin/allocation-letter", icon: FileText },
  { title: "Student Management", url: "/hostel-admin/students", icon: Users },
  { title: "Staff Management", url: "/hostel-admin/staff", icon: UserCog }
];

const opsItems = [
  { title: "Fees Management", url: "/hostel-admin/fees", icon: IndianRupee },
  { title: "Leave Management", url: "/hostel-admin/leaves", icon: CalendarDays },
  { title: "Visitor Management", url: "/hostel-admin/visitors", icon: UserRoundCheck },
  { title: "In Out Register", url: "/hostel-admin/in-out", icon: DoorOpen },
  { title: "Complaints", url: "/hostel-admin/complaints", icon: MessageSquareWarning },
  { title: "Notice Board", url: "/hostel-admin/notices", icon: Megaphone },
  { title: "Reports", url: "/hostel-admin/reports", icon: BarChart3 }
];



function HostelSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = location.pathname;
  const isActive = (url, exact) => (exact ? pathname === url : pathname === url || pathname.startsWith(url + "/"));

  const renderMenu = (items) => (
    <SidebarMenu>
      {items.map((item) => {
        const active = isActive(item.url, item.exact);
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={cn(
                "text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200",
                active && "bg-white text-primary hover:bg-white hover:text-primary font-semibold shadow-sm"
              )}
            >
              <Link to={item.url}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-full flex-col bg-primary text-white">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white/10 text-white backdrop-blur shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center min-w-0">
                <p className="truncate text-[20px] font-bold text-white leading-none tracking-normal font-sans">Campus OS</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-[#BDB5D2] mt-1.5 font-sans">Hostel Admin</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 space-y-4">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">
                Overview
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>{renderMenu(mainItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">
                Operations
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>{renderMenu(opsItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">
                Account
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>{renderMenu(accountItems)}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="cursor-pointer text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200 mt-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}

export { HostelSidebar };
