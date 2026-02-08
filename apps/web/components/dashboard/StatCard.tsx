import type { Stat } from "lib/data";

export default function StatCard({ stat }: { stat: Stat }) {
  const isNavy = stat.tone === "navy";
  const isDanger = stat.tone === "danger";

  return (
    <div
      className={[
        "rounded-2xl border border-[var(--border)] p-5",
        isNavy ? "bg-[var(--navy)] text-white" : "bg-white",
      ].join(" ")}
    >
      <div className={isNavy ? "text-white/80" : "text-slate-600"}>
        <div className="text-sm font-semibold">{stat.label}</div>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <div className="text-4xl font-extrabold tracking-tight">
          {stat.value}
        </div>

        {stat.subLabel ? (
          <div className={isNavy ? "text-white/70" : "text-slate-500"}>
            <div className="text-sm">{stat.subLabel}</div>
          </div>
        ) : null}
      </div>

      {stat.delta ? (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span
            className={[
              "h-2.5 w-2.5 rounded-sm",
              isDanger ? "bg-[var(--danger)]" : "bg-[var(--accent)]",
            ].join(" ")}
          />
          <span className={isNavy ? "text-white/80" : "text-slate-600"}>
            {stat.delta}
          </span>
        </div>
      ) : null}
    </div>
  );
}
