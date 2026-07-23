const MAP = {
  Available: { bg: "#22C55E1A", fg: "#16A34A" },
  Returned: { bg: "#22C55E1A", fg: "#16A34A" },
  Paid: { bg: "#22C55E1A", fg: "#16A34A" },
  Cataloged: { bg: "#22C55E1A", fg: "#16A34A" },
  Approved: { bg: "#22C55E1A", fg: "#16A34A" },
  New: { bg: "#22C55E1A", fg: "#16A34A" },
  Good: { bg: "#3B82F61A", fg: "#1D4ED8" },
  Issued: { bg: "#0D94881A", fg: "#0D9488" },
  Received: { bg: "#0D94881A", fg: "#0D9488" },
  Ready: { bg: "#0D94881A", fg: "#0D9488" },
  Reserved: { bg: "#7B4CED1A", fg: "#7B4CED" },
  Pending: { bg: "#EAB3081A", fg: "#B45309" },
  Maintenance: { bg: "#EAB3081A", fg: "#B45309" },
  Waived: { bg: "#6B72801A", fg: "#4B5563" },
  Cancelled: { bg: "#6B72801A", fg: "#4B5563" },
  Damaged: { bg: "#EF44441A", fg: "#DC2626" },
  Overdue: { bg: "#EF44441A", fg: "#DC2626" },
  Rejected: { bg: "#EF44441A", fg: "#DC2626" },
  "Out of Stock": { bg: "#EF44441A", fg: "#DC2626" }
};
function LibraryStatusPill({ status }) {
  const { bg, fg } = MAP[status] ?? { bg: "#6B72801A", fg: "#4B5563" };
  return <span
    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
    style={{ backgroundColor: bg, color: fg }}
  >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fg }} />
      {status}
    </span>;
}
export {
  LibraryStatusPill
};
