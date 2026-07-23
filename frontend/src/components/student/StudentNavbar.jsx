import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  UserCircle2,
  Settings,
  LogOut,
  CalendarDays,
  BookOpen,
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
import { studentProfile } from "@/lib/student-data";
const notifications = [
  { icon: CalendarDays, tint: "#F97316", title: "Leave request pending", meta: "Home Visit \xB7 24\u201327 Jul" },
  { icon: BookOpen, tint: "#2563EB", title: "Book due in 2 days", meta: "Atomic Habits \xB7 due 28 Jul" },
  { icon: Megaphone, tint: "#0EA5E9", title: "Fire safety drill", meta: "Wednesday, 6 PM \xB7 Assembly Point" }
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
function StudentNavbar() {
  const { isDark, toggle } = useDarkMode();
  return <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-card/90 px-3 backdrop-blur sm:px-6">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
    placeholder="Search books, notices, complaints..."
    className="h-10 rounded-lg border-border bg-muted/40 pl-9 focus-visible:ring-[#2563EB]"
  />
      </div>

      <div className="flex flex-1 items-center justify-end gap-1 md:flex-none">
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
              <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-xs font-medium text-[#2563EB]">3 new</span>
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
            <DropdownMenuItem asChild className="justify-center text-sm font-medium text-[#2563EB]">
              <Link to="/student/notifications">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-muted">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-sm font-semibold text-white">
                {studentProfile.photo}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold text-foreground">{studentProfile.name}</span>
                <span className="block text-xs text-muted-foreground">{studentProfile.enrollment}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/student/profile">
                <UserCircle2 className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/student/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-[#EF4444] focus:text-[#EF4444]">
              <Link to="/login">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
}
export {
  StudentNavbar
};
