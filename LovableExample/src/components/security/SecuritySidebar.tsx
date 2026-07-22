import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  DoorOpen,
  QrCode,
  UserRoundCheck,
  Ticket,
  ShieldAlert,
  ClipboardList,
  Megaphone,
  UserCircle2,
  Settings,
  LogOut,
  ShieldCheck,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const overview = [
  { title: "Dashboard", url: "/security", icon: LayoutDashboard, exact: true },
  { title: "Student In/Out", url: "/security/in-out", icon: DoorOpen },
  { title: "QR Code Scanner", url: "/security/qr-scanner", icon: QrCode },
];

const ops = [
  { title: "Visitors", url: "/security/visitors", icon: UserRoundCheck },
  { title: "Gate Pass", url: "/security/gate-pass", icon: Ticket },
  { title: "Incidents", url: "/security/incidents", icon: ShieldAlert },
  { title: "Daily Logs", url: "/security/logs", icon: ClipboardList },
  { title: "Notices", url: "/security/notices", icon: Megaphone },
];

const account = [
  { title: "Profile", url: "/security/profile", icon: UserCircle2 },
  { title: "Settings", url: "/security/settings", icon: Settings },
];

export function SecuritySidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const renderMenu = (items: typeof overview) => (
    <SidebarMenu>
      {items.map((item) => {
        const active = isActive(item.url, (item as any).exact);
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={cn(
                "text-slate-300 hover:bg-white/10 hover:text-white data-[active=true]:bg-[#2563EB] data-[active=true]:text-white",
                active && "bg-[#2563EB] text-white hover:bg-[#1e4fd1] hover:text-white",
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
      <div className="flex h-full flex-col bg-slate-900 text-slate-100">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1e40af] text-white shadow-md">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">CampusOS</p>
                <p className="truncate text-xs text-slate-400">VPPCOE · Security Portal</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-1">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Overview</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(overview)}</SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Operations</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(ops)}</SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Account</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(account)}</SidebarGroupContent>
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
    </Sidebar>
  );
}
