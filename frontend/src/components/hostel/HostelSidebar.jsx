import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  DoorClosed,
  BedDouble,
  UserCog,
  IndianRupee,
  MessageSquareWarning,
  Megaphone,
  BarChart3,
  Settings,
  UserCircle2,
  LogOut,
  Building2,
  Blocks,
  Layers,
  CalendarDays,
  UserRoundCheck,
  DoorOpen,
  Armchair
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
const mainItems = [
  { title: "Dashboard", url: "/hostel-admin", icon: LayoutDashboard, exact: true },
  { title: "Hostel Management", url: "/hostel-admin/hostels", icon: Building2 },
  { title: "Block Management", url: "/hostel-admin/blocks", icon: Blocks },
  { title: "Floor Management", url: "/hostel-admin/floors", icon: Layers },
  { title: "Student Management", url: "/hostel-admin/students", icon: Users },
  { title: "Room Management", url: "/hostel-admin/rooms", icon: DoorClosed },
  { title: "Bed Management", url: "/hostel-admin/beds", icon: BedDouble },
  { title: "Room Allocation", url: "/hostel-admin/allocation", icon: BedDouble },
  { title: "Staff Management", url: "/hostel-admin/staff", icon: UserCog }
];
const opsItems = [
  { title: "Fee Management", url: "/hostel-admin/fees", icon: IndianRupee },
  { title: "Leave Management", url: "/hostel-admin/leaves", icon: CalendarDays },
  { title: "Visitor Management", url: "/hostel-admin/visitors", icon: UserRoundCheck },
  { title: "In-Out Register", url: "/hostel-admin/in-out", icon: DoorOpen },
  { title: "Furniture", url: "/hostel-admin/furniture", icon: Armchair },
  { title: "Complaints", url: "/hostel-admin/complaints", icon: MessageSquareWarning },
  { title: "Notice Board", url: "/hostel-admin/notices", icon: Megaphone },
  { title: "Reports", url: "/hostel-admin/reports", icon: BarChart3 }
];
const accountItems = [
  { title: "Profile", url: "/hostel-admin/profile", icon: UserCircle2 },
  { title: "Settings", url: "/hostel-admin/settings", icon: Settings }
];
function HostelSidebar() {
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
        "text-slate-300 hover:bg-white/10 hover:text-white data-[active=true]:bg-[#2563EB] data-[active=true]:text-white",
        active && "bg-[#2563EB] text-white hover:bg-[#1e4fd1] hover:text-white"
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
      <div className="flex h-full flex-col bg-slate-900 text-slate-100">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1e40af] text-white shadow-md">
              <Building2 className="h-5 w-5" />
            </div>
            {!collapsed && <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">CampusOS</p>
                <p className="truncate text-xs text-slate-400">VPPCOE · Hostel Admin</p>
              </div>}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-1">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Overview</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(mainItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Operations</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(opsItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Account</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(accountItems)}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
    asChild
    tooltip="Logout"
    className="text-slate-300 hover:bg-white/10 hover:text-white"
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
  HostelSidebar
};
