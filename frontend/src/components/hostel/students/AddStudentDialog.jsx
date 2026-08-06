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
import { UserPlus, Save, Paperclip, Plus, X } from "lucide-react";

export function AddStudentDialog({ onAddStudent }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    enrollmentId: "",
    email: "",
    phone: "",
    room: "",
  });

  const [docs, setDocs] = useState({
    aadhar: null,
    incomeCert: null,
    admissionLetter: null,
  });

  const [customDocs, setCustomDocs] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleDocChange = (key, file) => setDocs({ ...docs, [key]: file });

  const addCustomDoc = () => {
    setCustomDocs([...customDocs, { id: Date.now(), name: "", file: null }]);
  };

  const updateCustomDoc = (id, key, value) => {
    setCustomDocs(customDocs.map(doc => doc.id === id ? { ...doc, [key]: value } : doc));
  };

  const removeCustomDoc = (id) => {
    setCustomDocs(customDocs.filter(doc => doc.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate total attached documents
    let totalDocs = 0;
    if (docs.aadhar) totalDocs++;
    if (docs.incomeCert) totalDocs++;
    if (docs.admissionLetter) totalDocs++;
    customDocs.forEach(d => { if (d.file) totalDocs++ });

    onAddStudent({
      id: Math.random().toString(36).substr(2, 9),
      status: "Active",
      documentCount: totalDocs,
      ...form,
    });
    
    setForm({ name: "", enrollmentId: "", email: "", phone: "", room: "" });
    setDocs({ aadhar: null, incomeCert: null, admissionLetter: null });
    setCustomDocs([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition hover:opacity-90 active:scale-95">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] border-border bg-card shadow-2xl rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
          <DialogTitle className="text-xl font-bold text-foreground">Add New Student</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto flex flex-col gap-6">
            
            {/* Basic Info Section */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" />
                Basic Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input id="name" name="name" required value={form.name} onChange={handleChange} className="rounded-lg h-10" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="enrollmentId" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enrollment ID</Label>
                  <Input id="enrollmentId" name="enrollmentId" required value={form.enrollmentId} onChange={handleChange} className="rounded-lg h-10" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="rounded-lg h-10" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</Label>
                  <Input id="phone" name="phone" required value={form.phone} onChange={handleChange} className="rounded-lg h-10" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="room" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Room Allocation (Optional)</Label>
                <Input id="room" name="room" value={form.room} onChange={handleChange} className="rounded-lg h-10" />
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            {/* Documents Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-primary" />
                  Mandatory Documents
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <Label className="w-32 text-xs font-medium text-muted-foreground">Aadhar Card</Label>
                  <Input type="file" onChange={(e) => handleDocChange("aadhar", e.target.files[0])} className="flex-1 h-9 text-xs" />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-32 text-xs font-medium text-muted-foreground">Income Certificate</Label>
                  <Input type="file" onChange={(e) => handleDocChange("incomeCert", e.target.files[0])} className="flex-1 h-9 text-xs" />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-32 text-xs font-medium text-muted-foreground">Admission Letter</Label>
                  <Input type="file" onChange={(e) => handleDocChange("admissionLetter", e.target.files[0])} className="flex-1 h-9 text-xs" />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Custom Documents</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addCustomDoc} className="h-8 text-xs">
                    <Plus className="mr-1 h-3 w-3" /> Add Custom
                  </Button>
                </div>
                
                {customDocs.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No custom documents added.</p>
                )}
                
                {customDocs.map((doc, idx) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20">
                    <Input 
                      placeholder="Doc Name (e.g. Medical)" 
                      value={doc.name} 
                      onChange={(e) => updateCustomDoc(doc.id, "name", e.target.value)}
                      className="w-1/3 h-8 text-xs"
                    />
                    <Input 
                      type="file" 
                      onChange={(e) => updateCustomDoc(doc.id, "file", e.target.files[0])}
                      className="flex-1 h-8 text-xs"
                    />
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeCustomDoc(doc.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          <div className="px-6 py-4 border-t border-border bg-muted/20">
            <Button type="submit" className="w-full rounded-xl h-11 font-bold shadow-md transition hover:opacity-90">
              <Save className="mr-2 h-4 w-4" />
              Save Student & Documents
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
