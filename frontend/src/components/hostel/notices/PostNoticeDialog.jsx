import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Megaphone, Send } from "lucide-react";

export function PostNoticeDialog({ onAddNotice }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "General",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const now = new Date();
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = now.toLocaleDateString('en-US', dateOptions);
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onAddNotice({
      id: Math.random().toString(36).substr(2, 9),
      date,
      time,
      postedBy: "System Admin",
      ...form,
    });
    
    setForm({ title: "", content: "", priority: "General" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" />
          Post New Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border bg-card shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Create Official Notice
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notice Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Water Supply Interruption"
              required
              value={form.title}
              onChange={handleChange}
              className="rounded-lg border-border bg-background h-10 font-medium"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="priority" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Priority / Category
            </Label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary font-medium"
            >
              <option value="General">General Information</option>
              <option value="Urgent">Urgent / Alert</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Event">Event / Activity</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notice Content
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Enter the full details of the notice here..."
              required
              value={form.content}
              onChange={handleChange}
              className="rounded-lg border-border bg-background min-h-[120px] resize-none"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-xl h-11 font-bold shadow-md transition hover:opacity-90 mt-2"
          >
            <Send className="mr-2 h-4 w-4" />
            Publish Notice
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
