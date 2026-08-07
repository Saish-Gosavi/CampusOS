import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  UserCircle2,
  Settings,
  LogOut,
  MessageSquareWarning,
  IndianRupee,
  Megaphone
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

const notifications = [
  { icon: MessageSquareWarning, tint: "#EF4444", title: "High-priority complaint", meta: "Block B \xB7 118 \u2014 2 min ago" },
  { icon: IndianRupee, tint: "#22C55E", title: "Fee payment received", meta: "\u20B942,000 \u2014 Kabir Verma" },
  { icon: Megaphone, tint: "#EAB308", title: "Notice queued for review", meta: "Room inspection schedule" }
];
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("campusos-theme") : null;
    const dark = stored ? stored === "dark" : false;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);
  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("campusos-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { isDark, toggle };
}
function HostelNavbar() {
  const { isDark, toggle } = useDarkMode();
  const { logout } = useAuth();
  const location = useLocation();

  const getSearchPlaceholder = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/students") || path.includes("/student")) return "Search students, ID...";
    if (path.includes("/room")) return "Search rooms, blocks...";
    if (path.includes("/occupancy")) return "Search occupancy...";
    if (path.includes("/furniture")) return "Search furniture, status...";
    if (path.includes("/leaves") || path.includes("/leave")) return "Search leave requests...";
    if (path.includes("/complaints") || path.includes("/complaint")) return "Search complaints...";
    if (path.includes("/visitors") || path.includes("/visitor")) return "Search visitors...";
    if (path.includes("/notices") || path.includes("/notice")) return "Search notices...";
    if (path.includes("/reports") || path.includes("/report")) return "Search reports...";
    if (path.includes("/fee") || path.includes("/payment")) return "Search fees, invoices...";
    if (path.includes("/staff")) return "Search staff, roles...";
    if (path.includes("/block")) return "Search blocks...";
    return "Search dashboard...";
  };

  return <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-card/90 px-3 backdrop-blur sm:px-6">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
    placeholder={getSearchPlaceholder()}
    className="h-10 rounded-lg border-border bg-muted/40 pl-9 focus-visible:ring-primary"
  />
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-1 md:flex-none">
        <button
    onClick={toggle}
    aria-label="Toggle theme"
    className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
    aria-label="Notifications"
    className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-card" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                3 new
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => <DropdownMenuItem key={n.title} className="gap-3 py-3">
                <span
    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
    style={{ backgroundColor: `${n.tint}1A`, color: n.tint }}
  >
                  <n.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.meta}</p>
                </div>
              </DropdownMenuItem>)}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm font-medium text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-muted">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                HA
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold text-foreground">Hostel Admin</span>
                <span className="block text-xs text-muted-foreground">hostel@vppcoe.edu</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/hostel-admin/profile">
                <UserCircle2 className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/hostel-admin/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={logout} 
              className="text-[#EF4444] focus:text-[#EF4444] cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
}
export {
  HostelNavbar
};
