import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  Armchair,
  Search,
  Eye,
  AlertTriangle,
  Wrench,
  Plus,
  Download,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  X,
  Building,
  Sparkles,
  BedDouble,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Box,
  Laptop,
  Archive,
  Fan,
  Users,
  UserCheck,
  ShieldCheck,
  MoreVertical
} from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { wardenFurnitureApi, wardenInspectionApi } from "@/services/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Route = createFileRoute("/warden/furniture")({
  component: FurniturePage
});

const TINT = "#EAB308";

function FurniturePage() {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "room-wise" | "damaged" | "inspections"
  const [viewMode, setViewMode] = useState("list"); // "list" | "cards"

  // Data states
  const [furnitureList, setFurnitureList] = useState([]);
  const [inspectionList, setInspectionList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");

  // Modals
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isEditAssetOpen, setIsEditAssetOpen] = useState(false);
  const [isViewAssetOpen, setIsViewAssetOpen] = useState(false);
  const [isAddInspectionOpen, setIsAddInspectionOpen] = useState(false);
  const [isViewInspectionOpen, setIsViewInspectionOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [assetForm, setAssetForm] = useState({
    name: "",
    category: "Desk",
    condition: "Good",
    quantity: 1,
    roomNumber: "101",
    assignedTo: "Shared Room Fixture",
    remarks: ""
  });

  const [inspectionForm, setInspectionForm] = useState({
    roomNumber: "101",
    cleanlinessScore: "Good",
    status: "Pass",
    furnitureCondition: "Good",
    remarks: "",
    actionRequired: ""
  });

  useEffect(() => {
    loadModuleData();
  }, []);

  const loadModuleData = async () => {
    setLoading(true);
    try {
      const [furRes, insRes] = await Promise.allSettled([
        wardenFurnitureApi.getAll(),
        wardenInspectionApi.getAll()
      ]);

      if (furRes.status === "fulfilled") {
        const data = furRes.value?.data || furRes.value;
        setFurnitureList(Array.isArray(data) ? data : []);
      } else {
        setFurnitureList([]);
      }

      if (insRes.status === "fulfilled") {
        const data = insRes.value?.data || insRes.value;
        setInspectionList(Array.isArray(data) ? data : []);
      } else {
        setInspectionList([]);
      }
    } catch {
      setFurnitureList([]);
      setInspectionList([]);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalAssets = furnitureList.length;
  const goodAssets = furnitureList.filter((f) => f.condition === "Good").length;
  const repairAssets = furnitureList.filter((f) => f.condition === "Needs Repair" || f.condition === "Damaged").length;
  const totalInspections = inspectionList.length;

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return furnitureList.filter((f) => {
      if (activeTab === "damaged" && f.condition !== "Needs Repair" && f.condition !== "Damaged") return false;
      if (categoryFilter !== "All" && f.category !== categoryFilter) return false;
      if (conditionFilter !== "All" && f.condition !== conditionFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = f.name?.toLowerCase().includes(q);
        const codeMatch = f.assetCode?.toLowerCase().includes(q);
        const roomMatch = f.room?.number?.toLowerCase().includes(q);
        const assigneeMatch = f.assignedTo?.toLowerCase().includes(q);
        return nameMatch || codeMatch || roomMatch || assigneeMatch;
      }
      return true;
    });
  }, [furnitureList, activeTab, categoryFilter, conditionFilter, searchQuery]);

  // Group assets by room for Room-wise view
  const roomGroupedAssets = useMemo(() => {
    const map = new Map();
    filteredAssets.forEach((item) => {
      const roomNum = item.room?.number ? `Room ${item.room.number}` : "Storage / Common";
      const blockName = item.room?.floor?.block?.name || "Block A";
      const capacity = item.room?.capacity || 3;
      const key = `${roomNum} (${blockName})`;
      if (!map.has(key)) {
        map.set(key, { roomNum, blockName, capacity, items: [] });
      }
      map.get(key).items.push(item);
    });
    return Array.from(map.entries());
  }, [filteredAssets]);

  // Filtered Inspections
  const filteredInspections = useMemo(() => {
    return inspectionList.filter((i) => {
      if (conditionFilter !== "All" && i.status !== conditionFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const codeMatch = i.inspectionCode?.toLowerCase().includes(q);
        const roomMatch = i.room?.number?.toLowerCase().includes(q);
        const remarksMatch = i.remarks?.toLowerCase().includes(q);
        return codeMatch || roomMatch || remarksMatch;
      }
      return true;
    });
  }, [inspectionList, conditionFilter, searchQuery]);

  // Category Icon helper
  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case "bed":
        return <BedDouble className="h-4 w-4 text-blue-600" />;
      case "desk":
        return <Laptop className="h-4 w-4 text-amber-600" />;
      case "chair":
        return <Armchair className="h-4 w-4 text-purple-600" />;
      case "cupboard":
        return <Archive className="h-4 w-4 text-emerald-600" />;
      case "appliance":
        return <Fan className="h-4 w-4 text-cyan-600" />;
      default:
        return <Box className="h-4 w-4 text-slate-500" />;
    }
  };

  // Time formatter helper
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const diffHours = Math.round((new Date() - date) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  // Actions
  const handleAddAssetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await wardenFurnitureApi.create({
        name: assetForm.name,
        category: assetForm.category,
        condition: assetForm.condition,
        quantity: assetForm.quantity,
        remarks: `${assetForm.remarks} (Assigned: ${assetForm.assignedTo})`
      });
      toast.success("Furniture asset added successfully!");
      setIsAddAssetOpen(false);
      await loadModuleData();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAssetSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await wardenFurnitureApi.update(selectedItem.id, {
        condition: assetForm.condition,
        remarks: assetForm.remarks
      });
      toast.success("Asset status updated!");
      setIsEditAssetOpen(false);
      await loadModuleData();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddInspectionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await wardenInspectionApi.create({
        roomId: 1,
        cleanlinessScore: inspectionForm.cleanlinessScore,
        status: inspectionForm.status,
        furnitureCondition: inspectionForm.furnitureCondition,
        remarks: inspectionForm.remarks,
        actionRequired: inspectionForm.actionRequired
      });
      toast.success("Room inspection audit logged!");
      setIsAddInspectionOpen(false);
      await loadModuleData();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to log inspection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (activeTab !== "inspections") {
      const headers = ["ID,Asset Code,Item Name,Category,Condition,Occupant/Bed,Room,Remarks\n"];
      const rows = filteredAssets.map((f) =>
        `"${f.id}","${f.assetCode || ""}","${f.name || ""}","${f.category || ""}","${f.condition || ""}","${f.assignedTo || "Shared"}","${f.room?.number || "Storage"}","${f.remarks || ""}"\n`
      );
      const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Furniture_Inventory_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      toast.success("Inventory CSV exported!");
    } else {
      const headers = ["ID,Inspection Code,Room,Date,Cleanliness,Status,Furniture Condition,Remarks\n"];
      const rows = filteredInspections.map((i) =>
        `"${i.id}","${i.inspectionCode || ""}","${i.room?.number || "101"}","${new Date(i.createdAt).toLocaleDateString()}","${i.cleanlinessScore || ""}","${i.status || ""}","${i.furnitureCondition || ""}","${i.remarks || ""}"\n`
      );
      const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Room_Inspections_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      toast.success("Inspection logs CSV exported!");
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-3">
      {/* 1. VISUAL HIERARCHY STEP 1: Page Title & Primary Actions First */}
      <WardenPageHeader
        title="Furniture & Room Inspection"
        description="Track 2-4 occupant room furniture, asset conditions and room inspection audits."
        icon={Armchair}
        tint={TINT}
        breadcrumbs={[{ label: "Furniture & Inspection" }]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
            </Button>
            {activeTab !== "inspections" ? (
              <Button
                size="sm"
                onClick={() => {
                  setAssetForm({ name: "", category: "Desk", condition: "Good", quantity: 1, roomNumber: "101", assignedTo: "Shared Room Fixture", remarks: "" });
                  setIsAddAssetOpen(true);
                }}
                style={{ backgroundColor: TINT }}
                className="h-9 text-slate-900 font-semibold hover:opacity-90 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Asset
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  setInspectionForm({ roomNumber: "101", cleanlinessScore: "Good", status: "Pass", furnitureCondition: "Good", remarks: "", actionRequired: "" });
                  setIsAddInspectionOpen(true);
                }}
                className="h-9 bg-primary text-white hover:bg-primary/90 gap-1.5 font-semibold"
              >
                <ClipboardCheck className="h-3.5 w-3.5" /> Conduct Inspection
              </Button>
            )}
          </div>
        }
      />

      {/* 2. VISUAL HIERARCHY STEP 2: Summary Cards Next */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total Furniture</p>
            <Armchair className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-1 text-xl font-bold text-foreground">{totalAssets}</p>
          <p className="text-[11px] text-muted-foreground">Across multi-sharing rooms</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Good Condition</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-1 text-xl font-bold text-emerald-600">{goodAssets}</p>
          <p className="text-[11px] text-muted-foreground">Active in rooms</p>
        </div>

        {/* CRITICAL METRIC VISUALLY PROMINENT */}
        <div className="rounded-xl border-2 border-red-500/60 bg-gradient-to-br from-red-50/80 via-card to-red-100/30 p-3 shadow-sm ring-2 ring-red-500/20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 uppercase tracking-wide">
              <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" /> Needs Repair / Damaged
            </span>
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
              CRITICAL
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-red-600">{repairAssets}</p>
          <p className="text-[11px] font-semibold text-red-700">Immediate warden attention required</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Room Inspections</p>
            <ClipboardCheck className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-1 text-xl font-bold text-foreground">{totalInspections}</p>
          <p className="text-[11px] text-muted-foreground">Logged room audits</p>
        </div>
      </div>

      {/* 3. VISUAL HIERARCHY STEP 3: Navigation Tabs Next */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "all"
                ? "bg-[#EAB308] text-slate-900 shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Armchair className="h-3.5 w-3.5" /> All Inventory ({furnitureList.length})
          </button>

          <button
            onClick={() => setActiveTab("room-wise")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "room-wise"
                ? "bg-[#EAB308] text-slate-900 shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Building className="h-3.5 w-3.5" /> Room-wise (2-4 Occupants) ({roomGroupedAssets.length})
          </button>

          <button
            onClick={() => setActiveTab("damaged")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "damaged"
                ? "bg-red-600 text-white shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Repair Queue ({repairAssets})
          </button>

          <button
            onClick={() => setActiveTab("inspections")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              activeTab === "inspections"
                ? "bg-primary text-white shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <ClipboardCheck className="h-3.5 w-3.5" /> Inspection Logs ({inspectionList.length})
          </button>
        </div>
      </div>

      {/* 4. VISUAL HIERARCHY STEP 4: Unified Single Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-2.5 shadow-2xs">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "inspections"
                  ? "Quick search audit code, room or remarks..."
                  : "Quick search asset code, occupant, bed or room..."
              }
              className="h-8.5 pl-8 text-xs"
            />
          </div>

          {activeTab !== "inspections" && (
            <>
              <div className="flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-8.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Desk">Desks</option>
                  <option value="Bed">Beds</option>
                  <option value="Chair">Chairs</option>
                  <option value="Cupboard">Cupboards</option>
                  <option value="Appliance">Appliances</option>
                </select>
              </div>

              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="h-8.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium"
              >
                <option value="All">All Conditions</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Damaged">Damaged</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </>
          )}

          {activeTab === "inspections" && (
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="h-8.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium"
            >
              <option value="All">All Audit Results</option>
              <option value="Pass">Pass</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Fail">Fail</option>
            </select>
          )}
        </div>

        {activeTab !== "inspections" && activeTab !== "room-wise" && (
          <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors",
                viewMode === "list" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={cn(
                "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition-colors",
                viewMode === "cards" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Cards
            </button>
          </div>
        )}
      </div>

      {/* 5. VISUAL HIERARCHY STEP 5: Data Content Views */}

      {/* ROOM-WISE GROUPED VIEW */}
      {activeTab === "room-wise" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-1">
          {roomGroupedAssets.length === 0 ? (
            <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
              No rooms match current search filters.
            </div>
          ) : (
            roomGroupedAssets.map(([roomKey, group]) => {
              const occupants = Array.from(
                new Set(
                  group.items
                    .map((i) => i.assignedTo)
                    .filter((a) => a && a !== "Shared Room Fixture")
                )
              );

              return (
                <div key={roomKey} className="rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">{group.roomNum}</h3>
                          <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[11px] font-semibold border border-blue-200">
                            {group.capacity}-Sharing
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{group.blockName} · {group.items.length} items</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                        {group.items.filter((i) => i.condition === "Good").length}/{group.items.length} Good
                      </span>
                    </div>

                    {occupants.length > 0 && (
                      <div className="mt-2.5 rounded-lg bg-muted/40 p-2 border border-border/50">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                          <Users className="h-3 w-3 text-primary" /> Occupants ({occupants.length}/{group.capacity}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {occupants.map((occ, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 rounded bg-card px-2 py-0.5 text-[11px] font-medium text-foreground border border-border">
                              <UserCheck className="h-3 w-3 text-emerald-600" /> {occ}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-2.5 space-y-1.5">
                      {group.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 rounded-md border border-border/60 p-2 bg-card">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="grid h-6 w-6 place-items-center rounded bg-muted/40 shrink-0">
                              {getCategoryIcon(item.category)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {item.assignedTo && item.assignedTo !== "Shared Room Fixture" ? item.assignedTo : "Shared Fixture"}
                              </p>
                            </div>
                          </div>
                          <StatusPill status={item.condition} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* FURNITURE CARDS VIEW (100% VISIBLE & HIGH CONTRAST) */}
      {activeTab !== "inspections" && activeTab !== "room-wise" && viewMode === "cards" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-1">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-xs text-muted-foreground">
              No furniture assets found matching filters.
            </div>
          ) : (
            filteredAssets.map((item) => {
              const studentName = item.assignedTo && item.assignedTo !== "Shared Room Fixture"
                ? item.assignedTo
                : null;
              
              const initials = studentName
                ? studentName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : null;

              return (
                <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div>
                    {/* Top Row: Asset Code & Status */}
                    <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100/60 text-amber-900 shrink-0">
                          {getCategoryIcon(item.category)}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-mono font-bold text-primary truncate">{item.assetCode}</h4>
                          <p className="text-[10px] font-medium text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <StatusPill status={item.condition} />
                    </div>

                    {/* Middle Details */}
                    <div className="mt-3 space-y-2 text-xs">
                      <p className="font-bold text-sm text-foreground">{item.name}</p>

                      {/* Prominent Room Badge */}
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-blue-950 font-extrabold text-xs">
                        <Building className="h-3.5 w-3.5 text-blue-700" />
                        {item.room ? `Room ${item.room.number}` : "Storage"}
                        <span className="text-[10px] font-bold bg-blue-200/70 text-blue-900 px-1 py-0.2 rounded ml-1">
                          {item.room?.capacity || 3}P
                        </span>
                      </div>

                      {/* Prominent Student Badge */}
                      <div className="mt-1">
                        {studentName ? (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 border border-purple-200 px-2 py-1 text-purple-950 font-bold text-xs">
                            <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-purple-700 text-[9px] font-bold text-white shrink-0">
                              {initials}
                            </span>
                            <span className="truncate max-w-[130px]">{studentName}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 px-2 py-1 text-slate-700 text-[11px] font-semibold">
                            <ShieldCheck className="h-3 w-3 text-slate-500" /> Shared Fixture
                          </div>
                        )}
                      </div>

                      {item.remarks && (
                        <p className="text-muted-foreground text-[11px] italic bg-muted/40 p-2 rounded-md border border-border/50">
                          "{item.remarks}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-2.5 text-xs text-muted-foreground">
                    <span className="text-[10px] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatTimeAgo(item.updatedAt)}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setAssetForm({ ...assetForm, condition: item.condition, remarks: item.remarks || "" });
                        setIsEditAssetOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      <Wrench className="h-3 w-3" /> Update Status
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {activeTab !== "inspections" && activeTab !== "room-wise" && viewMode === "list" && (
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden mt-1">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/90 border-b border-border text-left uppercase tracking-wide text-muted-foreground font-bold">
                <tr>
                  <th className="py-2.5 px-3">Asset Code & Item</th>
                  <th className="py-2.5 px-3">Assigned Room</th>
                  <th className="py-2.5 px-3">Assigned Student / Bed</th>
                  <th className="py-2.5 px-3">Condition Status</th>
                  <th className="py-2.5 px-3">Remarks & Updated</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No furniture assets found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((item) => {
                    const studentName = item.assignedTo && item.assignedTo !== "Shared Room Fixture"
                      ? item.assignedTo
                      : null;
                    
                    const initials = studentName
                      ? studentName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : null;

                    return (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                        {/* 1. ASSET CODE & ITEM */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-7 w-7 place-items-center rounded-lg bg-muted/50 shrink-0">
                              {getCategoryIcon(item.category)}
                            </span>
                            <div className="min-w-0">
                              <p className="font-mono text-xs font-bold text-primary truncate">{item.assetCode}</p>
                              <p className="font-medium text-foreground text-[11px] truncate">{item.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* 2. DEDICATED PROMINENT ROOM NO. COLUMN */}
                        <td className="py-2.5 px-3">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200/80 px-2.5 py-1 shadow-2xs">
                            <Building className="h-3.5 w-3.5 text-blue-700" />
                            <span className="font-extrabold text-xs text-blue-950">
                              {item.room ? `Room ${item.room.number}` : "Storage"}
                            </span>
                            {item.room?.capacity && (
                              <span className="text-[10px] font-bold bg-blue-200/60 text-blue-900 px-1 py-0.2 rounded">
                                {item.room.capacity}P
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 ml-0.5">
                            {item.room?.floor?.block?.name || "Block A"}
                          </p>
                        </td>

                        {/* 3. DEDICATED PROMINENT STUDENT NAME / OCCUPANT COLUMN */}
                        <td className="py-2.5 px-3">
                          {studentName ? (
                            <div className="inline-flex items-center gap-2 rounded-lg bg-purple-50/90 border border-purple-200/80 px-2.5 py-1 shadow-2xs">
                              <span className="grid h-5 w-5 place-items-center rounded-full bg-purple-700 text-[10px] font-bold text-white shrink-0">
                                {initials}
                              </span>
                              <span className="font-bold text-xs text-purple-950 truncate max-w-[150px]">
                                {studentName}
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700">
                              <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                              <span className="font-semibold text-xs text-slate-700">Shared Room Fixture</span>
                            </div>
                          )}
                        </td>

                        {/* 4. CONDITION STATUS */}
                        <td className="py-2.5 px-3">
                          <StatusPill status={item.condition} />
                        </td>

                        {/* 5. REMARKS & TIMESTAMP */}
                        <td className="py-2.5 px-3 text-muted-foreground max-w-[180px]">
                          <p className="truncate text-xs font-medium text-foreground">{item.remarks || "—"}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" /> {formatTimeAgo(item.updatedAt)}
                          </p>
                        </td>

                        {/* 6. COMPACT DROPDOWN ACTION MENU */}
                        <td className="py-2.5 px-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-auto">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setAssetForm({ ...assetForm, condition: item.condition, remarks: item.remarks || "" });
                                  setIsEditAssetOpen(true);
                                }}
                              >
                                <Wrench className="h-3.5 w-3.5 mr-1.5 text-amber-600" /> Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsViewAssetOpen(true);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-600" /> View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECTIONS TABLE VIEW */}
      {activeTab === "inspections" && (
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden mt-1">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/90 border-b border-border text-left uppercase tracking-wide text-muted-foreground font-bold">
                <tr>
                  <th className="py-2.5 px-3">Audit Code</th>
                  <th className="py-2.5 px-3">Inspected Room & Sharing</th>
                  <th className="py-2.5 px-3">Cleanliness</th>
                  <th className="py-2.5 px-3">Audit Result</th>
                  <th className="py-2.5 px-3">Inspector & Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No room inspection logs found.
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((ins) => (
                    <tr key={ins.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-purple-700">{ins.inspectionCode}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">Room {ins.room?.number || "101"}</span>
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                            {ins.room?.capacity || 3}-Sharing
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{ins.room?.floor?.block?.name || "Block A"}</p>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{ins.cleanlinessScore}</td>
                      <td className="py-2.5 px-3">
                        <StatusPill status={ins.status} />
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        <p className="font-semibold text-foreground">{ins.inspectedBy?.name || "Warden"}</p>
                        <p className="text-[10px]">{new Date(ins.createdAt || ins.inspectionDate).toLocaleDateString()}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedItem(ins);
                            setIsViewInspectionOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Log
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD ASSET */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground">Add Furniture Asset</h3>
              <button onClick={() => setIsAddAssetOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddAssetSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Item Name *</label>
                <Input
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  placeholder="e.g. Study Table / Single Bed"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                  >
                    <option value="Desk">Desk</option>
                    <option value="Bed">Bed</option>
                    <option value="Chair">Chair</option>
                    <option value="Cupboard">Cupboard</option>
                    <option value="Appliance">Appliance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Room Number *</label>
                  <Input
                    value={assetForm.roomNumber}
                    onChange={(e) => setAssetForm({ ...assetForm, roomNumber: e.target.value })}
                    placeholder="e.g. 101"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Occupant / Bed Assignment</label>
                <Input
                  value={assetForm.assignedTo}
                  onChange={(e) => setAssetForm({ ...assetForm, assignedTo: e.target.value })}
                  placeholder="e.g. Bed A - Aarav Sharma OR Shared Room Fixture"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Initial Condition</label>
                <select
                  value={assetForm.condition}
                  onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                >
                  <option value="Good">Good</option>
                  <option value="Needs Repair">Needs Repair</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Remarks / Notes</label>
                <Input
                  value={assetForm.remarks}
                  onChange={(e) => setAssetForm({ ...assetForm, remarks: e.target.value })}
                  placeholder="e.g. Minor scratches"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddAssetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting} style={{ backgroundColor: TINT }} className="text-slate-900 font-semibold">
                  {isSubmitting ? "Saving..." : "Add Asset"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ASSET CONDITION */}
      {isEditAssetOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground">Update Asset — {selectedItem.assetCode}</h3>
              <button onClick={() => setIsEditAssetOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditAssetSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Condition Status</label>
                <select
                  value={assetForm.condition}
                  onChange={(e) => setAssetForm({ ...assetForm, condition: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                >
                  <option value="Good">Good</option>
                  <option value="Needs Repair">Needs Repair</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Maintenance Remarks</label>
                <Input
                  value={assetForm.remarks}
                  onChange={(e) => setAssetForm({ ...assetForm, remarks: e.target.value })}
                  placeholder="Describe damage or repair status"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditAssetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting} style={{ backgroundColor: TINT }} className="text-slate-900 font-semibold">
                  {isSubmitting ? "Updating..." : "Save Status"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ASSET DETAILS */}
      {isViewAssetOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50">
                  {getCategoryIcon(selectedItem.category)}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{selectedItem.name}</h3>
                  <p className="text-xs font-mono font-bold text-primary">{selectedItem.assetCode}</p>
                </div>
              </div>
              <button onClick={() => setIsViewAssetOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 bg-muted/20">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-semibold text-foreground">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <StatusPill status={selectedItem.condition} />
                </div>
                <div>
                  <p className="text-muted-foreground">Room & Block</p>
                  <p className="font-semibold text-foreground">
                    {selectedItem.room ? `Room ${selectedItem.room.number} (${selectedItem.room.floor?.block?.name || "Block A"})` : "Storage"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned Occupant / Bed</p>
                  <p className="font-semibold text-primary">{selectedItem.assignedTo || "Shared Room Fixture"}</p>
                </div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-muted-foreground mb-1 font-semibold">Remarks / History</p>
                <p className="font-medium text-foreground">{selectedItem.remarks || "No additional remarks recorded."}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsViewAssetOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG ROOM INSPECTION */}
      {isAddInspectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-semibold text-foreground">Log Room Inspection Audit</h3>
              <button onClick={() => setIsAddInspectionOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddInspectionSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Room Number *</label>
                <Input
                  value={inspectionForm.roomNumber}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, roomNumber: e.target.value })}
                  placeholder="e.g. 101"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Cleanliness Rating</label>
                  <select
                    value={inspectionForm.cleanlinessScore}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, cleanlinessScore: e.target.value })}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Inspection Result</label>
                  <select
                    value={inspectionForm.status}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, status: e.target.value })}
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                  >
                    <option value="Pass">Pass</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Fail">Fail / Penalty</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Furniture Condition</label>
                <select
                  value={inspectionForm.furnitureCondition}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, furnitureCondition: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                >
                  <option value="Good">Good</option>
                  <option value="Needs Repair">Needs Repair</option>
                  <option value="Damaged Items Found">Damaged Items Found</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Warden Inspection Remarks</label>
                <Input
                  value={inspectionForm.remarks}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, remarks: e.target.value })}
                  placeholder="Observations, room occupancy check, or maintenance notes"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddInspectionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting} className="bg-primary text-white font-semibold">
                  {isSubmitting ? "Submitting..." : "Log Inspection"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW INSPECTION AUDIT DETAIL */}
      {isViewInspectionOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Room Inspection Audit Log</h3>
                <p className="text-xs font-mono text-purple-700">{selectedItem.inspectionCode}</p>
              </div>
              <button onClick={() => setIsViewInspectionOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 bg-muted/20">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1"><Building className="h-3.5 w-3.5" /> Inspected Room</p>
                  <p className="font-semibold text-foreground">Room {selectedItem.room?.number || "101"} ({selectedItem.room?.capacity || 3}-Sharing)</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Date & Time</p>
                  <p className="font-medium text-foreground">{new Date(selectedItem.createdAt || selectedItem.inspectionDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cleanliness Score</p>
                  <p className="font-medium text-foreground">{selectedItem.cleanlinessScore}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Audit Status</p>
                  <StatusPill status={selectedItem.status} />
                </div>
              </div>

              <div className="rounded-lg border border-border p-3">
                <p className="font-semibold uppercase text-muted-foreground mb-1">Inspector Remarks</p>
                <p className="font-medium text-foreground">{selectedItem.remarks || "No additional remarks logged."}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsViewInspectionOpen(false)}>
                Close Log
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
