from pathlib import Path
path = Path('app/(root)/courses/[courseId]/page.tsx')
content = '''import { notFound } from  next/navigation;
import type { Metadata } from next;
import { CourseDetailScreen } from ./CourseDetailScreen;
import { getAppOrigin } from lib/app-url;

type CourseRouteParams = {
    params: Promise<{ courseId?: string } | undefined>;
};

type CourseDetailPayload = {
    course: MoodleCourseType;
    photoUrl: string | null;
    contents: any[];
    category: { id: number; name?: string } | null;
};

const stripHtml = (value?: string) => {
    if (!value) return ;
 return value.replace(/<[^>]*>/g, ).trim();
};

async function loadCourse(courseId: number): Promise<CourseDetailPayload> {
    const url = new URL(/api/courses/, getAppOrigin());
    const response = await fetch(url.toString(), { cache: no-store });
    if (!response.ok) {
        throw new Error(Unable to fetch course ());
    }

    const payload = (await response.json()) as CourseDetailPayload;
    if (!payload?.course) {
        throw new Error(Course data missing);
    }

    return payload;
}

export async function generateMetadata({
    params,
}: CourseRouteParams): Promise<Metadata> {
    const resolvedParams = await params;
    const rawId = resolvedParams?.courseId;
    const courseId = Number(rawId);
    if (!rawId || !Number.isFinite(courseId) || courseId <= 0) {
        return {
            title: Course details — Bonny Vocational Center,
            description: View course details and enrol via the student portal.,
        };
    }

    try {
        const { course } = await loadCourse(courseId);
        return {
            title: ${course.fullname} — Bonny Vocational Center courses,
            description:
                stripHtml(course.summary) ||
                Explore  and enroll through the portal.,
        };
    } catch (_error) {
        return {
            title: Course not found — Bonny Vocational Center,
            description: We could not load that course.,
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

    const { course, photoUrl, contents, category } = await loadCourse(courseId);

    return (
        <CourseDetailScreen
            course={course}
            photoUrl={photoUrl}
            contents={contents}
            category={category}
        />
    );
}
'''
path.write_text(content)
