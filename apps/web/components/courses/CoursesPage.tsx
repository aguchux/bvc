"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";

type CourseStatus =
  | "Completed"
  | "Carry-over"
  | "Carry-forward"
  | "Deferred"
  | "Enrolled"
  | "Incomplete"
  | "Discontinued";

type Course = {
  id: string;
  code: string;
  title: string;
  units: number;
  level: "100 LEVEL" | "200 LEVEL";
  semester: "First Semester" | "Second Semester";
  category: "CORE" | "ELECTIVE";
  status: CourseStatus;
  imageUrl: string;
};

const courses: Course[] = [
  {
    id: "c1",
    code: "MIT 8103",
    title: "Advanced Database Systems",
    units: 3,
    level: "100 LEVEL",
    semester: "First Semester",
    category: "CORE",
    status: "Enrolled",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "c2",
    code: "MIT 8113",
    title: "Digital Transformation and Innovation",
    units: 3,
    level: "100 LEVEL",
    semester: "First Semester",
    category: "CORE",
    status: "Enrolled",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "c3",
    code: "MIT 8111",
    title: "Ethics and Legal Issues in IT",
    units: 3,
    level: "100 LEVEL",
    semester: "First Semester",
    category: "CORE",
    status: "Enrolled",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "c4",
    code: "MIT 8101",
    title: "Information Technology Management",
    units: 3,
    level: "100 LEVEL",
    semester: "First Semester",
    category: "CORE",
    status: "Enrolled",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "c5",
    code: "MIT 8105",
    title: "Network Architecture and Protocols",
    units: 3,
    level: "100 LEVEL",
    semester: "First Semester",
    category: "CORE",
    status: "Enrolled",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "c6",
    code: "MIT 8107",
    title: "Software Development Lifecycle",
    units: 3,
    level: "100 LEVEL",
    semester: "First Semester",
    category: "CORE",
    status: "Enrolled",
    imageUrl:
      "https://images.unsplash.com/photo-1522071901873-411886a10004?auto=format&fit=crop&w=1200&q=70",
  },

  // Outstanding examples
  {
    id: "c7",
    code: "MIT 7002",
    title: "Research Methods",
    units: 2,
    level: "100 LEVEL",
    semester: "First Semester",
    category: "CORE",
    status: "Carry-forward",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "c8",
    code: "MIT 7004",
    title: "Software Testing",
    units: 2,
    level: "100 LEVEL",
    semester: "Second Semester",
    category: "ELECTIVE",
    status: "Deferred",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=70",
  },
];

const STATUS_HELP: Array<{
  status: CourseStatus;
  color: string; // tailwind bg
  text: string;
}> = [
  {
    status: "Completed",
    color: "bg-emerald-600",
    text: "Successfully finished",
  },
  { status: "Carry-over", color: "bg-red-600", text: "Failed, must retake" },
  { status: "Carry-forward", color: "bg-[#c7a37a]", text: "Not yet enrolled" },
  { status: "Deferred", color: "bg-amber-500", text: "Postponed course" },
  {
    status: "Enrolled",
    color: "bg-[var(--navy)]",
    text: "Currently registered",
  },
  {
    status: "Incomplete",
    color: "bg-slate-500",
    text: "No result / not completed",
  },
  {
    status: "Discontinued",
    color: "bg-slate-800",
    text: "This course has been discontinued.",
  },
];

function statusPill(status: CourseStatus) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    case "Carry-over":
      return "bg-red-50 text-red-700";
    case "Carry-forward":
      return "bg-amber-50 text-amber-800";
    case "Deferred":
      return "bg-amber-50 text-amber-700";
    case "Incomplete":
      return "bg-slate-100 text-slate-700";
    case "Discontinued":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function CoursesTooltip() {
  // pure CSS tooltip: show on hover of the group
  return (
    <div className="relative inline-flex items-center gap-2 text-sm text-slate-700">
      <div className="group inline-flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-full border border-amber-400 text-[11px] font-bold text-amber-600">
          i
        </span>
        <span className="font-semibold">See what each course status means</span>

        {/* tooltip */}
        <div className="pointer-events-none absolute right-0 top-7 z-20 hidden w-[320px] rounded-xl border border-[var(--border)] bg-white p-4 shadow-xl group-hover:block">
          <div className="space-y-3">
            {STATUS_HELP.map((s) => (
              <div key={s.status} className="flex items-start gap-3">
                <span className={`mt-1 h-3 w-3 rounded-sm ${s.color}`} />
                <div className="text-sm">
                  <span className="font-semibold text-slate-800">
                    {s.status}
                  </span>
                  <span className="text-slate-600"> — {s.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  onOpen,
}: {
  course: Course;
  onOpen?: (course: Course) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(course)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen?.(course);
        }
      }}
      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
        <div className="relative h-32 w-full">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        {/* MIT ribbon */}
        <div className="absolute left-0 top-0">
          <div className="bg-red-500 px-3 py-2 text-xs font-bold text-white">
            MIT
          </div>
        </div>
      </div>
    </div>

    <div className="p-4">
        <div className="text-sm font-semibold text-slate-900">
          {course.title}
        </div>
        <div className="mt-1 text-xs text-slate-500">{course.code}</div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
              {course.category}
            </span>
            <span
              className={`rounded-md px-3 py-1 text-[11px] font-semibold ${statusPill(
                course.status,
              )}`}
            >
              {course.status}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {course.units} Units
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [tab, setTab] = useState<"LEVEL" | "OUTSTANDING">("LEVEL");
  const { user } = useAuth();
  const displayName = user?.firstname ?? user?.name ?? "Student";
  const router = useRouter();

  const list = useMemo(() => {
    if (tab === "LEVEL") {
      return courses.filter((c) => c.level === "100 LEVEL");
    }
    // outstanding: anything not enrolled/completed
    return courses.filter(
      (c) => c.status !== "Enrolled" && c.status !== "Completed",
    );
  }, [tab]);

  function goToClass() {
    router.push("/dashboard/classroom");
  }

  function goToCourse(course: Course) {
    router.push(`/dashboard/classroom?course=${course.id}`);
  }

  return (
    <>
      <div className="mt-5">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome, <span className="text-slate-700">{displayName}</span>
        </h1>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setTab("LEVEL")}
          className={[
            "rounded-lg px-4 py-2 text-sm font-semibold",
            tab === "LEVEL"
              ? "bg-white text-slate-900 shadow-sm ring-1 ring-[var(--border)]"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200",
          ].join(" ")}
        >
          100 LEVEL
        </button>

        <button
          onClick={() => setTab("OUTSTANDING")}
          className={[
            "rounded-lg px-4 py-2 text-sm font-semibold",
            tab === "OUTSTANDING"
              ? "bg-white text-slate-900 shadow-sm ring-1 ring-[var(--border)]"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200",
          ].join(" ")}
        >
          Outstanding Courses
        </button>
      </div>

      <section className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Master of Information Technology (MIT)
              </h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Enrolled
              </span>
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-800">
              First Semester
            </div>
          </div>

          <div className="flex items-center gap-5">
            <CoursesTooltip />

            {tab === "LEVEL" ? (
              <button
                onClick={goToClass}
                className="rounded-lg bg-[#c7a37a] px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Go to Class
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={goToCourse} />
          ))}
        </div>
      </section>
    </>
  );
}
