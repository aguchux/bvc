import type { Txn } from "lib/data";

function pill(status: Txn["status"]) {
  if (status === "Paid") return "bg-emerald-50 text-emerald-700";
  if (status === "Pending") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export default function TransactionsTable({ rows }: { rows: Txn[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <div className="bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3">Date</div>
          <div className="col-span-5">Description</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
        </div>
      </div>

      <div className="bg-white">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-2 border-t border-[var(--border)] px-4 py-4 text-sm"
          >
            <div className="col-span-3 text-slate-700">{r.date}</div>
            <div className="col-span-5 text-slate-700">{r.description}</div>
            <div className="col-span-2 font-semibold text-slate-800">
              {r.amount}
            </div>
            <div className="col-span-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${pill(r.status)}`}
              >
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
