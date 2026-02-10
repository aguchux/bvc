"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Briefcase,
    Camera,
    Cpu,
    Stethoscope,
    Files,
    ArrowRight,
} from "lucide-react";
import {
    useListCoursesQuery,
    useListCategoriesQuery,
} from "../../store/apis/course.api";
import PublicCourseCard from "components/courses/PublicCourseCard";

type ProgrammeCard = {
    title: string;
    programmes: number;
    tuitionNow: string;
    tuitionWas?: string;
    imageSrc: string;
    icon: React.ReactNode;
    iconBg: string; // tailwind bg class
    href: string;
};

const cards: ProgrammeCard[] = [
    {
        title: "School of Computing",
        programmes: 5,
        tuitionWas: "₦350,000",
        tuitionNow: "₦320,000",
        imageSrc:
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
        icon: <Cpu className="h-5 w-5 text-white" />,
        iconBg: "bg-red-500",
        href: "/programmes/computing",
    },
    {
        title: "School of Communications and Media Studies",
        programmes: 1,
        tuitionWas: "₦300,000",
        tuitionNow: "₦280,000",
        imageSrc:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
        icon: <Camera className="h-5 w-5 text-white" />,
        iconBg: "bg-slate-900",
        href: "/programmes/media",
    },
    {
        title: "School of Management and Social Sciences",
        programmes: 7,
        tuitionWas: "₦300,000",
        tuitionNow: "₦280,000",
        imageSrc:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
        icon: <Briefcase className="h-5 w-5 text-white" />,
        iconBg: "bg-amber-300",
        href: "/programmes/management",
    },
    {
        title: "School of Allied Health Sciences",
        programmes: 2,
        tuitionWas: "₦350,000",
        tuitionNow: "₦320,000",
        imageSrc:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80",
        icon: <Stethoscope className="h-5 w-5 text-white" />,
        iconBg: "bg-slate-900",
        href: "/programmes/health",
    },
];

function ProgrammeCard({ item }: { item: ProgrammeCard }) {
    return (
        <div className="group overflow-hidden cursor-pointer rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:border-2 hover:border-[#0F5E78] programme-card">
            <div className="relative">
                <div className="relative h-56 w-full">
                    <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={false}
                    />
                </div>

                {/* floating icon */}
                <div className="absolute -bottom-6 right-6">
                    <div
                        className={[
                            "grid h-12 w-12 place-items-center rounded-full shadow-lg ring-4 ring-white",
                            item.iconBg,
                        ].join(" ")}
                    >
                        {item.icon}
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 pt-10">
                {/* meta */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Files className="h-4 w-4" />
                    <span>
                        {item.programmes} Programme{item.programmes > 1 ? "s" : ""}
                    </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold leading-snug text-slate-900">
                    {item.title}
                </h3>

                <div className="mt-5">
                    <p className="text-xs font-semibold tracking-widest text-slate-400">
                        TUITION PER SESSION
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                        {item.tuitionWas ? (
                            <span className="text-sm text-slate-400 line-through">
                                {item.tuitionWas}
                            </span>
                        ) : null}
                        <span className="text-lg font-semibold text-amber-700">
                            {item.tuitionNow}
                        </span>
                    </div>
                </div>

                <Link
                    href={item.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600"
                >
                    Learn more <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

export default function ProgrammesSection() {
    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
        error: categoriesError,
    } = useListCategoriesQuery();
    const {
        data: coursesData,
        isLoading,
        isError,
        error,
    } = useListCoursesQuery();

    if (isLoading) {
        return <div>Loading courses...</div>;
    }

    if (isError || !coursesData) {
        return <div>Error loading courses. Please try again later.</div>;
    }
    return (
        <section className="bg-slate-200 py-14 presence-relative programmes-section">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-lg font-bold text-[#0F5E78]">
                            OUR COURSES AND PROGRAMMES
                        </p>

                        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            BVC Programmes
                        </h2>

                        <p className="mt-4 max-w-2xl text-slate-900">
                            Our ever-growing catalogue of courses have been chosen to provide
                            students with skills relevant for the 21st century.
                        </p>
                    </div>
                    <Link
                        href="/programmes"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F5E78] hover:text-[#0F5E78]"
                    >
                        View all Programmes
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {coursesData.courses.map((course) => (
                        <PublicCourseCard key={course.id} course={course} />
                    ))}
                    {/* {cards.map((item) => (
                        <ProgrammeCard key={item.title} item={item} />
                    ))} */}
                </div>
            </div>
        </section>
    );
}
