import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
const Route = createFileRoute("/403")({
  head: () => ({
    meta: [
      { title: "Access denied \u2014 CampusOS" },
      { name: "robots", content: "noindex" }
    ]
  }),
  component: UnauthorizedPage
});
function UnauthorizedPage() {
  return <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-foreground">403</h1>
        <p className="mt-2 text-lg font-semibold text-foreground">Access denied</p>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t have permission to view this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <Link
    to="/login"
    className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
  >
          Back to sign in
        </Link>
      </div>
    </div>;
}
export {
  Route
};
