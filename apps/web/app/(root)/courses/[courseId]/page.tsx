import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CourseDetailScreen } from "./CourseDetailScreen";
import { getMoodleClient, getMoodleClientWithToken } from "lib/moodle";

const stripHtml = (value?: string) => {
    if (!value) return "";
    return value.replace(/<[^>]*>/g, "").trim();
};

type CourseRouteParams = {
    params: Promise<{ courseId?: string } | undefined>;
};


export async function generateMetadata({
    params,
}: CourseRouteParams): Promise<Metadata> {
    const resolvedParams = await params;
    const rawId = resolvedParams?.courseId;
    const courseId = Number(rawId);
    if (!rawId || !Number.isFinite(courseId) || courseId <= 0) {
        return {
            title: "Course details — Bonny Vocational Center",
            description: "View course details and enrol via the student portal.",
        };
    }

    try {
        const client = getMoodleClient();
        const course = await client.getCourseById(courseId);
        return {
            title: `${course?.fullname} — Bonny Vocational Center courses`,
            description:
                stripHtml(course?.summary) ||
                `Explore ${course?.fullname} and enroll through the portal   `,
        };
    } catch (_error) {
        return {
            title: "Course not found — Bonny Vocational Center",
            description: "We could not load that course.",
        };
    }
}


export default async function CourseDetailPage({
    params,
}: CourseRouteParams) {
    const resolvedParams = await params;
    const rawId = resolvedParams?.courseId;
    const courseId = Number(rawId);
    if (!rawId || !Number.isFinite(courseId) || courseId <= 0) {
        notFound();
    }

    const client = getMoodleClient();
    const course = await client.getCourseById(courseId);
    const photoUrl = await client.getCoursePhoto(courseId);
    const photoProxyUrl = photoUrl ? `/api/courses/${courseId}/photo` : null;
    const contents = await client.getCourseContents(courseId);
    const categoryData = await client.getCategoryById(course?.categoryid ?? 0);

    const category = categoryData?.category;

    if (!course) {
        notFound();
    }
    return (
        <>
            <CourseDetailScreen
                course={course}
                photoUrl={photoUrl}
                photoProxyUrl={photoProxyUrl}
                contents={contents ?? []}
                category={category}
            />
        </>
    );
}
