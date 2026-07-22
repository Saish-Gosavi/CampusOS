interface Props {
  status: string;
}

const MAP: Record<string, { bg: string; fg: string }> = {
  "In Stock": { bg: "#22C55E1A", fg: "#16A34A" },
  Approved: { bg: "#22C55E1A", fg: "#16A34A" },
  Returned: { bg: "#22C55E1A", fg: "#16A34A" },
  Inspected: { bg: "#22C55E1A", fg: "#16A34A" },
  Fulfilled: { bg: "#22C55E1A", fg: "#16A34A" },
  Received: { bg: "#2563EB1A", fg: "#1e40af" },
  Borrowed: { bg: "#2563EB1A", fg: "#1e40af" },
  "Pending Inspection": { bg: "#EAB3081A", fg: "#B45309" },
  Pending: { bg: "#EAB3081A", fg: "#B45309" },
  "Low Stock": { bg: "#EAB3081A", fg: "#B45309" },
  Medium: { bg: "#EAB3081A", fg: "#B45309" },
  Low: { bg: "#3B82F61A", fg: "#1D4ED8" },
  High: { bg: "#EF44441A", fg: "#DC2626" },
  Overdue: { bg: "#EF44441A", fg: "#DC2626" },
  Rejected: { bg: "#EF44441A", fg: "#DC2626" },
  "Out of Stock": { bg: "#EF44441A", fg: "#DC2626" },
};

export function InventoryStatusPill({ status }: Props) {
  const { bg, fg } = MAP[status] ?? { bg: "#6B72801A", fg: "#4B5563" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fg }} />
      {status}
    </span>
  );
}
