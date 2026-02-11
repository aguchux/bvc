"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetEnrolledCoursesQuery } from "store/apis/course.api";
import { useAuth } from "contexts/AuthContext";
import { useMemo } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=1200&q=80";

const stripHtml = (value?: string) => {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, "").trim();
};

const formatDate = (timestamp?: number) => {
  if (!timestamp || Number.isNaN(Number(timestamp))) {
    return "Not scheduled";
  }
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const truncate = (value: string, max = 160) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
};

export default function EnrolledCoursesSection() {
  const { data: courseData, error } = useGetEnrolledCoursesQuery();
  const { user, loading } = useAuth();

  const courses = useMemo(() => {
    if (courseData?.courses) {
      return courseData.courses;
    }
    return [];
  }, [courseData]);

  const displayName =
    `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Learner";
  const courseCount = courses?.length ?? 0;

  if (loading) {
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

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <section className="grid gap-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm md:grid-cols-2 md:items-end">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Dashboard Courses
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {displayName}
          </h1>
          <p className="text-slate-600">
            These are the courses currently available to you on Moodle. Tap
            “View course” to open the Moodle experience or explore the course
            page for more details.
          </p>
        </div>
        <div className="space-y-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Enrolled courses
          </p>
          <p className="text-4xl font-bold text-slate-900">{courseCount}</p>
          <p className="text-sm text-slate-500">
            {courseCount === 0
              ? "No Moodle courses have been assigned yet."
              : "Courses updated in real time from the LMS."}
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
          Error loading courses
        </div>
      ) : null}

      {courseCount === 0 && !error ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No courses yet. Once you join a Moodle course it will appear here
          immediately.
        </div>
      ) : (
        <section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const summary = stripHtml(course.summary);
            return (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative h-44 w-full">
                  <img
                    src={FALLBACK_IMAGE}
                    alt={course.fullname}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/70" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-white">
                    <span className="rounded-full bg-black/40 px-3 py-1">
                      Moodle
                    </span>
                    <span className="rounded-full bg-black/40 px-3 py-1">
                      {formatDate(course.startdate)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col space-y-3 p-5">
                  <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    Cat {course.categoryid}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {course.fullname}
                    </h2>
                    <p className="text-xs text-slate-500">{course.shortname}</p>
                  </div>

                  <p className="text-sm text-slate-600">
                    {summary
                      ? truncate(summary)
                      : "Course overview is not yet available."}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#0F5E78]">
                    <Link
                      href={`/courses/${course.id}`}
                      className="inline-flex items-center gap-1"
                    >
                      View course <ArrowRight className="h-3 w-3" />
                    </Link>
                    <span className="text-slate-500">
                      {course.visible ? "Published" : "Hidden"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
