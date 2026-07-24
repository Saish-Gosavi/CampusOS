import React from "react";
import { cn } from "@/lib/utils";

export function Table({
  headers = [],
  data = [],
  renderRow,
  className,
  emptyMessage = "No records found.",
  ...props
}) {
  return (
    <div className={cn("w-full overflow-auto rounded-xl border border-border bg-card shadow-sm", className)}>
      <table className="w-full caption-bottom text-sm border-collapse" {...props}>
        <thead className="bg-muted/50 border-b border-border">
          <tr className="hover:bg-transparent">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={cn(
                  "h-12 px-6 text-left align-middle font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0",
                  header.className
                )}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0 divide-y divide-border">
          {data.length > 0 ? (
            data.map((item, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-muted/40 transition-colors">
                {renderRow(item, rowIdx)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="h-24 text-center align-middle text-muted-foreground font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
