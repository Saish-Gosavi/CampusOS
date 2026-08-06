import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  Armchair,
  CalendarDays,
  MessageSquareWarning,
  UserRoundCheck,
  Megaphone,
  BarChart3, LogOut,
  ShieldCheck
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
const overview = [
  { title: "Dashboard", url: "/warden", icon: LayoutDashboard, exact: true },
  { title: "Students", url: "/warden/students", icon: Users },
  { title: "Room Occupancy", url: "/warden/occupancy", icon: BedDouble },
  { title: "Furniture", url: "/warden/furniture", icon: Armchair }
];
const ops = [
  { title: "Leave Requests", url: "/warden/leaves", icon: CalendarDays },
  { title: "Complaints", url: "/warden/complaints", icon: MessageSquareWarning },
  { title: "Visitors", url: "/warden/visitors", icon: UserRoundCheck },
  { title: "Notice Board", url: "/warden/notices", icon: Megaphone },
  { title: "Reports", url: "/warden/reports", icon: BarChart3 }
];
const account = [
  
  
];
function WardenSidebar() {
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
              <ShieldCheck className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center min-w-0">
                <p className="truncate text-[20px] font-bold text-white leading-none tracking-normal font-sans">Campus OS</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-[#BDB5D2] mt-1.5 font-sans">Warden</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 space-y-4">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Overview</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(overview)}</SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Operations</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(ops)}</SidebarGroupContent>
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
  WardenSidebar
};
