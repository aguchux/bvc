"use client";

import { useRouter } from "next/navigation";
import StatCard from "./StatCard";
import CourseCard from "./CourseCard";
import TransactionsTable from "./TransactionsTable";
import { stats, transactions } from "lib/data";
import { useAuth } from "contexts/AuthContext";
import { useListCoursesQuery } from "store/apis/course.api";
import { useMemo } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.firstname ?? user?.name ?? "Student";
  const email = user?.email ?? "student@bvcbonny.edu.ng";
  const studentId = user?.openId ?? user?.username ?? "—";
  const roleLabel = user?.role ? user.role.toUpperCase() : "STUDENT";
  const router = useRouter();

  const { data: courseRespsonse, error, isLoading } = useListCoursesQuery();

  const courses = useMemo(() => {
    if (courseRespsonse?.courses) {
      return courseRespsonse.courses;
    }
    return [];
  }, [courseRespsonse]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section className="grid gap-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm md:grid-cols-2 md:items-end animate-pulse">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              Dashboard Courses
            </p>
            <h1 className="h-8 w-1/2 rounded bg-slate-200" />
            <p className="h-4 w-full rounded bg-slate-200" />
          </div>
          <div className="space-y-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Enrolled courses
            </p>
            <p className="h-8 w-1/3 rounded bg-slate-200" />
            <p className="h-4 w-full rounded bg-slate-200" />
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
            Error loading courses
          </div>
        </section>
      </main>
    );
  }

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
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
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
