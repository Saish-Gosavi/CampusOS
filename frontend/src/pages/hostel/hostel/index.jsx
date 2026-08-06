import { createFileRoute } from "@/routes/compat";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Layers,
  DoorClosed,
  Bed,
  UserPlus,
  X,
  Loader2,
  Shield,
  Sun,
  Moon,
  Clock,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  MoreVertical,
  ArrowRight,
  Check,
  Building,
  CheckCircle2,
  Info,
  User
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { hostelApi, blockApi, floorApi, roomApi, wardenApi } from "@/services/api";

const Route = createFileRoute("/hostel-admin/hostels/")({
  component: HostelsPage
});

function HostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [selectedHostelId, setSelectedHostelId] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Searchable Hostel Dropdown state
  const [hostelDropdownOpen, setHostelDropdownOpen] = useState(false);
  const [hostelSearchQuery, setHostelSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Actions menu state
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef(null);

  // Modals state
  const [hostelModalOpen, setHostelModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const [floorModalOpen, setFloorModalOpen] = useState(false);
  const [targetBlockId, setTargetBlockId] = useState(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [targetFloorId, setTargetFloorId] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  const [wardenModalOpen, setWardenModalOpen] = useState(false);

  // Active expanded block & bed details state
  const [expandedBlocks, setExpandedBlocks] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHostelDropdownOpen(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setActionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch All Hostels
  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await hostelApi.getAll();
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      setHostels(list);

      if (list.length > 0 && !selectedHostelId) {
        setSelectedHostelId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to load hostels:", err);
      toast.error("Failed to load hostels");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Blocks & Hierarchy for selected Hostel
  const fetchBlocks = async (hostelId) => {
    if (!hostelId) return;
    try {
      const res = await blockApi.getAll(hostelId);
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      setBlocks(list);

      if (list.length > 0) {
        setExpandedBlocks((prev) => ({ ...prev, [list[0].id]: true }));
      }
    } catch (err) {
      console.error("Failed to load blocks:", err);
      toast.error("Failed to load hostel blocks");
    }
  };

  // 3. Fetch Wardens for selected Hostel
  const fetchWardens = async (hostelId) => {
    if (!hostelId) return;
    try {
      const res = await wardenApi.getAll(hostelId);
      const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      setWardens(list);
    } catch (err) {
      console.error("Failed to load wardens:", err);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    if (selectedHostelId) {
      fetchBlocks(selectedHostelId);
      fetchWardens(selectedHostelId);
    }
  }, [selectedHostelId]);

  const activeHostel = useMemo(
    () => hostels.find((h) => h.id === Number(selectedHostelId) || h.id === selectedHostelId),
    [hostels, selectedHostelId]
  );

  // Filtered hostels for searchable dropdown
  const filteredHostels = useMemo(() => {
    const q = hostelSearchQuery.toLowerCase().trim();
    if (!q) return hostels;
    return hostels.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.city && h.city.toLowerCase().includes(q))
    );
  }, [hostels, hostelSearchQuery]);

  // Compute live capacity & stats for active hostel
  const hostelStats = useMemo(() => {
    let totalFloors = 0;
    let totalRooms = 0;
    let totalCapacity = 0;
    let totalOccupied = 0;

    blocks.forEach((b) => {
      const floors = b.floors || [];
      totalFloors += floors.length;
      floors.forEach((f) => {
        const rooms = f.rooms || [];
        totalRooms += rooms.length;
        rooms.forEach((r) => {
          totalCapacity += r.capacity || 0;
          const beds = r.beds || [];
          beds.forEach((bed) => {
            if (bed.allocations && bed.allocations.length > 0) {
              totalOccupied += 1;
            }
          });
        });
      });
    });

    return {
      blocksCount: blocks.length,
      floorsCount: totalFloors,
      roomsCount: totalRooms,
      totalCapacity,
      totalOccupied,
      totalAvailable: Math.max(0, totalCapacity - totalOccupied)
    };
  }, [blocks]);

  // Toggle Block Expansion
  const toggleBlockExpand = (id) => {
    setExpandedBlocks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Room Bed Detail Expansion
  const toggleRoomExpand = (id) => {
    setExpandedRooms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Delete Handlers
  const handleDeleteHostel = async (id) => {
    if (!confirm("Are you sure you want to delete this hostel? All associated blocks and rooms will be removed.")) return;
    try {
      await hostelApi.delete(id);
      toast.success("Hostel deleted successfully");
      await fetchHostels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete hostel");
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!confirm("Delete this Block and all its floors and rooms?")) return;
    try {
      await blockApi.delete(id);
      toast.success("Block deleted successfully");
      fetchBlocks(selectedHostelId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete block");
    }
  };

  const handleDeleteFloor = async (id) => {
    if (!confirm("Delete this Floor and all its rooms?")) return;
    try {
      await floorApi.delete(id);
      toast.success("Floor deleted successfully");
      fetchBlocks(selectedHostelId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete floor");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm("Delete this Room?")) return;
    try {
      await roomApi.delete(id);
      toast.success("Room deleted successfully");
      fetchBlocks(selectedHostelId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete room");
    }
  };

  const handleDeleteWarden = async (id) => {
    if (!confirm("Remove this Warden login?")) return;
    try {
      await wardenApi.delete(id);
      toast.success("Warden login removed");
      fetchWardens(selectedHostelId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete warden");
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-2 sm:p-4">
      {/* 1. Compact Header */}
      <HostelPageHeader
        title="Hostel & Hierarchy Management"
        description="Configure building blocks, floors, room student capacities, and warden logins."
        icon={Building2}
        tint="#2563EB"
        breadcrumbs={[{ label: "Hostels" }]}
        action={
          <Button
            onClick={() => {
              setEditingHostel(null);
              setHostelModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-medium text-xs sm:text-sm h-9 px-3.5 shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Hostel
          </Button>
        }
      />

      {loading ? (
        <div className="flex h-36 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
          <span className="text-xs text-muted-foreground">Loading records...</span>
        </div>
      ) : hostels.length === 0 ? (
        /* Empty Hostels State */
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-base font-bold text-foreground">No Hostels Registered Yet</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Get started by registering your institute's first hostel building.
          </p>
          <Button onClick={() => setHostelModalOpen(true)} size="sm" className="mt-1">
            <Plus className="mr-1.5 h-4 w-4" /> Register Hostel
          </Button>
        </div>
      ) : (
        <>
          {/* 2 & 3. Hostel Selector & Compact Action Group Card */}
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Searchable Hostel Selector */}
              <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Current Hostel
                  </span>

                  {/* Dropdown Trigger */}
                  <button
                    type="button"
                    onClick={() => setHostelDropdownOpen(!hostelDropdownOpen)}
                    className="mt-0.5 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-bold text-foreground transition-colors hover:border-primary focus:outline-none"
                  >
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>
                      {activeHostel?.name} {activeHostel?.city ? `— ${activeHostel.city}` : ""}
                    </span>
                    <StatusPill status={activeHostel?.status || "Active"} />
                    <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                  </button>
                </div>

                {/* Popover Dropdown Menu with Search */}
                {hostelDropdownOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1.5 w-72 rounded-xl border border-border bg-card p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="relative mb-2">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        autoFocus
                        value={hostelSearchQuery}
                        onChange={(e) => setHostelSearchQuery(e.target.value)}
                        placeholder="Search hostel..."
                        className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filteredHostels.length === 0 ? (
                        <div className="py-3 text-center text-xs text-muted-foreground">
                          No hostels found
                        </div>
                      ) : (
                        filteredHostels.map((h) => {
                          const isSelected = h.id === activeHostel?.id;
                          return (
                            <button
                              key={h.id}
                              onClick={() => {
                                setSelectedHostelId(h.id);
                                setHostelDropdownOpen(false);
                                setHostelSearchQuery("");
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition ${
                                isSelected
                                  ? "bg-primary/10 font-bold text-primary"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <div className="truncate">
                                <p className="font-semibold">{h.name}</p>
                                {h.city && <p className="text-[10px] text-muted-foreground">{h.city}</p>}
                              </div>
                              {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Grouped Actions CTA */}
              <div className="flex items-center gap-2 self-end sm:self-auto" ref={actionsRef}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWardenModalOpen(true)}
                  className="h-8 text-xs gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <UserPlus className="h-3.5 w-3.5 text-purple-600" /> Create Warden Login
                </Button>

                {/* More Actions Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActionsOpen(!actionsOpen)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Hostel Options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {actionsOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-border bg-card p-1 shadow-lg">
                      <button
                        onClick={() => {
                          setActionsOpen(false);
                          setEditingHostel(activeHostel);
                          setHostelModalOpen(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted font-medium"
                      >
                        <Pencil className="h-3.5 w-3.5 text-slate-500" /> Edit Hostel
                      </button>
                      <button
                        onClick={() => {
                          setActionsOpen(false);
                          handleDeleteHostel(selectedHostelId);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" /> Delete Hostel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Compact Statistics Row */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-border pt-3">
              <CompactMetric label="Blocks" value={hostelStats.blocksCount} icon={Building2} color="#2563EB" />
              <CompactMetric label="Floors" value={hostelStats.floorsCount} icon={Layers} color="#7B4CED" />
              <CompactMetric label="Rooms" value={hostelStats.roomsCount} icon={DoorClosed} color="#0D9488" />
              <CompactMetric label="Student Capacity" value={`${hostelStats.totalCapacity} Beds`} icon={Bed} color="#EAB308" />
              <CompactMetric
                label="Occupied Beds"
                value={`${hostelStats.totalOccupied} / ${hostelStats.totalCapacity}`}
                icon={Shield}
                color="#EA580C"
              />
              <CompactMetric label="Available Beds" value={`${hostelStats.totalAvailable} Beds`} icon={Bed} color="#22C55E" />
            </div>
          </div>

          {/* 5. Aligned 2-Column Layout */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left Column (2 Cols): Hierarchy Section */}
            <div className="flex flex-col gap-3 lg:col-span-2">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-primary" />
                    Blocks & Hierarchy
                  </h2>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingBlock(null);
                    setBlockModalOpen(true);
                  }}
                  className="h-8 text-xs gap-1 bg-primary hover:bg-primary/90 text-white shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Block
                </Button>
              </div>

              {/* 6. Empty Hierarchy Visual State */}
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-xs">
                  {/* Visual Hierarchy Diagram */}
                  <div className="flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-muted/50 border border-border text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5 text-primary" /> Hostel</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5 text-purple-600" /> Wing</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5 text-teal-600" /> Floor</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="flex items-center gap-1"><DoorClosed className="h-3.5 w-3.5 text-amber-600" /> Room</span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground">No hierarchy has been created yet.</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
                    Start by creating a block/wing (e.g. "Wing A") to configure floors and student room capacity.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingBlock(null);
                      setBlockModalOpen(true);
                    }}
                    className="mt-3 text-xs gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add First Block
                  </Button>
                </div>
              ) : (
                /* Block List Cards */
                blocks.map((block) => {
                  const isExpanded = !!expandedBlocks[block.id];
                  const floors = block.floors || [];

                  let blockCap = 0;
                  let blockOcc = 0;
                  let blockRoomsCount = 0;

                  floors.forEach((fl) => {
                    const rooms = fl.rooms || [];
                    blockRoomsCount += rooms.length;
                    rooms.forEach((rm) => {
                      blockCap += rm.capacity || 0;
                      (rm.beds || []).forEach((b) => {
                        if (b.allocations && b.allocations.length > 0) blockOcc += 1;
                      });
                    });
                  });

                  return (
                    <div
                      key={block.id}
                      className="overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all"
                    >
                      {/* Block Header Bar */}
                      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
                        <div
                          className="flex items-center gap-2.5 cursor-pointer select-none"
                          onClick={() => toggleBlockExpand(block.id)}
                        >
                          <span className="text-muted-foreground hover:text-foreground">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                              {block.name}
                              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                                {floors.length} {floors.length === 1 ? "Floor" : "Floors"} · {blockRoomsCount} {blockRoomsCount === 1 ? "Room" : "Rooms"}
                              </span>
                            </h3>
                            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                              Capacity: <span className="font-bold text-foreground">{blockCap} Beds</span> · Occupied: <span className="font-bold text-amber-600">{blockOcc}</span> · Available: <span className="font-bold text-emerald-600">{Math.max(0, blockCap - blockOcc)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setTargetBlockId(block.id);
                              setFloorModalOpen(true);
                            }}
                            className="h-7 text-[11px] gap-1 px-2.5 border-primary/30 text-primary hover:bg-primary/5 font-semibold"
                          >
                            <Plus className="h-3 w-3" /> Add Floor
                          </Button>
                          <button
                            onClick={() => {
                              setEditingBlock(block);
                              setBlockModalOpen(true);
                            }}
                            className="grid h-7 w-7 place-items-center rounded border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Edit Block"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="grid h-7 w-7 place-items-center rounded border border-border bg-background text-muted-foreground hover:bg-red-50 hover:text-red-600"
                            title="Delete Block"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Floors & Rooms Detail */}
                      {isExpanded && (
                        <div className="p-3.5 flex flex-col gap-3.5 bg-background/40">
                          {floors.length === 0 ? (
                            <div className="py-5 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-card/50">
                              No floors added to {block.name} yet. Click <span className="font-semibold text-primary">"Add Floor"</span> above to build your hierarchy.
                            </div>
                          ) : (
                            floors.map((floor) => {
                              const rooms = floor.rooms || [];
                              let floorCap = 0;
                              let floorOcc = 0;

                              rooms.forEach((r) => {
                                floorCap += r.capacity || 0;
                                (r.beds || []).forEach((b) => {
                                  if (b.allocations && b.allocations.length > 0) floorOcc += 1;
                                });
                              });

                              return (
                                <div
                                  key={floor.id}
                                  className="rounded-xl border border-border bg-card p-3 shadow-2xs"
                                >
                                  {/* Floor Subheader Bar */}
                                  <div className="flex items-center justify-between mb-3 border-b border-border/80 pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="grid h-6 w-6 place-items-center rounded bg-purple-600/10 text-[11px] font-extrabold text-purple-700">
                                        F{floor.number}
                                      </span>
                                      <h4 className="text-xs font-bold text-foreground">
                                        Floor {floor.number}
                                      </h4>
                                      <span className="text-[11px] font-medium text-muted-foreground">
                                        ({rooms.length} {rooms.length === 1 ? "Room" : "Rooms"} · {floorCap} Beds Capacity)
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setTargetFloorId(floor.id);
                                          setEditingRoom(null);
                                          setRoomModalOpen(true);
                                        }}
                                        className="h-6 text-[10px] gap-1 px-2.5 font-bold border-teal-300 text-teal-700 hover:bg-teal-50"
                                      >
                                        <Plus className="h-3 w-3" /> Add Room
                                      </Button>
                                      <button
                                        onClick={() => handleDeleteFloor(floor.id)}
                                        className="text-[10px] font-semibold text-red-500 hover:underline hover:text-red-700"
                                      >
                                        Delete Floor
                                      </button>
                                    </div>
                                  </div>

                                  {/* Rooms Cards Grid */}
                                  {rooms.length === 0 ? (
                                    <p className="text-[11px] text-muted-foreground py-2 text-center border border-dashed border-border/60 rounded-md">
                                      No rooms configured on Floor {floor.number}. Click <span className="font-semibold text-teal-700">"Add Room"</span> to set student capacity and beds.
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                                      {rooms.map((room) => {
                                        const beds = room.beds || [];
                                        const roomOcc = beds.filter((b) => b.allocations && b.allocations.length > 0).length;
                                        const roomCap = room.capacity || beds.length || 1;
                                        const occPct = Math.round((roomOcc / roomCap) * 100);
                                        const isRoomExpanded = !!expandedRooms[room.id];

                                        return (
                                          <div
                                            key={room.id}
                                            className="rounded-lg border border-border bg-background p-3 hover:border-primary/40 transition shadow-2xs"
                                          >
                                            {/* Room Card Title & Quick Actions */}
                                            <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-foreground">
                                                  Room {room.number}
                                                </span>
                                                <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-semibold text-muted-foreground">
                                                  {roomCap}-Bed
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-1">
                                                <button
                                                  onClick={() => {
                                                    setTargetFloorId(floor.id);
                                                    setEditingRoom(room);
                                                    setRoomModalOpen(true);
                                                  }}
                                                  className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                                  title="Edit Room"
                                                >
                                                  <Pencil className="h-3 w-3" />
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteRoom(room.id)}
                                                  className="p-1 rounded text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                                  title="Delete Room"
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Room Metrics & Progress */}
                                            <div className="mt-2 space-y-1">
                                              <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-muted-foreground">Student Capacity:</span>
                                                <span className="font-bold text-foreground">
                                                  {roomCap} Beds
                                                </span>
                                              </div>

                                              <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-muted-foreground">Occupancy:</span>
                                                <span className="font-semibold text-foreground">
                                                  {roomOcc} / {roomCap} ({occPct}%)
                                                </span>
                                              </div>

                                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mt-1">
                                                <div
                                                  className="h-full rounded-full transition-all"
                                                  style={{
                                                    width: `${Math.min(100, occPct)}%`,
                                                    backgroundColor:
                                                      occPct >= 100 ? "#EF4444" : occPct > 0 ? "#22C55E" : "#94A3B8"
                                                  }}
                                                />
                                              </div>

                                              {room.rent > 0 && (
                                                <div className="mt-1 flex items-center justify-between text-[11px]">
                                                  <span className="text-muted-foreground">Monthly Rent:</span>
                                                  <span className="font-bold text-primary">
                                                    ₹{Number(room.rent).toLocaleString()}
                                                  </span>
                                                </div>
                                              )}
                                            </div>

                                            {/* Expandable Bed Breakdown Chips */}
                                            <div className="mt-2.5 pt-2 border-t border-border/50">
                                              <button
                                                type="button"
                                                onClick={() => toggleRoomExpand(room.id)}
                                                className="w-full flex items-center justify-between text-[10px] font-semibold text-muted-foreground hover:text-foreground"
                                              >
                                                <span>Bed Allocations ({beds.length})</span>
                                                {isRoomExpanded ? (
                                                  <ChevronDown className="h-3 w-3" />
                                                ) : (
                                                  <ChevronRight className="h-3 w-3" />
                                                )}
                                              </button>

                                              {isRoomExpanded && (
                                                <div className="mt-1.5 space-y-1">
                                                  {beds.length === 0 ? (
                                                    <p className="text-[10px] text-muted-foreground italic">No beds generated</p>
                                                  ) : (
                                                    beds.map((bed, idx) => {
                                                      const activeAlloc = (bed.allocations || []).find((a) => a.status === "active");
                                                      const isOccupied = !!activeAlloc;
                                                      const studentName = activeAlloc?.student?.fullName || "Occupied";

                                                      return (
                                                        <div
                                                          key={bed.id}
                                                          className={`flex items-center justify-between px-2 py-1 rounded text-[10px] font-medium border ${
                                                            isOccupied
                                                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
                                                              : "bg-muted/40 border-border text-muted-foreground"
                                                          }`}
                                                        >
                                                          <span className="flex items-center gap-1">
                                                            <Bed className="h-3 w-3" />
                                                            {bed.number || `Bed ${idx + 1}`}
                                                          </span>
                                                          <span className="font-semibold">
                                                            {isOccupied ? (
                                                              <span className="inline-flex items-center gap-1">
                                                                <User className="h-2.5 w-2.5" />
                                                                {studentName}
                                                              </span>
                                                            ) : (
                                                              "Available"
                                                            )}
                                                          </span>
                                                        </div>
                                                      );
                                                    })
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column (1 Col): Compact Assigned Wardens Card */}
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4 text-purple-600" />
                      Assigned Wardens
                    </h3>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setWardenModalOpen(true)}
                    className="h-7 text-[11px] gap-1 bg-purple-600 hover:bg-purple-700 text-white px-2.5"
                  >
                    <Plus className="h-3 w-3" /> Add Warden
                  </Button>
                </div>

                {wardens.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                    No warden logins created for this hostel yet. Click "Add Warden" to generate warden credentials.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {wardens.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-600 text-xs font-bold text-white">
                            {w.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-foreground truncate">{w.fullName}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{w.user?.email}</p>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <ShiftBadge shift={w.shift} />
                              <span className="text-[10px] text-muted-foreground">📞 {w.phone}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteWarden(w.id)}
                          className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600 shrink-0"
                          title="Remove Warden"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MODALS (INTACT & ENHANCED FUNCTIONALITY) ── */}

      {/* Hostel Add / Edit Modal */}
      {hostelModalOpen && (
        <HostelModal
          initial={editingHostel}
          onClose={() => setHostelModalOpen(false)}
          onSaved={async () => {
            setHostelModalOpen(false);
            fetchHostels();
          }}
        />
      )}

      {/* Block Add / Edit Modal */}
      {blockModalOpen && (
        <BlockModal
          hostelId={selectedHostelId}
          initial={editingBlock}
          onClose={() => setBlockModalOpen(false)}
          onSaved={() => {
            setBlockModalOpen(false);
            fetchBlocks(selectedHostelId);
          }}
        />
      )}

      {/* Floor Add Modal */}
      {floorModalOpen && (
        <FloorModal
          blockId={targetBlockId}
          onClose={() => setFloorModalOpen(false)}
          onSaved={() => {
            setFloorModalOpen(false);
            fetchBlocks(selectedHostelId);
          }}
        />
      )}

      {/* Room Add / Edit Modal */}
      {roomModalOpen && (
        <RoomModal
          floorId={targetFloorId}
          initial={editingRoom}
          onClose={() => setRoomModalOpen(false)}
          onSaved={() => {
            setRoomModalOpen(false);
            fetchBlocks(selectedHostelId);
          }}
        />
      )}

      {/* Create Warden Login Modal */}
      {wardenModalOpen && (
        <WardenModal
          hostelId={selectedHostelId}
          hostels={hostels}
          onClose={() => setWardenModalOpen(false)}
          onSaved={() => {
            setWardenModalOpen(false);
            fetchWardens(selectedHostelId);
          }}
        />
      )}
    </div>
  );
}

// ── COMPACT SUBCOMPONENTS & MODALS ──

function CompactMetric({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <div className="mt-1 text-base font-extrabold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function ShiftBadge({ shift }) {
  const s = (shift || "Day").toLowerCase();
  if (s.includes("night")) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-600">
        <Moon className="h-2.5 w-2.5" /> Night Shift
      </span>
    );
  }
  if (s.includes("rotational")) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-amber-600">
        <Clock className="h-2.5 w-2.5" /> Rotational
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-600">
      <Sun className="h-2.5 w-2.5" /> Day Shift
    </span>
  );
}

// Hostel Modal
function HostelModal({ initial, onClose, onSaved }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [status, setStatus] = useState(initial?.status ?? "Active");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Hostel name is required");
    setSubmitting(true);
    try {
      if (initial) {
        await hostelApi.update(initial.id, { name: name.trim(), city, address, status });
        toast.success("Hostel updated successfully");
      } else {
        await hostelApi.create({ name: name.trim(), city, address, status });
        toast.success("Hostel registered successfully");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save hostel");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalLayout title={initial ? "Edit Hostel Details" : "Register New Hostel"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Hostel / Building Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VPPCOE Main Hostel Wing A"
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">City / Location</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Campus address details..."
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Saving..." : initial ? "Save Changes" : "Register Hostel"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Block Modal
function BlockModal({ hostelId, initial, onClose, onSaved }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Block name is required");
    setSubmitting(true);
    try {
      if (initial) {
        await blockApi.update(initial.id, { name: name.trim() });
        toast.success("Block updated");
      } else {
        await blockApi.create({ name: name.trim(), hostelId: Number(hostelId) });
        toast.success("Block created");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save block");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalLayout title={initial ? "Edit Block Name" : "Add Hostel Block / Wing"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Block / Wing Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Block A, Wing 1, Boys Hostel Block"
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Saving..." : initial ? "Save Changes" : "Add Block"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Floor Modal
function FloorModal({ blockId, onClose, onSaved }) {
  const [floorNumber, setFloorNumber] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await floorApi.create({ number: Number(floorNumber), blockId: Number(blockId) });
      toast.success(`Floor ${floorNumber} added`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add floor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalLayout title="Add Floor to Block" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Floor Number</label>
          <input
            type="number"
            min={0}
            required
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
            placeholder="e.g. 1, 2, 3"
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Adding..." : "Add Floor"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Smart Room Modal (Supports Single or Batch Multi-Room creation!)
function RoomModal({ floorId, initial, onClose, onSaved }) {
  const [numberInput, setNumberInput] = useState(initial?.number ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity ?? 3);
  const [rent, setRent] = useState(initial?.rent ?? 5000);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawVal = numberInput.toString().trim();
    if (!rawVal) return toast.error("Room number is required");

    setSubmitting(true);
    try {
      if (initial) {
        // Single Edit
        await roomApi.update(initial.id, {
          number: rawVal,
          capacity: Number(capacity),
          rent: Number(rent)
        });
        toast.success("Room updated");
      } else {
        // Multi-room parsing (e.g. "101, 102, 103" or "101-105")
        let roomNumbers = [];
        if (rawVal.includes(",")) {
          roomNumbers = rawVal.split(",").map((s) => s.trim()).filter(Boolean);
        } else if (rawVal.includes("-") && !isNaN(rawVal.split("-")[0]) && !isNaN(rawVal.split("-")[1])) {
          const [start, end] = rawVal.split("-").map(Number);
          for (let i = start; i <= end; i++) roomNumbers.push(String(i));
        } else {
          roomNumbers = [rawVal];
        }

        let createdCount = 0;
        for (const num of roomNumbers) {
          await roomApi.create({
            number: num,
            floorId: Number(floorId),
            capacity: Number(capacity),
            rent: Number(rent)
          });
          createdCount++;
        }

        toast.success(createdCount > 1 ? `${createdCount} rooms created successfully` : `Room ${roomNumbers[0]} created with beds`);
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalLayout title={initial ? "Edit Room Details" : "Add Room & Student Capacity"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Room Number(s) / ID
          </label>
          <input
            required
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            placeholder={initial ? "e.g. 101" : "e.g. 101 or 101, 102, 103 or 101-105"}
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          />
          {!initial && (
            <p className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3 text-primary shrink-0" />
              Enter a single room (101) or multiple comma-separated (101, 102, 103) or range (101-105) to batch create.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Student Capacity (Beds)</label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Monthly Rent (₹)</label>
            <input
              type="number"
              min={0}
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Saving..." : initial ? "Save Changes" : "Create Room(s)"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Warden Login Creation Modal
function WardenModal({ hostelId, hostels, onClose, onSaved }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [shift, setShift] = useState("Day");
  const [selectedHostelId, setSelectedHostelId] = useState(hostelId || hostels[0]?.id || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      return toast.error("Please fill all required fields");
    }
    setSubmitting(true);
    try {
      await wardenApi.create({
        email: email.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        phone: phone.trim() || "+91 98000 00000",
        hostelId: Number(selectedHostelId),
        shift
      });
      toast.success(`Warden account created for ${fullName}`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create warden login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalLayout title="Create Warden Login Credentials" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Hostel Assignment</label>
          <select
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          >
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} {h.city ? `— ${h.city}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Warden Full Name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Sharma"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Email / Username</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warden@hostel.edu"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Shift Details</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
            >
              <option value="Day">Day Shift (08:00 - 16:00)</option>
              <option value="Night">Night Shift (16:00 - 00:00)</option>
              <option value="Rotational">Rotational Shift</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Login Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set password"
              className="w-full rounded-lg border border-border bg-background py-1.5 pl-3 pr-9 text-xs outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white">
            {submitting ? "Creating..." : "Create Warden Account"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Modal Container
function ModalLayout({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export { Route };
