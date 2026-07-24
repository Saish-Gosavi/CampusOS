import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} CampusOS · VPPCOE · v1.0.0
    </footer>
  );
}
