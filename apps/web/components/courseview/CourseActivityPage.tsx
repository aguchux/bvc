"use client";

import { useMemo, useState } from "react";

// If you already have your portal Topbar/Sidebar, you can swap these.
// This version matches the Moodle "in-course" top bar look.
function CourseTopNav() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--navy)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-white">
            <div className="h-9 w-9 rounded-lg bg-white/10" />
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide">MIVA</div>
              <div className="text-[11px] text-white/70">OPEN UNIVERSITY</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-white/80 md:flex">
            <a className="hover:text-white" href="#">
              Dashboard
            </a>
            <a className="text-white" href="#">
              My courses
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15">
            Recent ▾
          </button>
          <button className="h-9 w-9 rounded-full bg-white/15" />
          <div className="h-9 w-9 rounded-full bg-white/20" />
        </div>
      </div>
    </header>
  );
}

/* ---------------- types + demo data ---------------- */

type ActivityType = "video" | "pdf";

type Activity = {
  id: string;
  title: string;
  type: ActivityType;
  section: string; // e.g. "Week 1"
  href?: string; // for your real integration
  src: string; // video url or pdf url
  lastModified: string;
};

type Course = {
  id: string;
  code: string;
  name: string;
  activities: Activity[];
};

const demoCourse: Course = {
  id: "AMS103",
  code: "AMS 103",
  name: "Introduction to Computing",
  activities: [
    {
      id: "ann",
      title: "Announcements",
      type: "pdf",
      section: "Introduction",
      src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      lastModified: "Thursday, 3 July 2025, 4:52 PM",
    },
    {
      id: "wk1vid",
      title:
        "Week 1: Video Lecture: A Brief History of Computing and Its Impact on Society",
      type: "video",
      section: "Week 1",
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      lastModified: "Thursday, 3 July 2025, 4:52 PM",
    },
    {
      id: "wk1pdf",
      title:
        "Week 1: A Brief History of Computing and Its Impact on Society (PDF)",
      type: "pdf",
      section: "Week 1",
      src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      lastModified: "Thursday, 3 July 2025, 4:54 PM",
    },
    {
      id: "wk1quiz",
      title: "Week 1: Practice Pop Quiz (Ungraded)",
      type: "pdf",
      section: "Week 1",
      src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      lastModified: "Thursday, 3 July 2025, 4:56 PM",
    },
  ],
};

function groupBySection(activities: Activity[]) {
  const map = new Map<string, Activity[]>();
  activities.forEach((a) => {
    const key = a.section;
    map.set(key, [...(map.get(key) ?? []), a]);
  });
  return Array.from(map.entries()).map(([section, items]) => ({
    section,
    items,
  }));
}

/* ---------------- page ---------------- */

export default function CourseActivityPage() {
  // In real app, read these from route params and fetch from API
  const course = demoCourse;

  const [activeId, setActiveId] = useState(
    course.activities[1]?.id ?? course.activities[0]?.id ?? "",
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const activeIndex = useMemo(
    () => course.activities.findIndex((a) => a.id === activeId),
    [activeId, course.activities],
  );

  const active =
    course.activities[Math.max(0, activeIndex)] ?? course.activities[0];
  const prev = activeIndex > 0 ? course.activities[activeIndex - 1] : null;
  const next =
    activeIndex >= 0 && activeIndex < course.activities.length - 1
      ? course.activities[activeIndex + 1]
      : null;

  const breadcrumb = `${course.code} / ${active?.section} / ${active?.title}`;

  function goTo(id: string) {
    setActiveId(id);
    setMenuOpen(false);
    // if you want real route navigation, use next/navigation router.push(...)
  }

  return (
    <div className="min-h-screen bg-white">
      <CourseTopNav />

      {/* left drawer + main */}
      <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
        <div className="flex items-start gap-6">
          {/* drawer toggle (left circle icon) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="mt-2 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-white shadow hover:opacity-95 lg:flex"
            title="Course menu"
          >
            ☰
          </button>

          <div className="flex-1">
            {/* breadcrumb */}
            <div className="text-xs text-slate-500">{breadcrumb}</div>

            {/* title row */}
            <div className="mt-3 flex items-start gap-3">
              <div className="mt-1 grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600">
                📄
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-slate-900">
                  {active?.title}
                </h1>
              </div>
            </div>

            {/* Done pill */}
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800">
                ✓ Done: View
              </span>
            </div>

            {/* content card */}
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-6">
              {active?.type === "video" ? (
                <VideoPlayer src={active?.src} />
              ) : (
                <PdfViewer src={String(active?.src)} />
              )}

              <div className="mt-6 text-xs text-slate-500">
                Last modified: {active?.lastModified}
              </div>
            </div>

            {/* footer controls */}
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:items-center">
              <div className="md:justify-self-start">
                <button
                  onClick={() => prev && goTo(prev.id)}
                  disabled={!prev}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                >
                  ‹ Previous Activity
                </button>
              </div>

              <div className="md:justify-self-center">
                <select
                  value={activeId}
                  onChange={(e) => goTo(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-200 md:w-[520px]"
                >
                  <option value={activeId}>Jump to…</option>
                  {course.activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:justify-self-end">
                <button
                  onClick={() => next && goTo(next.id)}
                  disabled={!next}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                >
                  Next Activity ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Menu Drawer (matches screenshot) */}
      <CourseMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        course={course}
        activeId={activeId}
        onSelect={goTo}
      />
    </div>
  );
}

/* ---------------- content viewers ---------------- */

function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-black">
        <video controls className="h-auto w-full">
          <source src={src} />
        </video>
      </div>
    </div>
  );
}

function PdfViewer({ src }: { src: string }) {
  // Simple embed that behaves like your screenshot
  // Replace with pdf.js later if you want custom controls.
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <iframe src={src} title="PDF" className="h-[640px] w-full" />
      </div>
    </div>
  );
}

/* ---------------- drawer menu ---------------- */

function CourseMenuDrawer({
  open,
  onClose,
  course,
  activeId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  course: Course;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const sections = useMemo(
    () => groupBySection(course.activities),
    [course.activities],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* drawer */}
      <div className="absolute left-0 top-0 h-full w-[340px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div className="text-sm font-semibold text-slate-900">
            Course Menu
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100%-56px)] overflow-auto p-4">
          <div className="space-y-4">
            {sections.map((s) => (
              <details
                key={s.section}
                open
                className="rounded-xl border border-[var(--border)] bg-slate-50"
              >
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800">
                  {s.section}
                </summary>

                <div className="px-2 pb-2">
                  {s.items.map((a) => {
                    const active = a.id === activeId;
                    return (
                      <button
                        key={a.id}
                        onClick={() => onSelect(a.id)}
                        className={[
                          "w-full rounded-lg px-3 py-2 text-left text-sm",
                          active
                            ? "bg-white font-semibold text-slate-900 ring-1 ring-[var(--border)]"
                            : "text-slate-600 hover:bg-white/70",
                        ].join(" ")}
                      >
                        {a.title}
                      </button>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
