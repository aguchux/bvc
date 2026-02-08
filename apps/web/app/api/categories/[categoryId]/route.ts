import { NextRequest, NextResponse } from "next/server";
import { getMoodleClient } from "../../../../lib/moodle";

type CategoryRouteParams = {
    categoryId?: string;
};

type CategoryRecord = Record<string, unknown>;

const normalizeCategory = (payload: unknown): CategoryRecord | null => {
    if (!payload) {
        return null;
    }

    if (Array.isArray(payload)) {
        const [first] = payload;
        return first && typeof first === "object" ? (first as CategoryRecord) : null;
    }

    if (typeof payload === "object") {
        return payload as CategoryRecord;
    }

    return null;
};

export async function GET(_: NextRequest, { params }: { params: Promise<CategoryRouteParams> }) {
    const resolvedParams = await params;
    const rawId = resolvedParams?.categoryId;
    if (!rawId) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const categoryId = Number(rawId);
    if (!Number.isFinite(categoryId) || Number.isNaN(categoryId) || categoryId <= 0) {
        return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    try {
        const moodleClient = getMoodleClient();
        const categoryPayload = await moodleClient.getCategoryById(categoryId);
        const category = normalizeCategory(categoryPayload);

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const [categoriesPayload, coursesPayload] = await Promise.all([
            moodleClient.getCategories(),
            moodleClient.getPublicCourses(),
        ]);

        const subcategories = Array.isArray(categoriesPayload)
            ? categoriesPayload.filter((item: any) => Number(item?.parent ?? 0) === categoryId)
            : [];

        const courses = Array.isArray(coursesPayload)
            ? coursesPayload.filter((course: any) => Number(course?.categoryid ?? 0) === categoryId)
            : [];

        return NextResponse.json(
            {
                category,
                subcategories,
                courses,
            },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load category details";
        return NextResponse.json({ error: message }, { status: 502 });
    }
}
