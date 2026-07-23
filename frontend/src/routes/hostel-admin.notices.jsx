import { createFileRoute, Outlet } from "@tanstack/react-router";
const Route = createFileRoute("/hostel-admin/notices")({
  component: () => <Outlet />
});
export {
  Route
};
