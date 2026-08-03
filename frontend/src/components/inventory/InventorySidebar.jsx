import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ClipboardCheck,
  Truck,
  Boxes,
  ArrowRightLeft,
  BarChart3,
  Settings,
  UserCircle2,
  LogOut,
  Warehouse
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
  { title: "Dashboard", url: "/inventory-admin", icon: LayoutDashboard, exact: true },
  { title: "Inventory Items", url: "/inventory-admin/items", icon: Package },
  { title: "Stock Management", url: "/inventory-admin/stock", icon: Boxes }
];
const procurementItems = [
  { title: "Procurement Requests", url: "/inventory-admin/requests", icon: ClipboardList },
  { title: "Approvals", url: "/inventory-admin/approvals", icon: ClipboardCheck },
  { title: "Goods Receipt", url: "/inventory-admin/receipts", icon: Truck }
];
const opsItems = [
  { title: "Borrow & Return", url: "/inventory-admin/borrowing", icon: ArrowRightLeft },
  { title: "Reports", url: "/inventory-admin/reports", icon: BarChart3 }
];
const accountItems = [
  { title: "Profile", url: "/inventory-admin/profile", icon: UserCircle2 },
  { title: "Settings", url: "/inventory-admin/settings", icon: Settings }
];
function InventorySidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const allItems = [...mainItems, ...procurementItems, ...opsItems, ...accountItems];
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
              <Warehouse className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center min-w-0">
                <p className="truncate text-[20px] font-bold text-white leading-none tracking-normal font-sans">Campus OS</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-[#BDB5D2] mt-1.5 font-sans">Inventory</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4 space-y-4">
          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Inventory</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(mainItems)}</SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && <SidebarGroupLabel className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">Procurement</SidebarGroupLabel>}
            <SidebarGroupContent>{renderMenu(procurementItems)}</SidebarGroupContent>
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
  InventorySidebar
};
