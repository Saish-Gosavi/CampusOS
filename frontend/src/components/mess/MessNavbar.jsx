import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  UserCircle2,
  Settings,
  LogOut,
  UtensilsCrossed
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
import { useTheme } from "@/context/ThemeContext";

export function MessNavbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-card/90 px-3 backdrop-blur sm:px-6">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search mess menu, off-day logs, inventory..."
          className="h-9 w-full bg-background pl-9 text-xs"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
        </button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background p-1.5 hover:bg-muted text-left transition-colors">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-primary font-bold text-white text-xs">
                M
              </div>
              <div className="hidden flex-col md:flex text-xs">
                <span className="font-semibold leading-none text-foreground">{user?.name || "Mess Manager"}</span>
                <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">{user?.email || "mess@campus.os"}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">
              <p className="font-semibold text-foreground">{user?.name || "Mess Manager"}</p>
              <p className="text-[10px] font-normal text-muted-foreground">{user?.email || "mess@campus.os"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/mess/profile")} className="cursor-pointer text-xs">
              <UserCircle2 className="mr-2 h-3.5 w-3.5" /> Profile & Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="cursor-pointer text-xs text-red-600 focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
