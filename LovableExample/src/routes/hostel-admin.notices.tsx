import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hostel-admin/notices")({
  component: () => <Outlet />,
});
