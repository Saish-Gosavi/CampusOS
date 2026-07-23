import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
function HostelBreadcrumbs({ items }) {
  return <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link
    to="/hostel-admin"
    className="grid h-7 w-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"
  >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => <div key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.to ? <Link to={item.to} className="rounded px-1.5 py-0.5 hover:bg-muted hover:text-foreground">
              {item.label}
            </Link> : <span className="px-1.5 py-0.5 font-medium text-foreground">{item.label}</span>}
        </div>)}
    </nav>;
}
export {
  HostelBreadcrumbs
};
