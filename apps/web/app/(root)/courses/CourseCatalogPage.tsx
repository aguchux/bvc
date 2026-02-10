import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMoodleClient } from "lib/moodle";

export const metadata: Metadata = {
    title: "Courses — Bonny Vocational Center",
    description:
        "Browse Bonny Vocational Center's Moodle-powered courses and enroll in new training.",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1400&q=80";

const stripDefaultCoursePayload = (data: any[] | undefined): MoodleCourseType[] => {
    if (!Array.isArray(data)) {
        return [];
    }
    const frontPageId = 1;
    return data.filter((course) => {
        const id = Number(course?.id ?? 0);
        if (id <= 0) {
            return false;
        }
        if (id === frontPageId) {
            return false;
        }
        return true;
    });
};

const formatTimestamp = (timestamp?: number) => {
    if (!timestamp || Number.isNaN(Number(timestamp))) return "TBD";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const sanitizeSummary = (value?: string, maxLength = 180) => {
    if (!value) return "";
    const cleaned = value.replace(/<[^>]*>/g, "").trim();
    if (!cleaned) return "";
    if (cleaned.length <= maxLength) return cleaned;
    return `${cleaned.slice(0, maxLength).trim()}…`;
};

type LoadCoursesResult = {
    courses: MoodleCourseType[];
    categories: Map<number, string>;
};

async function fetchCourseCatalog(): Promise<LoadCoursesResult> {
    const client = getMoodleClient();
    const [publicCourses, categories] = await Promise.all([
        client.getPublicCourses(),
        client.getCategories().catch(() => []),
    ]);

    const filteredCourses = stripDefaultCoursePayload(publicCourses);
    const categoryMap = new Map<number, string>();
    if (Array.isArray(categories)) {
        categories.forEach((category) => {
            const id = Number(category?.id ?? 0);
            if (id > 0 && typeof category?.name === "string") {
                categoryMap.set(id, category.name);
            }
        });
    }

    return { courses: filteredCourses, categories: categoryMap };
}

export default async function CourseCatalogPage() {
    let courses: MoodleCourseType[] = [];
    let categoryLookup = new Map<number, string>();
    let errorMessage: string | null = null;

    try {
        const payload = await fetchCourseCatalog();
        courses = payload.courses;
        categoryLookup = payload.categories;
    } catch (error) {
        errorMessage =
            error instanceof Error ? error.message : "Unable to load course catalog.";
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-12 space-y-10">
            <section className="grid gap-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm md:grid-cols-2 md:items-end">
                <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
                        Online Student Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Moodle courses at Bonny Vocational Center
                    </h1>
                    <p className="text-slate-600">
                        Explore industry-aligned training delivered through our Moodle learning
                        management system. Browse the catalogue, view course details, and join
                        the classes that move your skills forward.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            className="rounded-full bg-[#0F5E78] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                            href="#"
                        >
                            How to Access Courses
                        </Link>
                        <Link
                            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                            href="/contact"
                        >
                            Talk to admissions
                        </Link>
                    </div>
                </div>
                <div className="relative h-56 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                    <img
                        src={FALLBACK_IMAGE}
                        alt="Students learning"
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/40" />
                    <div className="absolute bottom-3 left-3 rounded-2xl bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                        New season
                    </div>
                </div>
            </section>

            <section className="space-y-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-600">
                            {courses.length} course{courses.length === 1 ? "" : "s"} available
                        </p>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Browse the Moodle catalog
                        </h2>
                    </div>
                    <Link
                        href="/programs"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F5E78] hover:underline"
                    >
                        View all programmes <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {errorMessage ? (
                    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                        {errorMessage}
                    </p>
                ) : null}

                {courses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                        No courses available yet. Please check back soon.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                categoryName={categoryLookup.get(course.categoryid)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function CourseCard({
    course,
    categoryName,
}: {
    course: MoodleCourseType;
    categoryName?: string;
}) {
    const summary = sanitizeSummary(course.summary);
    const sectionLabel =
        typeof course.numsections === "number" && course.numsections > 0
            ? `${course.numsections} section${course.numsections === 1 ? "" : "s"}`
            : "Modular delivery";
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-40 w-full">
                <img
                    src={FALLBACK_IMAGE}
                    alt={course.fullname}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/50" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px]">
                        Moodle
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px]">
                        {formatTimestamp(course.startdate)}
                    </span>
                </div>
            </div>
            <div className="flex flex-1 flex-col space-y-3 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>{categoryName ?? `Category ${course.categoryid}`}</span>
                    <span>{sectionLabel}</span>
                </div>
                <div>
                    <p className="text-lg font-semibold text-slate-900">{course.fullname}</p>
                    <p className="text-xs text-slate-500">{course.shortname}</p>
                </div>
                <p className="text-sm text-slate-600">{summary || "Summary coming soon."}</p>
                <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#0F5E78]">
                    <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex items-center gap-1"
                    >
                        View course <ArrowRight className="h-3 w-3" />
                    </Link>
                    <span className="text-[11px] text-slate-500">
                        Starts {formatTimestamp(course.startdate)}
                    </span>
                </div>
            </div>
        </article>
    );
}
