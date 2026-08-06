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
import { Plus, Save, Clock, ArrowRightLeft } from "lucide-react";

export function NewLogDialog({ onAddLog }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    userType: "Student",
    direction: "OUT",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString();

    onAddLog({
      id: Math.random().toString(36).substr(2, 9),
      time,
      date,
      loggedBy: "System Admin",
      ...form,
    });
    
    setForm({ name: "", userType: "Student", direction: "OUT", reason: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" />
          New Log Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border bg-card shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Record Entry / Exit
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="userType" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Person Type
              </Label>
              <select
                id="userType"
                name="userType"
                value={form.userType}
                onChange={handleChange}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="direction" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Direction
              </Label>
              <select
                id="direction"
                name="direction"
                value={form.direction}
                onChange={handleChange}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary font-semibold"
              >
                <option value="OUT">OUT (Exit)</option>
                <option value="IN">IN (Entry)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name / ID
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Scan ID or enter name..."
              required
              value={form.name}
              onChange={handleChange}
              className="rounded-lg border-border bg-background h-10"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason / Destination (Optional)
            </Label>
            <Input
              id="reason"
              name="reason"
              placeholder="e.g. Going home for weekend"
              value={form.reason}
              onChange={handleChange}
              className="rounded-lg border-border bg-background h-10"
            />
          </div>
          
          <div className="rounded-lg bg-muted/40 p-3 flex items-center gap-2 text-xs text-muted-foreground border border-border mt-2">
            <Clock className="h-4 w-4" />
            Timestamp will be automatically recorded as now.
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-xl h-11 font-bold shadow-md transition hover:opacity-90 mt-2"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Log Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
