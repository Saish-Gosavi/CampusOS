import { GraduationCap, BookOpen, Building2, Boxes, ShieldCheck } from "lucide-react";
const APP_NAME = "CampusOS";
const COLLEGE_NAME = "VPPCOE";
const VERSION = "v1.0.0";
function AuthLayout({ children, title, subtitle }) {
  return <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
        {
    /* Left – brand panel */
  }
        <aside
    className="relative hidden overflow-hidden text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12"
    style={{
      backgroundImage: "linear-gradient(135deg, var(--brand-gradient-from) 0%, var(--brand-gradient-to) 100%)"
    }}
  >
          <div className="relative z-10 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">{APP_NAME}</p>
              <p className="text-xs text-primary-foreground/70">{COLLEGE_NAME} · Management Portal</p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Welcome back to your campus.
            </h2>
            <p className="max-w-md text-primary-foreground/80">
              A single sign-on for Hostel, Library, and Inventory management —
              built for staff, faculty, and students.
            </p>

            <ul className="grid max-w-md gap-3 pt-2">
              {[
    { icon: Building2, label: "Hostel Management", tint: "#7B4CED" },
    { icon: BookOpen, label: "Library Management", tint: "#3B82F6" },
    { icon: Boxes, label: "Inventory Management", tint: "#22C55E" },
    { icon: ShieldCheck, label: "Role-based secure access", tint: "#EAB308" }
  ].map(({ icon: Icon, label, tint }) => <li key={label} className="flex items-center gap-3 text-sm">
                  <span
    className="grid h-9 w-9 place-items-center rounded-lg"
    style={{ backgroundColor: `${tint}26`, color: tint }}
  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-primary-foreground/90">{label}</span>
                </li>)}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-primary-foreground/60">
            © {(/* @__PURE__ */ new Date()).getFullYear()} {APP_NAME} · {COLLEGE_NAME} · {VERSION}
          </p>

          {
    /* decorative blobs */
  }
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </aside>

        {
    /* Right – form panel */
  }
        <main className="flex flex-col">
          {
    /* Mobile brand header */
  }
          <header className="flex items-center gap-3 border-b border-border p-6 lg:hidden">
            <div
    className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground"
    style={{
      backgroundImage: "linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))"
    }}
  >
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">{COLLEGE_NAME} · Management Portal</p>
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              {(title || subtitle) && <div className="mb-8 space-y-2 text-center sm:text-left">
                  {title && <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {title}
                    </h1>}
                  {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>}
              {children}
            </div>
          </div>

          <footer className="border-t border-border p-6 text-center text-xs text-muted-foreground lg:hidden">
            © {(/* @__PURE__ */ new Date()).getFullYear()} {APP_NAME} · {COLLEGE_NAME} · {VERSION}
          </footer>
        </main>
      </div>
    </div>;
}
export {
  AuthLayout
};
