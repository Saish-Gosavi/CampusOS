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

export function StudentTable({ students }) {
  if (!students || students.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card shadow-sm">
        <p className="text-sm text-muted-foreground">No student records found.</p>
        <p className="text-xs text-muted-foreground mt-1">Click "Add Student" to create a new record.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Name</TableHead>
            <TableHead className="font-semibold text-foreground">Enrollment ID</TableHead>
            <TableHead className="font-semibold text-foreground">Contact</TableHead>
            <TableHead className="font-semibold text-foreground">Room Allocation</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-foreground">{student.name}</div>
                  {student.documentCount > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1 h-5 px-1.5 bg-muted/30 text-xs font-normal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                      {student.documentCount}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{student.enrollmentId}</TableCell>
              <TableCell>
                <div className="text-sm">{student.email}</div>
                <div className="text-xs text-muted-foreground">{student.phone}</div>
              </TableCell>
              <TableCell>
                {student.room ? (
                  <Badge variant="outline" className="font-medium bg-background">
                    {student.room}
                  </Badge>
                ) : (
                  <span className="text-xs italic text-muted-foreground">Unallocated</span>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  className={
                    student.status === "Active" 
                      ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25" 
                      : "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25"
                  }
                >
                  {student.status || "Active"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
