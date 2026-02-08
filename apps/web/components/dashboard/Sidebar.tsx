"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", url: "/dashboard" },
  { label: "Courses", url: "/dashboard/courses" },
  { label: "Results", url: "/dashboard/results" },
  { label: "Payments", url: "/dashboard/payments" },
  { label: "Deferments", url: "/dashboard/deferments" },
  { label: "Manage Exams", url: "/dashboard/examinations" },
];

const isActiveRoute = (pathname: string, url: string) =>
  pathname === url || pathname.startsWith(`${url}/`);

export default function Sidebar() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="sticky top-0 flex h-screen flex-col border-r border-[var(--border)] bg-white px-4 py-5">
      <div className="flex items-center gap-2 px-2">
        <div className="h-9 w-9 rounded-lg bg-[var(--navy)]" />
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-wide">BVC</div>
          <div className="text-xs text-slate-500">Bonny Vocational Center</div>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.url);
          return (
            <Link
              key={item.label}
              href={item.url}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-[var(--navy)] p-4 text-white">
        <div className="text-sm font-semibold">Help Center</div>
        <p className="mt-1 text-xs text-white/80">
          Having Trouble? Please contact us for more questions.
        </p>
        <div className="mt-3 inline-flex items-center rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold">
          +234 816 8*** ****
        </div>
      </div>
    </div>
  );
}
