"use client";

import { useEffect, useMemo } from "react";

export type ReceiptData = {
  id: string;
  studentName: string;
  studentId: string;
  programme: string;

  amount: string;
  status: "Approved" | "Pending" | "Failed";
  dateTime: string;
  paymentMethod: string;
  description: string;

  address: string;
  whatsapp: string;
  email: string;

  siteUrl: string;
};

export default function ReceiptModal({
  open,
  onClose,
  receipt,
}: {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const statusTone = useMemo(() => {
    if (!receipt) return "text-slate-600";
    if (receipt.status === "Approved") return "text-emerald-700";
    if (receipt.status === "Pending") return "text-amber-700";
    return "text-red-700";
  }, [receipt]);

  if (!open || !receipt) return null;

  function downloadReceipt() {
    // Simple print-to-PDF style download
    const printContents = document.getElementById("receipt-print")?.innerHTML;
    if (!printContents) return;

    const w = window.open("", "PRINT", "height=700,width=900");
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>Receipt ${receipt?.id}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; margin: 20px; color: #0f172a; }
            .page { max-width: 860px; margin: 0 auto; }
            .muted { color: #64748b; }
            .hr { height: 1px; background: #e5e7eb; margin: 16px 0; }
            .top { display:flex; justify-content:space-between; align-items:flex-start; }
            .brand { display:flex; gap:10px; align-items:center; }
            .logo { width:34px; height:34px; background:#0b2b43; border-radius:8px; }
            .big { font-size: 28px; font-weight: 800; }
            .label { font-size: 12px; font-weight: 700; color:#475569; }
            .value { font-size: 13px; font-weight: 600; }
            .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .box { padding: 12px; border: 1px solid #e5e7eb; border-radius: 12px; }
            @media print {
              button { display:none; }
            }
          </style>
        </head>
        <body>
          <div class="page">${printContents}</div>
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-start justify-center p-3 md:p-8">
        <div className="w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* header */}
          <div className="flex items-center justify-between bg-[var(--navy)] px-5 py-4">
            <div className="text-sm font-semibold text-white">Receipt</div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadReceipt}
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
              >
                Download
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* body (scrollable like screenshot) */}
          <div className="max-h-[80vh] overflow-auto bg-slate-50 p-4 md:p-6">
            <div
              id="receipt-print"
              className="mx-auto max-w-[820px] rounded-2xl border border-[var(--border)] bg-white p-6"
            >
              {/* receipt content */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[var(--navy)]" />
                  <div className="leading-tight">
                    <div className="text-sm font-bold tracking-wide">BONNY</div>
                    <div className="text-[11px] text-slate-500">
                      VOCATIONAL CENTER
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-sky-700">
                    {receipt.siteUrl}
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">
                    {receipt.amount}
                  </div>
                  <div className={`mt-1 text-sm font-semibold ${statusTone}`}>
                    {receipt.status}
                  </div>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-200" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Info label="Student name" value={receipt.studentName} />
                <Info label="Student ID" value={receipt.studentId} />
                <Info label="Intake programme" value={receipt.programme} />
                <div className="hidden md:block" />
              </div>

              <div className="my-5 h-px bg-slate-200" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Info label="Date & Time" value={receipt.dateTime} />
                <Info label="Payment method" value={receipt.paymentMethod} />
                <Info label="Description" value={receipt.description} />
                <Info label="Receipt No." value={receipt.id} />
              </div>

              <div className="mt-6 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Address:</div>
                <div className="mt-1">{receipt.address}</div>

                <div className="mt-3">
                  <span className="font-semibold text-slate-900">
                    WhatsApp:
                  </span>{" "}
                  {receipt.whatsapp}
                </div>
                <div className="mt-2">
                  <span className="font-semibold text-slate-900">Email:</span>{" "}
                  {receipt.email}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-semibold text-slate-900">
                  follow us
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="h-6 w-6 rounded bg-slate-100 ring-1 ring-[var(--border)]" />
                  <span className="h-6 w-6 rounded bg-slate-100 ring-1 ring-[var(--border)]" />
                  <span className="h-6 w-6 rounded bg-slate-100 ring-1 ring-[var(--border)]" />
                  <span className="h-6 w-6 rounded bg-slate-100 ring-1 ring-[var(--border)]" />
                </div>
              </div>

              {/* optional duplicate block like screenshot (some portals show two copies) */}
              <div className="my-8 h-px bg-slate-200" />
              <div className="text-xs font-semibold text-slate-500">
                Copy for Student
              </div>
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-white p-4">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    {receipt.studentName} — {receipt.studentId}
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    {receipt.amount}
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {receipt.description} • {receipt.dateTime}
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] bg-white px-5 py-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
