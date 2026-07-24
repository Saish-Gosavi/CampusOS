import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumb({ className, ...props }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6 flex items-center text-xs font-medium text-muted-foreground", className)} {...props}>
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-foreground">
            <Home className="mr-2 h-3.5 w-3.5" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayValue = value
            .replace(/-/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());

          // Skip routing variables like ID parameters in the display label
          if (value.startsWith("$") || /^[0-9a-fA-F-]+$/.test(value) || /^\d+$/.test(value)) {
            return null;
          }

          return (
            <li key={to} className="inline-flex items-center">
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 mx-1" />
              {isLast ? (
                <span className="text-foreground font-semibold" aria-current="page">
                  {displayValue}
                </span>
              ) : (
                <Link to={to} className="hover:text-foreground">
                  {displayValue}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
