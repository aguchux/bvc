import { NextRequest, NextResponse } from "next/server";
import { getMoodleClient } from "../../../lib/moodle";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const offsetParam = request.nextUrl.searchParams.get("offset");
  const limit = clamp(Number(limitParam ?? "20") || 20, 1, 200);
  const offset = Math.max(0, Number(offsetParam ?? "0") || 0);

  try {
    const moodleClient = getMoodleClient();
    const courses = await moodleClient.getPublicCourses();
    return NextResponse.json({
      courses: Array.isArray(courses) ? courses : [],
      meta: {
        offset,
        limit,
        count: Array.isArray(courses) ? courses.length : 0,
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
