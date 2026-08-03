import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
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
  { title: "Dashboard", url: "/security", icon: LayoutDashboard, exact: true },
  { title: "Student In/Out", url: "/security/in-out", icon: DoorOpen },
  { title: "QR Code Scanner", url: "/security/qr-scanner", icon: QrCode }
];
const ops = [
  { title: "Visitors", url: "/security/visitors", icon: UserRoundCheck },
  { title: "Gate Pass", url: "/security/gate-pass", icon: Ticket },
  { title: "Incidents", url: "/security/incidents", icon: ShieldAlert },
  { title: "Daily Logs", url: "/security/logs", icon: ClipboardList },
  { title: "Notices", url: "/security/notices", icon: Megaphone }
];
const account = [
  { title: "Profile", url: "/security/profile", icon: UserCircle2 },
  { title: "Settings", url: "/security/settings", icon: Settings }
];
function SecuritySidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const allItems = [...overview, ...ops, ...account];
  const hasExactMatch = allItems.some((item) => item.url === pathname);

  const isActive = (url) => {
    if (hasExactMatch) {
      return pathname === url;
    }
    if (!pathname.startsWith(url + "/")) return false;
    const matchingUrls = allItems
      .map((i) => i.url)
      .filter((u) => pathname === u || pathname.startsWith(u + "/"));
    const longestMatch = matchingUrls.reduce((a, b) => (a.length >= b.length ? a : b), "");
    return url === longestMatch;
  };

  const renderMenu = (items) => <SidebarMenu>
      {items.map((item) => {
    const active = isActive(item.url);
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
    </SidebarMenu>
  );
  return <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-full flex-col bg-primary text-white">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white/10 text-white backdrop-blur shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center min-w-0">
                <p className="truncate text-[20px] font-bold text-white leading-none tracking-normal font-sans">Campus OS</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-[#BDB5D2] mt-1.5 font-sans">Security</p>
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
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Account</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(account)}</SidebarGroupContent>
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
    </Sidebar>;
}
export {
  SecuritySidebar
};
