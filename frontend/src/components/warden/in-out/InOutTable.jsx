import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function InOutTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card shadow-sm">
        <p className="text-sm text-muted-foreground">No register logs found.</p>
        <p className="text-xs text-muted-foreground mt-1">Click "New Log Entry" to record an entry or exit.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Timestamp</TableHead>
            <TableHead className="font-semibold text-foreground">Direction</TableHead>
            <TableHead className="font-semibold text-foreground">Name & Type</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Logged By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <div className="text-sm font-medium text-foreground">{log.time}</div>
                <div className="text-xs text-muted-foreground">{log.date}</div>
              </TableCell>
              <TableCell>
                <Badge 
                  className={
                    log.direction === "IN" 
                      ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200" 
                      : "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-200"
                  }
                  variant="outline"
                >
                  {log.direction}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium text-foreground">{log.name}</div>
                <div className="text-xs text-muted-foreground">{log.userType}</div>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {log.loggedBy}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
