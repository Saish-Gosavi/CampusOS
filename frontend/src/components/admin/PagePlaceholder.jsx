import { Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
function PagePlaceholder({ title, description, icon: Icon, tint, breadcrumbs }) {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-3 flex items-center gap-3">
          <span
    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
    style={{ backgroundColor: `${tint}1A`, color: tint }}
  >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
        <div className="max-w-md">
          <span
    className="mx-auto grid h-14 w-14 place-items-center rounded-2xl"
    style={{ backgroundColor: `${tint}1A`, color: tint }}
  >
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Coming soon</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This module's UI shell is ready. Wire it to your backend to unlock full functionality — the interface will
            grow with your data.
          </p>
          <button
    className="mt-5 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
    style={{ backgroundColor: tint }}
  >
            Configure module
          </button>
        </div>
      </div>
    </div>;
}
export {
  PagePlaceholder
};
