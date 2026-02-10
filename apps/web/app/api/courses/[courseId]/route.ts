import { NextRequest, NextResponse } from "next/server";
import { getMoodleClient } from "lib/moodle";


function mapMoodleErrorToHttp(e: any) {
    const msg = String(e?.message || e?.data?.message || "");
    if (msg.includes("Can't find data record in database")) return 404;
    if (msg.includes("Access control exception")) return 403;
    return 502;
}

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ courseId?: string } | undefined> },
) {
    const resolvedParams = await params;
    const rawId = resolvedParams?.courseId;
    if (!rawId) {
        return NextResponse.json(
            { error: "Course ID is required" },
            { status: 400 },
        );
    }

    const courseId = Number(rawId);
    if (!Number.isFinite(courseId) || Number.isNaN(courseId) || courseId <= 0) {
        return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    try {
        const moodleClient = getMoodleClient();
        const course = await moodleClient.getCourseById(courseId);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const [category, photoUrl, contents] = await Promise.all([
            course.categoryid
                ? moodleClient.getCategoryById(course.categoryid)
                : Promise.resolve(null),
            moodleClient.getCoursePhoto(courseId),
            moodleClient.getCourseContents(courseId),
        ]);

        console.log(`Course ${courseId} details fetched successfully`);

        return NextResponse.json(
            {
                course,
                photoUrl,
                category: category
                    ? {
                        id: category.id,
                        name: category.name,
                    }
                    : null,
                contents: Array.isArray(contents) ? contents : [],
            },
            { status: 200 },
        );
    } catch (error) {
        const status = mapMoodleErrorToHttp(error);
        const message =
            error instanceof Error ? error.message : "Unable to load course details";
        return NextResponse.json({ error: message }, { status });
    }
}

