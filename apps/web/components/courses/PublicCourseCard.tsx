import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    useGetCourseByIdQuery,
    useGetCategoryByIdQuery,
} from "store/apis/course.api";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80";

const stripHtml = (value?: string) =>
    value ? value.replace(/<[^>]*>/g, "").trim() : "";

const formatStartDate = (timestamp?: number) => {
    if (!timestamp) {
        return null;
    }
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const truncate = (value: string, max = 220) => {
    if (value.length <= max) return value;
    return `${value.slice(0, max).trim()}…`;
};

const PublicCourseCard = ({ course }: { course: MoodleCourseType }) => {
    const {
        data: courseDetail,
        isLoading,
        isError,
    } = useGetCourseByIdQuery(course.id);
    const courseMeta = courseDetail?.course ?? course;
    const previewImage = courseDetail?.photoUrl ?? FALLBACK_IMAGE;
    const summary = stripHtml(courseMeta.summary);
    const startDateLabel = formatStartDate(courseMeta.startdate);
    const moduleCount = courseDetail?.contents?.length;

    const { data: categoryDetail } = useGetCategoryByIdQuery(
        courseMeta.categoryid,
        {
            skip: !courseMeta.categoryid,
        },
    );

    return (
        <article className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:border-[#0F5E78]">
            <div className="relative h-56 w-full">
                <Image
                    src={previewImage}
                    alt={courseMeta.fullname}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-xs font-semibold uppercase tracking-[0.4em] text-white">
                        Loading
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 px-6 pb-6 pt-5">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">
                    <span>
                        {categoryDetail?.name ?? `Category ${courseMeta.categoryid}`}
                    </span>
                    {startDateLabel ? <span>{startDateLabel}</span> : null}
                </div>

                <h3 className="text-xl font-semibold leading-tight text-slate-900">
                    {courseMeta.fullname}
                </h3>

                <p className="text-sm text-slate-600">
                    {summary
                        ? truncate(summary, 200)
                        : "No summary is available for this course yet."}
                </p>

                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.4em] text-[#0F5E78]">
                    <span>
                        {moduleCount != null
                            ? `${moduleCount} module${moduleCount === 1 ? "" : "s"}`
                            : "Modules"}
                    </span>
                    <Link
                        href={`/courses/${courseMeta.idnumber || courseMeta.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.35em] text-[#0F5E78]"
                    >
                        View course <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {isError && (
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                        Unable to refresh metadata
                    </p>
                )}
            </div>
        </article>
    );
};

export default PublicCourseCard;
