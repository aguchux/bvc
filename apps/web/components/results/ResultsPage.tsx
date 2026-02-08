"use client";

import { useMemo, useState } from "react";
import { useAuth } from "contexts/AuthContext";

type ResultRow = {
  code: string;
  title: string;
  unit: number;
  score?: number | null;
  grade?: string | null;
  gradePoint?: number | null;
};

type SemesterBlock = {
  name: string;
  rows: ResultRow[];
};

type SessionOption = {
  id: string;
  label: string; // e.g. "100 level"
  semesters: SemesterBlock[];
};

const sessions: SessionOption[] = [
  {
    id: "100",
    label: "100 level",
    semesters: [
      {
        name: "First Semester",
        rows: [
          {
            code: "MIT 8103",
            title: "Advanced Database Systems",
            unit: 3,
            score: null,
            grade: null,
            gradePoint: null,
          },
          {
            code: "MIT 8113",
            title: "Digital Transformation and Innovation",
            unit: 3,
            score: null,
            grade: null,
            gradePoint: null,
          },
          {
            code: "MIT 8111",
            title: "Ethics and Legal Issues in IT",
            unit: 3,
            score: null,
            grade: null,
            gradePoint: null,
          },
          {
            code: "MIT 8101",
            title: "Information Technology Management",
            unit: 3,
            score: null,
            grade: null,
            gradePoint: null,
          },
          {
            code: "MIT 8105",
            title: "Network Architecture and Protocols",
            unit: 3,
            score: null,
            grade: null,
            gradePoint: null,
          },
          {
            code: "MIT 8107",
            title: "Software Development Lifecycle",
            unit: 3,
            score: null,
            grade: null,
            gradePoint: null,
          },
        ],
      },
    ],
  },
  {
    id: "200",
    label: "200 level",
    semesters: [
      {
        name: "First Semester",
        rows: [
          {
            code: "MIT 8201",
            title: "Cloud Computing",
            unit: 3,
            score: 78,
            grade: "A",
            gradePoint: 5,
          },
          {
            code: "MIT 8203",
            title: "Information Security",
            unit: 3,
            score: 64,
            grade: "B",
            gradePoint: 4,
          },
        ],
      },
    ],
  },
];

function StatCard({
  label,
  value,
  meta,
  tone,
}: {
  label: string;
  value: string;
  meta?: string;
  tone?: "default" | "navy";
}) {
  const navy = tone === "navy";
  return (
    <div
      className={[
        "rounded-2xl border border-[var(--border)] p-5",
        navy ? "bg-[var(--navy)] text-white" : "bg-white",
      ].join(" ")}
    >
      <div className={navy ? "text-white/80" : "text-slate-600"}>
        <div className="text-sm font-semibold">{label}</div>
      </div>

      <div className="mt-3 text-4xl font-extrabold tracking-tight">{value}</div>

      {meta ? (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
          <span className={navy ? "text-white/80" : "text-slate-600"}>
            {meta}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default function ResultsPage() {
  const [sessionId, setSessionId] = useState<string>(sessions[0]?.id ?? "");

  const selected = useMemo(
    () => sessions.find((s) => s.id === sessionId) ?? sessions[0],
    [sessionId],
  );

  const flatRows = useMemo(() => {
    return selected?.semesters.flatMap((s) => s.rows);
  }, [selected]);

  // Simulated summary numbers like screenshot (some show "-" when not computed)
  const summary = useMemo(() => {
    const hasGrades = flatRows?.some((r) => r.gradePoint != null);
    if (!hasGrades) {
      return {
        lastGpa: "–",
        completedUnits: "–",
        cgpa: "–",
        deltaLast: "↑ 20% vs last session",
        deltaCgpa: "↑ 0% vs last session",
      };
    }

    const completedUnits =
      flatRows?.reduce((acc, r) => acc + (r.unit ?? 0), 0) ?? 0;
    const totalGradePoints =
      flatRows?.reduce(
        (acc, r) => acc + (r.gradePoint != null ? r.gradePoint * r.unit : 0),
        0,
      ) ?? 0;
    const gpa =
      completedUnits > 0 ? (totalGradePoints / completedUnits).toFixed(2) : "–";

    return {
      lastGpa: gpa,
      completedUnits: String(completedUnits),
      cgpa: gpa,
      deltaLast: "↑ 20% vs last session",
      deltaCgpa: "↑ 0% vs last session",
    };
  }, [flatRows]);

  function requestTranscript() {
    alert("Simulated: transcript request submitted");
  }

  const { user } = useAuth();
  const displayName = user?.firstname ?? user?.name ?? "Student";

  return (
    <>
      <div className="mt-5">
        <h1 className="text-xl font-semibold text-slate-900">Results</h1>
        <p className="text-sm text-slate-600">
          Your academic summary, {displayName}.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          label="Last Grade Point Average"
          value={summary.lastGpa}
          meta={summary.deltaLast}
        />
        <StatCard
          label="Completed Course Units"
          value={summary.completedUnits}
          meta="Completed Units"
        />
        <StatCard
          label="Cumulative Grade Point Average"
          value={summary.cgpa}
          meta={summary.deltaCgpa}
          tone="navy"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-800">
            Academic session
          </div>

          <select
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-[190px] rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-200"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={requestTranscript}
          className="w-full rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-95 md:w-auto"
        >
          Request Transcript
        </button>
      </div>

      {selected?.semesters.map((sem) => (
        <SemesterTable key={sem.name} semester={sem} />
      ))}
    </>
  );
}

function SemesterTable({ semester }: { semester: SemesterBlock }) {
  const totals = useMemo(() => {
    const totalCredits = semester.rows.reduce((acc, r) => acc + r.unit, 0);
    const gradePoints = semester.rows.reduce((acc, r) => {
      if (r.gradePoint == null) return acc;
      return acc + r.gradePoint * r.unit;
    }, 0);

    const hasAny = semester.rows.some((r) => r.gradePoint != null);
    const gpa =
      hasAny && totalCredits > 0
        ? (gradePoints / totalCredits).toFixed(2)
        : "–";

    return {
      totalCredits: hasAny ? String(totalCredits) : "–",
      gpa,
      totalGradePoints: hasAny ? String(gradePoints) : "–",
    };
  }, [semester.rows]);

  return (
    <section className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5">
      <div className="text-sm font-semibold text-slate-900">
        {semester.name}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)]">
        {/* header row (brown bar) */}
        <div className="bg-[#c7a37a] px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-white">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-2">Course Code</div>
            <div className="col-span-5">Course Title</div>
            <div className="col-span-1 text-center">Unit</div>
            <div className="col-span-1 text-center">Score</div>
            <div className="col-span-1 text-center">Grade</div>
            <div className="col-span-2 text-center">Grade Point</div>
          </div>
        </div>

        {/* rows */}
        <div className="bg-white">
          {semester.rows.map((r) => (
            <div
              key={r.code}
              className="grid grid-cols-12 items-center gap-2 border-t border-[var(--border)] px-4 py-4 text-sm"
            >
              <div className="col-span-2 font-semibold text-sky-700">
                {r.code}
              </div>
              <div className="col-span-5 text-slate-800">{r.title}</div>
              <div className="col-span-1 text-center font-semibold text-slate-800">
                {r.unit}
              </div>
              <div className="col-span-1 text-center text-slate-600">
                {r.score ?? "–"}
              </div>
              <div className="col-span-1 text-center text-slate-600">
                {r.grade ?? "–"}
              </div>
              <div className="col-span-2 text-center text-slate-600">
                {r.gradePoint ?? "–"}
              </div>
            </div>
          ))}

          {/* totals bar */}
          <div className="border-t border-[var(--border)] bg-slate-100 px-4 py-4">
            <div className="flex flex-col gap-3 text-sm font-semibold text-slate-800 md:flex-row md:items-center md:justify-end md:gap-10">
              <div>
                TOTAL CREDITS:{" "}
                <span className="font-extrabold">{totals.totalCredits}</span>
              </div>
              <div>
                GPA: <span className="font-extrabold">{totals.gpa}</span>
              </div>
              <div>
                TOTAL GRADE POINTS:{" "}
                <span className="font-extrabold">
                  {totals.totalGradePoints}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
