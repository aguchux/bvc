"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import { useGetEnrolledCoursesQuery } from "store/apis/course.api";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80";

type CourseStatus = "In progress" | "Past" | "All";

type CourseViewModel = {
    id: string;
    code: string;
    title: string;
    school: string;
    bannerTag: string;
    levelTag: string;
    imageUrl: string;
    completionPercent: number;
    startdate?: number;
    enddate?: number;
    status: Exclude<CourseStatus, "All">;
    summary: string;
    visible: number;
};

const formatDate = (timestamp?: number) => {
    if (!timestamp || !Number.isFinite(timestamp)) return "Not scheduled";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const stripHtml = (value?: string) => {
    if (!value) return "";
    return value.replace(/<[^>]*>/g, "").trim();
};

const buildCourseViewModels = (
    courses: MoodleCourseType[] | undefined,
    nowSeconds: number,
): CourseViewModel[] => {
    if (!Array.isArray(courses) || courses.length === 0) {
        return [];
    }

    return courses.map((course) => {
        const start = course.startdate ?? nowSeconds;
        const end = course.enddate && course.enddate > start ? course.enddate : start + 30 * 24 * 60 * 60;
        const duration = Math.max(end - start, 1);
        const elapsed = Math.max(Math.min(nowSeconds - start, duration), 0);
        const completionPercent = Math.round((elapsed / duration) * 100);
        const status: CourseViewModel["status"] = nowSeconds > end ? "Past" : "In progress";

        return {
            id: String(course.id),
            code: course.shortname ?? `Course ${course.id}`,
            title: course.fullname,
            school: "Bonny Vocational Center",
            bannerTag: course.format ?? "Moodle course",
            levelTag: `Cat ${course.categoryid ?? "N/A"}`,
            imageUrl: `/api/courses/${course.id}/photo`,
            completionPercent,
            startdate: course.startdate,
            enddate: course.enddate,
            status,
            summary: stripHtml(course.summary),
            visible: course.visible ?? 0,
        };
    });
};

export default function ClassroomPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState<CourseStatus>("In progress");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState<"name_asc" | "name_desc">("name_asc");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [pageSize, setPageSize] = useState(12);
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useGetEnrolledCoursesQuery();
    const nowSeconds = Math.floor(Date.now() / 1000);
    const courses = useMemo(
        () => buildCourseViewModels(data?.courses, nowSeconds),
        [data?.courses, nowSeconds],
    );

    const filtered = useMemo(() => {
        let list = [...courses];

        if (tab !== "All") {
            list = list.filter((c) => c.status === tab);
        }

        const q = query.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.code.toLowerCase().includes(q) ||
                    c.bannerTag.toLowerCase().includes(q),
            );
        }

        list.sort((a, b) => {
            const A = `${a.code} ${a.title}`.toLowerCase();
            const B = `${b.code} ${b.title}`.toLowerCase();
            return sort === "name_asc" ? A.localeCompare(B) : B.localeCompare(A);
        });

        return list;
    }, [courses, tab, query, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const pageCourses = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, safePage, pageSize]);

    const displayName = `${user?.firstname ?? ""} ${user?.lastname ?? ""}`
        .trim()
        .replace(/\s+/g, " ") || "Student";
    const courseCount = courses.length;

    function goToCourse(course: CourseViewModel) {
        const courseId = course.id;
        router.push(`/dashboard/classroom/course/${encodeURIComponent(courseId)}/activity/overview`);
    }

    return (
        <>
            <div className="mt-2">
                <div className="text-2xl font-semibold text-slate-900">
                    Hi, <span className="text-slate-800">{displayName}</span> ??
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-900">Course overview</div>
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
                        {t === "Past" ? "Completed" : t}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as "name_asc" | "name_desc")}
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
                        <span className="absolute right-3 top-2.5 text-slate-400">??</span>
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
                            ??
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
                            ?
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-72 animate-pulse rounded-2xl border border-[var(--border)] bg-white"
                        />
                    ))}
                </div>
            ) : courseCount === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    You do not have any enrolled Moodle courses yet. Once you join a course it will appear here.
                </div>
            ) : view === "grid" ? (
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

            {!isLoading && courseCount > 0 ? (
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
                            
                        </button>
                        <div className="text-sm font-semibold text-slate-700">
                            {page} / {totalPages}
                        </div>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                        >
                            
                        </button>
                    </div>
                </div>
            ) : null}

            {error ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
                    Unable to load enrolled courses.
                </div>
            ) : null}
        </>
    );
}

function CourseCard({
    course,
    onOpen,
}: {
    course: CourseViewModel;
    onOpen: () => void;
}) {
    const [imageSrc, setImageSrc] = useState(course.imageUrl);
    useEffect(() => {
        setImageSrc(course.imageUrl);
    }, [course.imageUrl]);
    const handleImageError = () => {
        setImageSrc(FALLBACK_IMAGE);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
            <div className="relative h-28 w-full">
                <img
                    src={imageSrc}
                    alt={course.title}
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                />
                <div className="absolute left-3 top-0">
                    <div className="rounded-b-xl bg-[var(--navy)] px-3 py-2 text-xs font-extrabold text-white shadow">
                        {course.levelTag}
                    </div>
                </div>
                <div className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    {course.bannerTag}
                </div>
            </div>

            <div className="p-4">
                <div className="text-sm font-semibold text-slate-800">
                    {course.code} - {course.title}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                    {course.status === "Past" ? "Completed" : "In progress"}
                    {course.startdate ? `  Starts ${formatDate(course.startdate)}` : ``}
                </div>

                <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-600">
                        {course.completionPercent}% Course Completed
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-slate-400"
                            style={{ width: `${course.completionPercent}%` }}
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-between gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>{course.visible ? "Published" : "Hidden"}</span>
                    <span>{course.status === "Past" ? "Completed" : "Active"}</span>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onOpen}
                        className="rounded-lg border cursor-pointer border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        View Course
                    </button>
                </div>
            </div>
        </div>
    );
}

function CourseRow({ course, onOpen }: { course: CourseViewModel; onOpen: () => void }) {
    const [rowImageSrc, setRowImageSrc] = useState(course.imageUrl);
    useEffect(() => {
        setRowImageSrc(course.imageUrl);
    }, [course.imageUrl]);
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
                <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-slate-100">
                    <img
                        src={rowImageSrc}
                        alt={course.title}
                        className="h-full w-full object-cover"
                        onError={() => setRowImageSrc(FALLBACK_IMAGE)}
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
                        {course.completionPercent}% completed  {course.bannerTag}
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
