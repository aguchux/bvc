import { NextRequest, NextResponse } from "next/server";
import { getSessionIdentifier } from "lib/auth/session";
import { getMoodleClient } from "lib/moodle";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ courseId?: string } | undefined> },
) {
  const resolvedParams = await params;
  const rawCourseId = resolvedParams?.courseId;
  if (!rawCourseId) {
    return NextResponse.json(
      { error: "Course ID is required to enroll." },
      { status: 400 },
    );
  }

  const courseId = Number(rawCourseId);
  if (!Number.isFinite(courseId) || Number.isNaN(courseId) || courseId <= 0) {
    return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
  }

  const identifier = getSessionIdentifier(_.headers.get("cookie") ?? "");
  if (!identifier) {
    return NextResponse.json(
      { error: "Sign in to enroll in courses." },
      { status: 401 },
    );
  }

  try {
    const moodleClient = getMoodleClient();

    const course = await moodleClient.getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const moodleUser = await moodleClient.getMoodleUserByEmail(identifier);
    if (!moodleUser) {
      return NextResponse.json(
        { error: "Authenticated profile could not be resolved." },
        { status: 404 },
      );
    }

    const enrolledCourses = await moodleClient.getUserCourses(moodleUser.id);
    if (
      Array.isArray(enrolledCourses) &&
      enrolledCourses.some((enrolled) => Number(enrolled?.id) === courseId)
    ) {
      return NextResponse.json(
        { enrolled: true, message: "You are already enrolled." },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { enrolled: false, message: "You are not enrolled in this course." },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to enroll in course";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
