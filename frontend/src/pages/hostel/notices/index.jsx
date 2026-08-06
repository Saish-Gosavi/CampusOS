import React, { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { Search, Megaphone } from "lucide-react";
import { NoticeList } from "@/components/hostel/notices/NoticeList";
import { PostNoticeDialog } from "@/components/hostel/notices/PostNoticeDialog";
import axios from "axios";

const Route = createFileRoute("/hostel-admin/notices")({
  component: NoticeBoardPage
});

const INITIAL_NOTICES = [];

function NoticeBoardPage() {
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const fetchNotices = async () => {
    try {
      // Setup backend API URL correctly in a real app, assuming standard proxy or port
      const res = await axios.get("http://localhost:5000/api/notices", { withCredentials: true });
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load notices:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAddNotice = async (newNotice) => {
    try {
      const res = await axios.post("http://localhost:5000/api/notices", newNotice, { withCredentials: true });
      if (res.data.success) {
        fetchNotices();
      }
    } catch (err) {
      console.error("Failed to post notice:", err);
      // Fallback for local testing if backend fails
      setNotices((prev) => [newNotice, ...prev]);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === "All" || n.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            Notice Board
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Post and manage official hostel notices, alerts, and announcements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PostNoticeDialog onAddNotice={handleAddNotice} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notices by title or content..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary shadow-sm font-medium"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Urgent">Urgent</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Event">Event</option>
          </select>
        </div>
      </div>

      <NoticeList notices={filteredNotices} />
      
    </div>
  );
}

export default NoticeBoardPage;
export { Route };
