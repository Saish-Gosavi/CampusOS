import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Star,
  Package,
  UserCircle2,
  LogOut,
  UtensilsCrossed
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
  { title: "Dashboard", url: "/mess", icon: LayoutDashboard, exact: true },
  { title: "Weekly Meal Menu", url: "/mess/menu", icon: Calendar },
  { title: "Student Off-Days", url: "/mess/off-days", icon: Clock },
  { title: "Quality & Ratings", url: "/mess/feedback", icon: Star },
  { title: "Ration Inventory", url: "/mess/inventory", icon: Package }
];

const settingsNav = [
  { title: "Profile & Account", url: "/mess/profile", icon: UserCircle2 }
];

export function MessSidebar() {
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
      <div className="flex h-full flex-col bg-amber-900 text-white">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-amber-700 text-white backdrop-blur shadow-sm">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center min-w-0">
                <p className="truncate text-[20px] font-bold text-white leading-none tracking-normal font-sans">Campus OS</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-amber-200 mt-1.5 font-sans">Mess Manager</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3 space-y-4">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-amber-200/70 mb-1">DINING OPERATIONS</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(overview)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-amber-200/70 mb-1">ACCOUNT</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(settingsNav)}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-colors"
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
