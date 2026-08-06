import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  CheckCircle2,
  Search,
  Eye,
  Check,
  X,
  FileText,
  Send
} from "lucide-react";
import { feeApi } from "@/services/api";

const Route = createFileRoute("/hostel-admin/fee-management/")({
  component: FeesDashboard
});

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function FeesDashboard() {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, recordsRes] = await Promise.all([
        feeApi.getDashboardStats(),
        feeApi.getAllFeeRecords()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (recordsRes.success) setRecords(recordsRes.data);
    } catch (error) {
      console.error("Failed to fetch fee data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (paymentId) => {
    try {
      await feeApi.verifyPayment(paymentId);
      setVerifyModalOpen(false);
      setSelectedPayment(null);
      fetchData();
    } catch (error) {
      console.error("Failed to verify", error);
      alert("Failed to verify payment");
    }
  };

  const handleReject = async (paymentId) => {
    if (!rejectReason.trim()) {
      alert("Reason is required");
      return;
    }
    try {
      await feeApi.rejectPayment(paymentId, rejectReason);
      setVerifyModalOpen(false);
      setSelectedPayment(null);
      setRejectReason("");
      fetchData();
    } catch (error) {
      console.error("Failed to reject", error);
      alert("Failed to reject payment");
    }
  };

  const printReceipt = (receipt) => {
    alert(`Printing Receipt: ${receipt.receiptNumber}`);
  };

  const handleReleaseReceipt = async (receiptId) => {
    try {
      await feeApi.releaseReceipt(receiptId);
      alert("Receipt released to student successfully. They will see it in their dashboard.");
    } catch (error) {
      console.error("Failed to release receipt", error);
      alert("Failed to release receipt to student");
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "ALL" || r.status.toUpperCase() === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [records, searchTerm, filterStatus]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading fee management data...</div>;
  }

  const collectionRate = stats?.totalFeesCollected && stats?.outstandingFeeAmount
    ? Math.round((stats.totalFeesCollected / (stats.totalFeesCollected + stats.outstandingFeeAmount)) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected Fees"
          value={INR.format(stats?.totalFeesCollected || 0)}
          hint={`${collectionRate}% collection rate`}
          icon={CheckCircle2}
          tint="#22C55E"
        />
        <StatCard
          label="Pending Verification"
          value={stats?.studentsPendingVerification?.toString() || "0"}
          hint="Payments to verify"
          icon={Clock}
          tint="#F59E0B"
        />
        <StatCard
          label="Outstanding Amount"
          value={INR.format(stats?.outstandingFeeAmount || 0)}
          hint={`${stats?.unpaidStudents || 0} students unpaid`}
          icon={AlertTriangle}
          tint="#EF4444"
        />
        <StatCard
          label="Total Students"
          value={(stats?.totalStudents || 0).toString()}
          hint={`${stats?.studentsWhoPaid || 0} paid completely`}
          icon={Users}
          tint="#2563EB"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Student Fee Records</h3>
            <p className="text-xs text-muted-foreground">Manage and verify fee payments</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All Status</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="OVERDUE">Overdue</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="h-10 px-4 align-middle font-medium">Student Name</th>
                <th className="h-10 px-4 align-middle font-medium">Amount</th>
                <th className="h-10 px-4 align-middle font-medium">Due Date</th>
                <th className="h-10 px-4 align-middle font-medium">Status</th>
                <th className="h-10 px-4 align-middle font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.map((fee) => {
                const latestPayment = fee.payments && fee.payments[0];
                const latestReceipt = fee.receipts && fee.receipts[0];

                return (
                  <tr key={fee.id} className="hover:bg-muted/30">
                    <td className="p-4 align-middle font-medium text-foreground">
                      {fee.student?.fullName || "Unknown"}
                    </td>
                    <td className="p-4 align-middle">{INR.format(fee.amount)}</td>
                    <td className="p-4 align-middle">
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <StatusBadge status={fee.status} />
                      {latestPayment?.status === "pending_verification" && (
                        <span className="ml-2 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-800">
                          Review pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        {latestPayment?.status === "pending_verification" && (
                          <button
                            onClick={() => {
                              setSelectedPayment(latestPayment);
                              setVerifyModalOpen(true);
                            }}
                            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            <Eye className="mr-1 h-3 w-3" /> Review
                          </button>
                        )}
                        {latestReceipt && (
                          <>
                            <button
                              onClick={() => printReceipt(latestReceipt)}
                              className="inline-flex h-8 items-center justify-center rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 text-xs font-medium text-[#16A34A] hover:bg-[#22C55E]/20"
                            >
                              <FileText className="mr-1 h-3 w-3" /> Receipt
                            </button>
                            <button
                              onClick={() => handleReleaseReceipt(latestReceipt.id)}
                              className="inline-flex h-8 items-center justify-center rounded-md border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/20"
                            >
                              <Send className="mr-1 h-3 w-3" /> Send to Student
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {verifyModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Verify Payment</h3>
            <div className="mb-4 space-y-3 text-sm">
              <p><span className="font-medium text-muted-foreground">Amount Paid:</span> {INR.format(selectedPayment.amountPaid)}</p>
              <p><span className="font-medium text-muted-foreground">Method:</span> {selectedPayment.paymentMethod}</p>
              <p><span className="font-medium text-muted-foreground">Transaction ID:</span> {selectedPayment.transactionId || "N/A"}</p>
              <p><span className="font-medium text-muted-foreground">Date:</span> {new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>
              {selectedPayment.proofUrl && (
                <div>
                  <a href={selectedPayment.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View Payment Proof
                  </a>
                </div>
              )}
            </div>

            <div className="mb-6 space-y-2">
              <label className="text-xs font-medium text-foreground">Rejection Reason (if rejecting)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Required for rejection..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setVerifyModalOpen(false);
                  setSelectedPayment(null);
                  setRejectReason("");
                }}
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedPayment.id)}
                className="inline-flex items-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </button>
              <button
                onClick={() => handleVerify(selectedPayment.id)}
                className="inline-flex items-center rounded-md bg-[#22C55E] px-4 py-2 text-sm font-medium text-white hover:bg-[#16A34A]"
              >
                <Check className="mr-2 h-4 w-4" /> Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, hint, icon: Icon, tint }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${tint}1a`, color: tint }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    unpaid: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-orange-100 text-orange-800",
    pending_verification: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  const s = status?.toLowerCase() || "unpaid";
  const displayStatus = s.replace("_", " ").toUpperCase();
  
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[s] || styles.unpaid}`}>
      {displayStatus}
    </span>
  );
}

export { Route };
