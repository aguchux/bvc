import type { Course } from "lib/data";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <div className="relative h-28 w-full">
        {/* image */}
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-full w-full object-cover"
        />

        {/* corner badge */}
        {course.badgeTop ? (
          <div className="absolute left-0 top-0">
            <div className="bg-red-500 px-3 py-2 text-xs font-bold text-white">
              {course.badgeTop}
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="text-sm font-semibold text-slate-900">
          {course.title}
        </div>

        <div className="mt-1 text-xs text-slate-500">{course.code}</div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
              {course.category ?? "CORE"}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
              {course.status ?? "Enrolled"}
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
