"use client";

import { useMemo, useState } from "react";
import ReceiptModal, { ReceiptData } from "components/payments/ReceiptModal";
import { useAuth } from "contexts/AuthContext";

type PaymentStatus = "Paid" | "Pending" | "Failed";

type PaymentRow = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: PaymentStatus;
  receiptUrl?: string; // simulate receipt link
};

const allPayments: PaymentRow[] = [
  {
    id: "pmt_001",
    date: "13 Oct 2025",
    description: "Installment 1",
    amount: "₦250,000",
    status: "Paid",
    receiptUrl: "#receipt-pmt_001",
  },
  {
    id: "pmt_002",
    date: "10 Nov 2025",
    description: "Installment 2",
    amount: "₦250,000",
    status: "Paid",
    receiptUrl: "#receipt-pmt_002",
  },
  {
    id: "pmt_003",
    date: "15 Dec 2025",
    description: "Installment 3",
    amount: "₦250,000",
    status: "Pending",
  },
  {
    id: "pmt_004",
    date: "21 Jan 2026",
    description: "Late Fee",
    amount: "₦10,000",
    status: "Failed",
  },
];

function statusPill(status: PaymentStatus) {
  if (status === "Paid") return "bg-emerald-50 text-emerald-700";
  if (status === "Pending") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export default function PaymentsPage() {
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const totalPages = Math.max(1, Math.ceil(allPayments.length / pageSize));

  const pageRows = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return allPayments.slice(start, end);
  }, [page, pageSize, totalPages]);

  const due = useMemo(() => {
    // Simulate due installment: first Pending row, else none
    const next = allPayments.find((p) => p.status === "Pending");
    return next
      ? { amount: next.amount, dueDate: "-" }
      : { amount: "₦0", dueDate: "-" };
  }, []);

  function goToPage(p: number) {
    const next = Math.min(Math.max(p, 1), totalPages);
    setPage(next);
  }

  function onMakePayment() {
    // replace with your payment flow
    alert("Simulated: Launch payment flow");
  }

  function onViewReceipt(row: PaymentRow) {
    // simulate receipt data derived from a payment row
    const r: ReceiptData = {
      id: row.id,
      studentName: "Opuada Benstowe",
      studentId: "301828462",
      programme: "Master of Information Technology (MIT)",
      amount: row.amount,
      status: row.status === "Paid" ? "Approved" : row.status,
      dateTime: `${row.date}, 04:28 pm`,
      paymentMethod: "Online",
      description: row.description,
      address: "Plot 1059, O.P Fingesi Street, Utako, FCT, Abuja.",
      whatsapp: "+234 9132 300 000",
      email: "admissions@bvc.edu.ng",
      siteUrl: "https://bvc.edu.ng",
    };

    setReceipt(r);
    setReceiptOpen(true);
  }

  const { user } = useAuth();
  const displayName = user?.firstname ?? user?.name ?? "Student";

  return (
    <>
      <div className="mt-5">
        <h1 className="text-xl font-semibold text-slate-900">Payments</h1>
        <p className="text-sm text-slate-600">
          Hi {displayName}, here’s a quick view of your recent payment activity.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-400/60 bg-emerald-50 px-5 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-slate-700">
              Your next installment is due on
            </div>
            <div className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              {due.amount}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-700">
                Due Date
              </div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                {due.dueDate}
              </div>
            </div>

            <button
              onClick={onMakePayment}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Make Payment
            </button>
          </div>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <div className="bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-3">Date</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-2">Status</div>
            </div>
          </div>

          <div className="bg-white">
            {pageRows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 items-center gap-2 border-t border-[var(--border)] px-4 py-4 text-sm"
              >
                <div className="col-span-3 text-slate-700">{r.date}</div>
                <div className="col-span-4 text-slate-700">{r.description}</div>
                <div className="col-span-3 font-semibold text-slate-800">
                  {r.amount}
                </div>
                <div className="col-span-2 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusPill(
                      r.status,
                    )}`}
                  >
                    {r.status}
                  </span>

                  {r.status === "Paid" ? (
                    <button
                      onClick={() => onViewReceipt(r)}
                      className="text-xs font-semibold text-sky-700 hover:underline"
                    >
                      View Receipt
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-4 border-t border-[var(--border)] px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  disabled={page <= 1}
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => goToPage(page - 1)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  disabled={page <= 1}
                >
                  {"<"}
                </button>

                <div className="min-w-[44px] rounded-lg border border-slate-400 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-800">
                  {page}
                </div>

                <button
                  onClick={() => goToPage(page + 1)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  disabled={page >= totalPages}
                >
                  {">"}
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  disabled={page >= totalPages}
                >
                  {">>"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 text-sm text-slate-700">
                <span className="font-semibold">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="font-semibold">per page</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReceiptModal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        receipt={receipt}
      />
    </>
  );
}
