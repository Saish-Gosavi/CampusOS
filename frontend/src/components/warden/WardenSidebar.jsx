import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  Armchair,
  CalendarDays,
  MessageSquareWarning,
  UserRoundCheck,
  Megaphone,
  BarChart3,
  UserCircle2,
  Settings,
  LogOut,
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
  { title: "Profile", url: "/warden/profile", icon: UserCircle2 },
  { title: "Settings", url: "/warden/settings", icon: Settings }
];
function WardenSidebar() {
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
        active && "bg-white text-primary hover:bg-white hover:text-primary font-semibold shadow-sm"
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
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white backdrop-blur shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!collapsed && <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Edu360</p>
                <p className="truncate text-xs text-slate-400">VPPCOE · Warden Portal</p>
              </div>}
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
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Account</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(account)}</SidebarGroupContent>
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
  WardenSidebar
};
