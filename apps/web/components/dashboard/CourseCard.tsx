"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  useGetCourseContentsQuery,
  useEnrollInCourseMutation,
  useGetErollmentStatusQuery,
  useGetCategoryByIdQuery,
} from "store/apis/course.api";
import { useAuth } from "contexts/AuthContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80";

export default function CourseCard({ course }: { course: MoodleCourseType }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const { data: contentsData } = useGetCourseContentsQuery(course.id, {
    skip: !course.id,
  });
  const proxyImageUrl = `/api/courses/${course.id}/photo`;
  const [imageSrc, setImageSrc] = useState(proxyImageUrl);
  useEffect(() => {
    setImageSrc(proxyImageUrl);
  }, [proxyImageUrl]);
  const handleImageError = () => {
    setImageSrc(FALLBACK_IMAGE);
  };

  const { data: enrollmentStatus, isLoading: isEnrollmentStatusLoading } =
    useGetErollmentStatusQuery(course.id, {
      skip: !isAuthenticated,
    });

  const { data: categoryData } = useGetCategoryByIdQuery(
    course.categoryid ?? 0,
    {
      skip: !course.categoryid,
    },
  );

  const category = categoryData?.category;

  const [enrollInCourse, { isLoading: isEnrolling }] =
    useEnrollInCourseMutation();
  const moduleCount = contentsData?.contents?.length ?? 0;

  const handleViewCourse = () => {
    router.push(`/courses/${course.id}`);
  };

  const handleEnroll = async () => {
    setMessage(null);
    try {
      const result = await enrollInCourse(course.id).unwrap();
      setMessage(result?.message ?? "Enrollment confirmed.");
    } catch (error) {
      const errMessage =
        error && typeof error === "object" && "data" in error
          ? String((error as { data?: any }).data?.error ?? error)
          : "Unable to enroll in this course.";
      setMessage(errMessage);
    }
  };

  const isEnrolled = useMemo(() => {
    return enrollmentStatus?.enrolled ?? false;
  }, [enrollmentStatus]);

  const gotoCourseClass = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-40 w-full">
        <img
          src={imageSrc}
          alt={course.fullname}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/60" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
          <span className="rounded-full bg-black/40 px-3 py-1">Moodle</span>
          <span className="rounded-full bg-black/40 px-3 py-1">
            {moduleCount
              ? `${moduleCount} module${moduleCount === 1 ? "" : "s"}`
              : "Modules"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
          {category ? `${category.name}` : `Cat ${course.categoryid}`}
        </div>
        <h3 className="text-xl font-semibold text-slate-900">
          {course.fullname}
        </h3>
        <p className="text-sm text-slate-600">
          {course.shortname} —{" "}
          {new Date((course.startdate ?? 0) * 1000).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric" },
          )}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
            {course.visible ? "Published" : "Hidden"}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
            {course.showgrades ? "Graded" : "Ungraded"}
          </span>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleViewCourse}
              className="flex-1 cursor-pointer rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[#0F5E78] transition hover:bg-slate-50"
            >
              View course
            </button>
            <button
              type="button"
              onClick={handleEnroll}
              disabled={isEnrolling || isEnrollmentStatusLoading}
              className="flex-1 cursor-pointer rounded-2xl bg-[#0F5E78] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEnrolled
                ? "Enrolled ✓"
                : isEnrolling
                  ? "Enrolling…"
                  : "Enroll"}
            </button>
          </div>
          {message ? <p className="text-xs text-slate-600">{message}</p> : null}
        </div>
      </div>
    </article>
  );
}
