"use client";

import { useRouter } from "next/navigation";
import StatCard from "./StatCard";
import CourseCard from "./CourseCard";
import TransactionsTable from "./TransactionsTable";
import { courses, stats, transactions } from "lib/data";
import { useAuth } from "contexts/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();
    const displayName = user?.firstname ?? user?.name ?? "Student";
    const email = user?.email ?? "student@bvcbonny.edu.ng";
    const studentId = user?.openId ?? user?.username ?? "—";
    const roleLabel = user?.role ? user.role.toUpperCase() : "STUDENT";
    const router = useRouter();

  return (
    <>
      <div className="mt-5 space-y-2">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back, <span className="text-slate-700">{displayName}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>Student ID: {studentId}</span>
          <span className="hidden sm:inline">Email: {email}</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600">
            {roleLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">
                Master of Information Technology (MIT)
              </h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Enrolled
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">First Semester</p>
          </div>

                    <button
                        type="button"
                        className="w-full rounded-lg bg-[#c7a37a] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 md:w-auto"
                        onClick={() => router.push("/dashboard/classroom")}
                    >
                        Go to Class
                    </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <CourseCard key={c.code} course={c} />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <div className="mt-4">
          <TransactionsTable rows={transactions} />
        </div>
      </section>
    </>
  );
}
