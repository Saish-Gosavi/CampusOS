import { Link, useLocation, useNavigate } from "react-router-dom";
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
  BarChart3, LogOut
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

function LibrarySidebar() {
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
      <div className="flex h-full flex-col bg-primary text-white">
        <SidebarHeader className="border-b border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-white/10 text-white backdrop-blur shadow-sm">
              <Library className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col justify-center min-w-0">
                <p className="truncate text-[20px] font-bold text-white leading-none tracking-normal font-sans">Campus OS</p>
                <p className="truncate text-[11px] font-medium uppercase tracking-[0.15em] text-[#BDB5D2] mt-1.5 font-sans">Librarian</p>
              </div>
            )}
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
    </Sidebar>
  );
}

export { LibrarySidebar };
