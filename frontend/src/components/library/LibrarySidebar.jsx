import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  BookUp,
  BookDown,
  BookMarked,
  Inbox,
  IndianRupee,
  Gift,
  BarChart3,
  Settings,
  UserCircle2,
  LogOut
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
const catalogItems = [
  { title: "Dashboard", url: "/library-admin", icon: LayoutDashboard, exact: true },
  { title: "Book Management", url: "/library-admin/books", icon: BookOpen },
  { title: "Book Copies", url: "/library-admin/copies", icon: Library }
];
const circulationItems = [
  { title: "Issue Books", url: "/library-admin/issue", icon: BookUp },
  { title: "Return Books", url: "/library-admin/return", icon: BookDown },
  { title: "Reservations", url: "/library-admin/reservations", icon: BookMarked },
  { title: "Book Requests", url: "/library-admin/requests", icon: Inbox }
];
const opsItems = [
  { title: "Fine Management", url: "/library-admin/fines", icon: IndianRupee },
  { title: "Donations", url: "/library-admin/donations", icon: Gift },
  { title: "Reports", url: "/library-admin/reports", icon: BarChart3 }
];
const accountItems = [
  { title: "Profile", url: "/library-admin/profile", icon: UserCircle2 },
  { title: "Settings", url: "/library-admin/settings", icon: Settings }
];
function LibrarySidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

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
        "text-slate-300 hover:bg-white/10 hover:text-white data-[active=true]:bg-[#0D9488] data-[active=true]:text-white",
        active && "bg-[#0D9488] text-white hover:bg-[#0b7d72] hover:text-white"
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
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#0D9488] to-[#0f766e] text-white shadow-md">
              <Library className="h-5 w-5" />
            </div>
            {!collapsed && <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Campus OS</p>
                <p className="truncate text-xs text-slate-400">VPPCOE · Library Admin</p>
              </div>}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 space-y-4">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Catalog</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(catalogItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Circulation</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(circulationItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Operations</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(opsItems)}</SidebarGroupContent>
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
  LibrarySidebar
};
