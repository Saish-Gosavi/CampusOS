import { createFileRoute } from "@/routes/compat";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  UserCog,
  Pencil,
  Trash2,
  Filter,
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
  EyeOff
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
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

  // Active expanded block IDs
  const [expandedBlocks, setExpandedBlocks] = useState({});

  // 1. Fetch All Hostels
  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await hostelApi.getAll();
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
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
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setBlocks(list);

      // Auto expand first block if none expanded
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
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
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
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Hostel & Hierarchy Management"
        description="Configure hostel blocks, floors, rooms, student capacities, and warden logins."
        icon={Building2}
        tint="#2563EB"
        breadcrumbs={[{ label: "Hostel Management" }]}
        action={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditingHostel(null);
                setHostelModalOpen(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Add Hostel
            </Button>
            <Button
              onClick={() => setWardenModalOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <UserPlus className="h-4 w-4 text-purple-600" /> Create Warden Login
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading hostel records...</span>
        </div>
      ) : hostels.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-bold text-foreground">No Hostels Registered Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Get started by registering your institute's first hostel building.
          </p>
          <Button onClick={() => setHostelModalOpen(true)} className="mt-2">
            <Plus className="mr-1.5 h-4 w-4" /> Register Hostel
          </Button>
        </div>
      ) : (
        <>
          {/* Hostel Switcher & Overview Header */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Select Active Hostel:
                    </label>
                    <StatusPill status={activeHostel?.status || "Active"} />
                  </div>
                  <select
                    value={selectedHostelId}
                    onChange={(e) => setSelectedHostelId(e.target.value)}
                    className="mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-base font-bold text-foreground outline-none focus:border-primary"
                  >
                    {hostels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} {h.city ? `— ${h.city}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingHostel(activeHostel);
                    setHostelModalOpen(true);
                  }}
                  className="gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Hostel Details
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteHostel(selectedHostelId)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>

            {/* Hostel KPI Metrics */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 border-t border-border pt-4">
              <KPIItem label="Blocks / Wings" value={hostelStats.blocksCount} icon={Building2} color="#2563EB" />
              <KPIItem label="Total Floors" value={hostelStats.floorsCount} icon={Layers} color="#7B4CED" />
              <KPIItem label="Total Rooms" value={hostelStats.roomsCount} icon={DoorClosed} color="#0D9488" />
              <KPIItem label="Student Capacity" value={hostelStats.totalCapacity} icon={Bed} color="#EAB308" />
              <KPIItem label="Occupied Beds" value={hostelStats.totalOccupied} icon={Shield} color="#EA580C" />
              <KPIItem label="Available Beds" value={hostelStats.totalAvailable} icon={Bed} color="#22C55E" />
            </div>
          </div>

          {/* Section Split: Blocks & Room Hierarchy vs Wardens */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Block -> Floor -> Room Hierarchy */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Blocks, Floors & Rooms Layout
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage building blocks, floors, room student capacities, and rent.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingBlock(null);
                    setBlockModalOpen(true);
                  }}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add Block / Wing
                </Button>
              </div>

              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-10 text-center">
                  <Layers className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">No Blocks Configured for this Hostel</p>
                  <p className="text-xs text-muted-foreground">
                    Create a block (e.g. "Wing A", "Block 1") to start adding floors and rooms.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingBlock(null);
                      setBlockModalOpen(true);
                    }}
                    className="mt-2"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Add First Block
                  </Button>
                </div>
              ) : (
                blocks.map((block) => {
                  const isExpanded = !!expandedBlocks[block.id];
                  const floors = block.floors || [];

                  // Calculate block capacity
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
                      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all"
                    >
                      {/* Block Header */}
                      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3.5">
                        <div
                          className="flex items-center gap-3 cursor-pointer select-none"
                          onClick={() => toggleBlockExpand(block.id)}
                        >
                          <span className="text-muted-foreground hover:text-foreground">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                              {block.name}
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                {floors.length} Floors · {blockRoomsCount} Rooms
                              </span>
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Capacity: {blockCap} Beds · Occupied: {blockOcc} · Available: {Math.max(0, blockCap - blockOcc)}
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
                            className="h-8 text-xs gap-1"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Floor
                          </Button>
                          <button
                            onClick={() => {
                              setEditingBlock(block);
                              setBlockModalOpen(true);
                            }}
                            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                            title="Edit Block"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600"
                            title="Delete Block"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Floors & Rooms */}
                      {isExpanded && (
                        <div className="p-5 flex flex-col gap-5 bg-background/50">
                          {floors.length === 0 ? (
                            <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                              No floors added to {block.name} yet. Click "Add Floor" above.
                            </div>
                          ) : (
                            floors.map((floor) => {
                              const rooms = floor.rooms || [];
                              return (
                                <div
                                  key={floor.id}
                                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                                >
                                  <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="grid h-7 w-7 place-items-center rounded-md bg-purple-500/10 text-xs font-bold text-purple-700">
                                        F{floor.number}
                                      </span>
                                      <h4 className="text-sm font-semibold text-foreground">
                                        Floor {floor.number}
                                      </h4>
                                      <span className="text-xs text-muted-foreground">
                                        ({rooms.length} Rooms)
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
                                        className="h-7 text-xs gap-1 px-2.5"
                                      >
                                        <Plus className="h-3.5 w-3.5" /> Add Room
                                      </Button>
                                      <button
                                        onClick={() => handleDeleteFloor(floor.id)}
                                        className="text-xs text-red-500 hover:underline"
                                      >
                                        Delete Floor
                                      </button>
                                    </div>
                                  </div>

                                  {rooms.length === 0 ? (
                                    <p className="text-xs text-muted-foreground py-2 text-center">
                                      No rooms on Floor {floor.number}. Click "Add Room" to create rooms and set student capacity.
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                                      {rooms.map((room) => {
                                        const beds = room.beds || [];
                                        const roomOcc = beds.filter((b) => b.allocations && b.allocations.length > 0).length;
                                        const roomCap = room.capacity || beds.length || 1;
                                        const occPct = Math.round((roomOcc / roomCap) * 100);

                                        return (
                                          <div
                                            key={room.id}
                                            className="rounded-lg border border-border bg-background p-3 hover:border-primary/50 transition"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm font-bold text-foreground">
                                                Room {room.number}
                                              </span>
                                              <div className="flex items-center gap-1">
                                                <button
                                                  onClick={() => {
                                                    setTargetFloorId(floor.id);
                                                    setEditingRoom(room);
                                                    setRoomModalOpen(true);
                                                  }}
                                                  className="text-muted-foreground hover:text-foreground"
                                                  title="Edit Room"
                                                >
                                                  <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteRoom(room.id)}
                                                  className="text-muted-foreground hover:text-red-600"
                                                  title="Delete Room"
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                              <span>Student Capacity:</span>
                                              <span className="font-semibold text-foreground">
                                                {roomCap} Beds
                                              </span>
                                            </div>

                                            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                              <span>Occupancy:</span>
                                              <span className="font-medium text-foreground">
                                                {roomOcc} / {roomCap} ({occPct}%)
                                              </span>
                                            </div>

                                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                              <div
                                                className="h-full rounded-full"
                                                style={{
                                                  width: `${Math.min(100, occPct)}%`,
                                                  backgroundColor:
                                                    occPct >= 100 ? "#EF4444" : occPct > 0 ? "#22C55E" : "#94A3B8"
                                                }}
                                              />
                                            </div>

                                            {room.rent > 0 && (
                                              <p className="mt-2 text-right text-[11px] font-medium text-muted-foreground">
                                                ₹{Number(room.rent).toLocaleString()} / month
                                              </p>
                                            )}
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

            {/* Right Column: Warden Logins & Shifts */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-purple-600" />
                      Assigned Wardens
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Warden user accounts with day/night shift assignments.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setWardenModalOpen(true)}
                    className="h-8 text-xs gap-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Add Warden
                  </Button>
                </div>

                {wardens.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                    No warden logins created for this hostel yet. Click "Add Warden" to generate warden credentials.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {wardens.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-purple-600 text-xs font-bold text-white">
                            {w.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </span>
                          <div>
                            <div className="font-semibold text-sm text-foreground">{w.fullName}</div>
                            <div className="text-xs text-muted-foreground">{w.user?.email}</div>
                            <div className="mt-1 flex items-center gap-2">
                              <ShiftBadge shift={w.shift} />
                              <span className="text-[11px] text-muted-foreground">📞 {w.phone}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteWarden(w.id)}
                          className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                          title="Remove Warden"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* ── MODALS ── */}

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

// ── SUBCOMPONENTS & MODALS ──

function KPIItem({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="mt-1.5 text-xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function ShiftBadge({ shift }) {
  const s = (shift || "Day").toLowerCase();
  if (s.includes("night")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
        <Moon className="h-3 w-3" /> Night Shift
      </span>
    );
  }
  if (s.includes("rotational")) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
        <Clock className="h-3 w-3" /> Rotational Shift
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
      <Sun className="h-3 w-3" /> Day Shift
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Hostel / Building Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VPPCOE Main Hostel Wing A"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">City / Location</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
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
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Block / Wing Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Block A, Wing 1, Boys Hostel Block"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Floor Number</label>
          <input
            type="number"
            min={0}
            required
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
            placeholder="e.g. 1, 2, 3"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Floor"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Room Modal
function RoomModal({ floorId, initial, onClose, onSaved }) {
  const [number, setNumber] = useState(initial?.number ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity ?? 3);
  const [rent, setRent] = useState(initial?.rent ?? 5000);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!number.toString().trim()) return toast.error("Room number is required");
    setSubmitting(true);
    try {
      if (initial) {
        await roomApi.update(initial.id, {
          number: number.toString().trim(),
          capacity: Number(capacity),
          rent: Number(rent)
        });
        toast.success("Room updated");
      } else {
        await roomApi.create({
          number: number.toString().trim(),
          floorId: Number(floorId),
          capacity: Number(capacity),
          rent: Number(rent)
        });
        toast.success("Room created with beds");
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Room Number / ID</label>
          <input
            required
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g. 101, 102A"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Student Capacity (Beds)</label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
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
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : initial ? "Save Changes" : "Create Room"}
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Hostel Assignment</label>
          <select
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} {h.city ? `— ${h.city}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Warden Full Name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Sharma"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Email / Login Username</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warden@hostel.edu"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Shift Details</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
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
              placeholder="Set login password for warden"
              className="w-full rounded-lg border border-border bg-background py-2 pl-3 pr-10 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700 text-white">
            {submitting ? "Creating..." : "Create Warden Account"}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Helper Layout Modal
function ModalLayout({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
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
