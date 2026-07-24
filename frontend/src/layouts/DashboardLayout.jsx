import React from "react";
import { BaseDashboardLayout } from "@/components/layout/BaseDashboardLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout() {
  return (
    <BaseDashboardLayout
      Sidebar={Sidebar}
      Navbar={Navbar}
    />
  );
}

export const Route = {
  component: DashboardLayout
};
