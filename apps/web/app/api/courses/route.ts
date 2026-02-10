import { NextRequest, NextResponse } from "next/server";
import { getMoodleClient } from "../../../lib/moodle";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function stripDefaultCoursePayload(data: any[]): any[] {
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
}

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const offsetParam = request.nextUrl.searchParams.get("offset");
  const limit = clamp(Number(limitParam ?? "20") || 20, 1, 200);
  const offset = Math.max(0, Number(offsetParam ?? "0") || 0);

  try {
    const moodleClient = getMoodleClient();
    const courses = await moodleClient.getPublicCourses();
    const filteredCourses = stripDefaultCoursePayload(
      Array.isArray(courses) ? courses : [],
    );
    return NextResponse.json({
      courses: filteredCourses,
      meta: {
        offset,
        limit,
        count: filteredCourses.length,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch courses from Moodle";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
