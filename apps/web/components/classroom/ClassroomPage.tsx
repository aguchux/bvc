"use client";

import { useMemo, useState } from "react";
import { useAuth } from "contexts/AuthContext";

type CourseStatus = "In progress" | "Past" | "All";
type Course = {
  id: string;
  code: string;
  title: string;
  school: string;
  levelTag: "100L" | "200L" | "300L";
  bannerTag: string; // e.g. "Business Management"
  imageUrl: string;
  completedActivities: number;
  totalActivities: number;
  status: "In progress" | "Past";
};

const demoCourses: Course[] = [
  {
    id: "c1",
    code: "ACC 101",
    title: "Introduction To Financial Accounting I",
    school: "Accounting",
    bannerTag: "Accounting",
    levelTag: "100L",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=70",
    completedActivities: 0,
    totalActivities: 113,
    status: "In progress",
  },
  {
    id: "c2",
    code: "AMS 101",
    title: "Principles of Management I",
    school: "Business Management",
    bannerTag: "Business Management",
    levelTag: "100L",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=70",
    completedActivities: 0,
    totalActivities: 111,
    status: "In progress",
  },
  {
    id: "c3",
    code: "AMS 103",
    title: "Introduction to Computing",
    school: "School of Management and Social Sciences",
    bannerTag: "School of Management and Social Sciences",
    levelTag: "100L",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=70",
    completedActivities: 1,
    totalActivities: 139,
    status: "In progress",
  },
  {
    id: "c4",
    code: "BIO 101",
    title: "General Biology I",
    school: "Allied Health",
    bannerTag: "Allied Health",
    levelTag: "100L",
    imageUrl:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=70",
    completedActivities: 0,
    totalActivities: 121,
    status: "In progress",
  },
  {
    id: "c5",
    code: "BIO 107",
    title: "General Biology Practical I",
    school: "Allied Health",
    bannerTag: "Allied Health",
    levelTag: "100L",
    imageUrl:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1400&q=70",
    completedActivities: 0,
    totalActivities: 95,
    status: "In progress",
  },
  {
    id: "c6",
    code: "BUA 201",
    title: "Principles of Business Administration I",
    school: "Business Management",
    bannerTag: "Business Management",
    levelTag: "200L",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=70",
    completedActivities: 0,
    totalActivities: 122,
    status: "Past",
  },
  {
    id: "c7",
    code: "BUA 304",
    title: "Human Resource Management",
    school: "Business Management",
    bannerTag: "Business Management",
    levelTag: "300L",
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=70",
    completedActivities: 0,
    totalActivities: 97,
    status: "Past",
  },
];

type ViewMode = "grid" | "list";

export default function ClassroomPage() {
  const [tab, setTab] = useState<CourseStatus>("In progress");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name_asc" | "name_desc">("name_asc");
  const [view, setView] = useState<ViewMode>("grid");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...demoCourses];

    // tab filter
    if (tab !== "All") {
      list = list.filter((c) => c.status === tab);
    }

    // search filter
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.bannerTag.toLowerCase().includes(q),
      );
    }

    // sort
    list.sort((a, b) => {
      const A = `${a.code} ${a.title}`.toLowerCase();
      const B = `${b.code} ${b.title}`.toLowerCase();
      return sort === "name_asc" ? A.localeCompare(B) : B.localeCompare(A);
    });

    return list;
  }, [tab, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageCourses = useMemo(() => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize, totalPages]);

  function goToCourse(course: Course) {
    alert(`Simulated: open course ${course.code}`);
  }

  const { user } = useAuth();
  const displayName = user?.firstname ?? user?.name ?? "Student";

  return (
    <>
      <div className="mt-2">
        <div className="text-2xl font-semibold text-slate-900">
          Hi, <span className="text-slate-800">{displayName}</span> 👋
        </div>
        <div className="mt-4 text-sm font-semibold text-slate-900">
          Course overview
        </div>
      </div>

      <div className="mt-3 flex items-center gap-6 border-b border-[var(--border)] text-sm font-semibold">
        {(["All", "In progress", "Past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={[
              "pb-3",
              tab === t
                ? "border-b-2 border-[var(--navy)] text-slate-900"
                : "text-slate-500 hover:text-slate-800",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "name_asc" | "name_desc")
            }
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-200 sm:w-[200px]"
          >
            <option value="name_asc">Sort by course name</option>
            <option value="name_desc">Sort by course name (desc)</option>
          </select>

          <div className="relative w-full sm:w-[240px]">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-sky-200"
            />
            <span className="absolute right-3 top-2.5 text-slate-400">🔍</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("grid")}
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                view === "grid"
                  ? "border-slate-300 bg-white text-slate-900"
                  : "border-[var(--border)] bg-slate-50 text-slate-600",
              ].join(" ")}
              title="Grid view"
            >
              ⬛⬛
            </button>
            <button
              onClick={() => setView("list")}
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                view === "list"
                  ? "border-slate-300 bg-white text-slate-900"
                  : "border-[var(--border)] bg-slate-50 text-slate-600",
              ].join(" ")}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pageCourses.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={() => goToCourse(c)} />
          ))}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {pageCourses.map((c) => (
            <CourseRow key={c.id} course={c} onOpen={() => goToCourse(c)} />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-between gap-3 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-semibold">Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          >
            {[6, 12, 24, 48].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            ‹
          </button>
          <div className="text-sm font-semibold text-slate-700">
            {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------- UI bits ---------------- */

function CourseCard({
  course,
  onOpen,
}: {
  course: Course;
  onOpen: () => void;
}) {
  const percent = Math.round(
    (course.completedActivities / course.totalActivities) * 100,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
      <div className="relative h-28 w-full">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-full w-full object-cover"
        />

        {/* level ribbon */}
        <div className="absolute left-3 top-0">
          <div className="rounded-b-xl bg-[var(--navy)] px-3 py-2 text-xs font-extrabold text-white shadow">
            {course.levelTag}
          </div>
        </div>

        {/* menu dot */}
        <button
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-md bg-white/90 text-slate-600 shadow hover:bg-white"
          title="More"
        >
          ⋯
        </button>

        {/* small banner tag */}
        <div className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700">
          {course.bannerTag}
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm font-semibold text-slate-800">
          {course.code} - {course.title}
        </div>

        <div className="mt-2 text-xs text-slate-500">
          {course.completedActivities} out of {course.totalActivities}{" "}
          activities completed
        </div>

        <div className="mt-3">
          <div className="text-xs font-semibold text-slate-600">
            {percent}% Course Completed
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-slate-400"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onOpen}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseRow({ course, onOpen }: { course: Course; onOpen: () => void }) {
  const percent = Math.round(
    (course.completedActivities / course.totalActivities) * 100,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-2 top-2 rounded bg-[var(--navy)] px-2 py-1 text-[10px] font-extrabold text-white">
            {course.levelTag}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">
            {course.code} - {course.title}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {percent}% completed • {course.bannerTag}
          </div>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="self-end rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 md:self-auto"
      >
        View Course
      </button>
    </div>
  );
}
