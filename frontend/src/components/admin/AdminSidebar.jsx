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
  { title: "Audit Logs", url: "/super-admin/audit-logs", icon: ScrollText }
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
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white backdrop-blur shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white tracking-wide">Edu360</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-white/60">Super Admin</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 space-y-4">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Overview</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(mainItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Insights</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(insightItems)}</SidebarGroupContent>
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
                onClick={handleLogout}
                tooltip="Logout"
                className="cursor-pointer text-white/80 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
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
