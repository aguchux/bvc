
'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseEnrollmentPanel from "./CourseEnrollmentPanel";


const stripHtml = (value?: string) => {
    if (!value) return "";
    return value.replace(/<[^>]*>/g, "").trim();
};


const FALLBACK_BACKGROUND =
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80";

type CourseParams = {
    course: MoodleCourseType;
    photoUrl: string | null;
    contents: any[];
    category?: { id: number; name: string } | null;
};


const formatTimestamp = (timestamp?: number) => {
    if (!timestamp || Number.isNaN(Number(timestamp))) return "TBD";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const CourseDetailScreen = ({
    course,
    photoUrl,
    contents,
    category,
}: CourseParams) => {

    const moduleCount = contents.reduce(
        (sum, section) =>
            sum + (Array.isArray(section?.modules) ? section.modules.length : 0),
        0,
    );

    if (!course) {
        notFound();
    }

    const summary = stripHtml(course.summary);

    return (
        <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
            <div className="text-sm text-slate-500">
                <Link
                    href="/courses"
                    className="font-semibold text-[#0F5E78] hover:underline"
                >
                    Courses
                </Link>{" "}
                / <span className="text-slate-500">{course.fullname}</span>
            </div>

            <section className="space-y-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                            {photoUrl ? (
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={photoUrl}
                                        alt={`Hero image for ${course.fullname}`}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 60vw"
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/50" />
                                </div>
                            ) : (
                                <div
                                    className="h-64 w-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `linear-gradient(180deg, rgba(15,94,120,0.1), rgba(15,94,120,0.85)), url('${FALLBACK_BACKGROUND}')`,
                                    }}
                                />
                            )}
                            <div className="absolute inset-0 flex items-start justify-between px-5 py-4 text-xs uppercase tracking-[0.4em] text-white">
                                <span className="rounded-full bg-black/50 px-3 py-1">
                                    Moodle
                                </span>
                                <span className="rounded-full bg-black/50 px-3 py-1">
                                    {category?.name ?? "Course preview"}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                                {course.shortname}
                            </p>
                            <h1 className="text-3xl font-bold text-slate-900">
                                {course.fullname}
                            </h1>
                            <p className="text-sm text-slate-600">{summary || "No summary available yet."}</p>
                            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                                <span>
                                    Start {formatTimestamp(course.startdate)}
                                </span>
                                <span>
                                    End {formatTimestamp(course.enddate)}
                                </span>
                                <span>{moduleCount} module{moduleCount === 1 ? "" : "s"}</span>
                            </div>
                        </div>
                    </div>

                    <CourseEnrollmentPanel courseId={course.id} />
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Course details</h2>
                    <div className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                Category
                            </p>
                            <p className="font-semibold text-slate-900">
                                {/* {category?.name ?? `ID ${course.categoryid}`} */}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                Visibility
                            </p>
                            <p className="font-semibold text-slate-900">
                                {course.visible ? "Published" : "Hidden"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                Format
                            </p>
                            <p className="font-semibold text-slate-900">{course.format || "Standard"}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                Sections
                            </p>
                            <p className="font-semibold text-slate-900">
                                {course.numsections ?? "Flexible"}
                            </p>
                        </div>
                    </div>
                </article>

                <article className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Course content</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {moduleCount === 0
                            ? "Detailed modules are being prepared by instructors."
                            : `This course contains ${moduleCount} module${moduleCount === 1 ? "" : "s"} across ${contents.length} section${contents.length === 1 ? "" : "s"}.`}
                    </p>
                    <div className="mt-5 space-y-4">
                        {contents.map((section) => (
                            <div
                                key={section.id ?? `${section.section}-${section.name}`}
                                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {section.name || `Section ${section.section || "?"}`}
                                    </p>
                                    <span className="text-[11px] uppercase tracking-[0.4em] text-slate-500">
                                        {section.visible ? "Visible" : "Hidden"}
                                    </span>
                                </div>
                                {Array.isArray(section.modules) ? (
                                    <ul className="mt-3 space-y-3 text-sm text-slate-600">
                                        {section.modules.map((module: any) => (
                                            <li
                                                key={module.id ?? module.name}
                                                className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-slate-900">
                                                        {module.name}
                                                    </span>
                                                    <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                                                        {module.modname}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    {module.description
                                                        ? stripHtml(module.description)
                                                        : `Module ${module.id}`}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-2 text-xs text-slate-500">
                                        No modules are published for this section yet.
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </main>
    );
}
