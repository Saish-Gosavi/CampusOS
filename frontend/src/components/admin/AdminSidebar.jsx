import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  BarChart3,
  Megaphone,
  ScrollText,
  Activity,
  Settings,
  UserCircle2,
  LogOut,
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
  { title: "Dashboard", url: "/super-admin", exact: true, icon: LayoutDashboard },
  { title: "Colleges", url: "/super-admin/colleges", icon: Building2 },
  { title: "Admins", url: "/super-admin/admins", icon: Users }
];

const insightItems = [
  { title: "Reports", url: "/super-admin/reports", icon: BarChart3 },
  { title: "Global Notices", url: "/super-admin/notices", icon: Megaphone },
  { title: "Audit Logs", url: "/super-admin/audit-logs", icon: ScrollText },
  { title: "System Health", url: "/super-admin/system-health", icon: Activity }
];

const accountItems = [
  { title: "Settings", url: "/super-admin/settings", icon: Settings },
  { title: "Profile", url: "/super-admin/profile", icon: UserCircle2 }
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url, exact) => exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

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
                "text-slate-300 hover:bg-white/10 hover:text-white data-[active=true]:bg-[#2563EB] data-[active=true]:text-white",
                active && "bg-[#2563EB] text-white hover:bg-[#1e4fd1] hover:text-white"
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
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">CampusOS</p>
                <p className="truncate text-xs text-slate-400">Global Portal · Super Admin</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-1">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Overview</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(mainItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-slate-500">Insights</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(insightItems)}</SidebarGroupContent>
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
                onClick={handleLogout}
                tooltip="Logout"
                className="cursor-pointer text-slate-300 hover:bg-white/10 hover:text-white"
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

export { AdminSidebar };
