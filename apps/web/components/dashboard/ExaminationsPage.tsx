"use client";

import { useMemo } from "react";
import { useAuth } from "contexts/AuthContext";

type ExamSchedule = {
  id: string;
  course: string;
  date: string;
  time: string;
  venue: string;
  status: "Scheduled" | "Completed" | "Deferred";
};

const mockExams: ExamSchedule[] = [
  {
    id: "exam-001",
    course: "Advanced Database Systems",
    date: "May 18, 2026",
    time: "09:00 AM",
    venue: "Lab A, Building 3",
    status: "Scheduled",
  },
  {
    id: "exam-002",
    course: "Software Development Lifecycle",
    date: "May 21, 2026",
    time: "02:00 PM",
    venue: "Lecture Hall 4",
    status: "Scheduled",
  },
  {
    id: "exam-003",
    course: "Cloud Computing",
    date: "May 23, 2026",
    time: "11:00 AM",
    venue: "Innovation Lab",
    status: "Deferred",
  },
  {
    id: "exam-004",
    course: "Information Security",
    date: "May 25, 2026",
    time: "03:00 PM",
    venue: "Lecture Hall 2",
    status: "Scheduled",
  },
];

export default function ExaminationsPage() {
  const { user } = useAuth();
  const studentName = user?.name ?? user?.firstname ?? "Student";

  const summary = useMemo(() => {
    const scheduled = mockExams.filter((exam) => exam.status === "Scheduled");
    const completed = mockExams.filter((exam) => exam.status === "Completed");
    return {
      scheduled: scheduled.length,
      completed: completed.length,
      total: mockExams.length,
    };
  }, []);

  return (
    <section className="min-h-screen">
      <div className="mt-5 px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              Exams
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Examination calendar for {studentName}
            </h1>
            <p className="text-sm text-slate-600">
              Keep track of your upcoming assessments and venue details.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          {[
            { label: "Total Exams", value: summary.total },
            { label: "Scheduled", value: summary.scheduled },
            { label: "Completed", value: summary.completed },
          ].map((tile) => (
            <div
              key={tile.label}
              className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {tile.label}
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{tile.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {mockExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {exam.course}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{exam.date}</td>
                    <td className="px-4 py-3 text-slate-700">{exam.time}</td>
                    <td className="px-4 py-3 text-slate-700">{exam.venue}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest",
                          exam.status === "Scheduled"
                            ? "bg-emerald-50 text-emerald-700"
                            : exam.status === "Completed"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
