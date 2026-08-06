import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Info, Wrench, Calendar } from "lucide-react";

export function NoticeList({ notices }) {
  if (!notices || notices.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card shadow-sm">
        <p className="text-sm text-muted-foreground">No notices found.</p>
        <p className="text-xs text-muted-foreground mt-1">Click "Post New Notice" to create an announcement.</p>
      </div>
    );
  }

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "Urgent":
        return { color: "bg-red-500/15 text-red-700 border-red-200", icon: AlertTriangle };
      case "Maintenance":
        return { color: "bg-amber-500/15 text-amber-700 border-amber-200", icon: Wrench };
      case "Event":
        return { color: "bg-purple-500/15 text-purple-700 border-purple-200", icon: Calendar };
      default:
        return { color: "bg-blue-500/15 text-blue-700 border-blue-200", icon: Info };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notices.map((notice) => {
        const { color, icon: Icon } = getPriorityConfig(notice.priority);
        return (
          <div key={notice.id} className="flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {notice.priority}
                </Badge>
                <div className="flex flex-col items-end text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {notice.date}</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-foreground leading-tight mt-1">{notice.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap flex-1">{notice.content}</p>
            </div>
            <div className="px-5 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground flex items-center justify-between">
              <span>Posted by <strong>{notice.postedBy}</strong></span>
              <span>{notice.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
