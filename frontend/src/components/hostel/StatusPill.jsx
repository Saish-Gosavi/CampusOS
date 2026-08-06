const MAP = {
  Active: { bg: "#22C55E1A", fg: "#16A34A" },
  Available: { bg: "#22C55E1A", fg: "#16A34A" },
  Paid: { bg: "#22C55E1A", fg: "#16A34A" },
  Resolved: { bg: "#22C55E1A", fg: "#16A34A" },
  Published: { bg: "#22C55E1A", fg: "#16A34A" },
  Pending: { bg: "#EAB3081A", fg: "#B45309" },
  "On Leave": { bg: "#EAB3081A", fg: "#B45309" },
  "In Progress": { bg: "#3B82F61A", fg: "#1D4ED8" },
  Draft: { bg: "#6B72801A", fg: "#4B5563" },
  Scheduled: { bg: "#3B82F61A", fg: "#1D4ED8" },
  Occupied: { bg: "#7B4CED1A", fg: "#7B4CED" },
  Maintenance: { bg: "#EAB3081A", fg: "#B45309" },
  Overdue: { bg: "#EF44441A", fg: "#DC2626" },
  Open: { bg: "#EF44441A", fg: "#DC2626" },
  Alumni: { bg: "#6B72801A", fg: "#4B5563" },
  High: { bg: "#EF44441A", fg: "#DC2626" },
  Medium: { bg: "#EAB3081A", fg: "#B45309" },
  Low: { bg: "#3B82F61A", fg: "#1D4ED8" },
  Reserved: { bg: "#3B82F61A", fg: "#1D4ED8" },
  Closed: { bg: "#6B72801A", fg: "#4B5563" },
  Approved: { bg: "#22C55E1A", fg: "#16A34A" },
  Rejected: { bg: "#EF44441A", fg: "#DC2626" },
  "Checked-In": { bg: "#3B82F61A", fg: "#1D4ED8" },
  "Checked-Out": { bg: "#6B72801A", fg: "#4B5563" },
  Expired: { bg: "#6B72801A", fg: "#4B5563" },
  Inside: { bg: "#22C55E1A", fg: "#16A34A" },
  Outside: { bg: "#3B82F61A", fg: "#1D4ED8" },
  Returned: { bg: "#6B72801A", fg: "#4B5563" },
  "Late Return": { bg: "#EAB3081A", fg: "#B45309" },
  Good: { bg: "#22C55E1A", fg: "#16A34A" },
  Fair: { bg: "#EAB3081A", fg: "#B45309" },
  Damaged: { bg: "#EF44441A", fg: "#DC2626" },
  "In Use": { bg: "#22C55E1A", fg: "#16A34A" },
  "In Storage": { bg: "#6B72801A", fg: "#4B5563" },
  Assigned: { bg: "#7B4CED1A", fg: "#7B4CED" },
  "Under Maintenance": { bg: "#EAB3081A", fg: "#B45309" },
  Replaced: { bg: "#3B82F61A", fg: "#1D4ED8" },
  Retired: { bg: "#6B72801A", fg: "#4B5563" }
};
function StatusPill({ status }) {
  const { bg, fg } = MAP[status] ?? { bg: "#6B72801A", fg: "#4B5563" };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0"
      style={{ backgroundColor: bg, color: fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: fg }} />
      {status}
    </span>
  );
}
export {
  StatusPill
};
