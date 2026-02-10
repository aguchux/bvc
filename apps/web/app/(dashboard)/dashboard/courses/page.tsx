import { cookies } from "next/headers";
import EnrolledCoursesSection from "components/courses/EnrolledCoursesSection";
import { getAppOrigin } from "lib/app-url";

type EnrolledCoursesResponse = {
  user?: {
    id?: number;
    username?: string;
    fullname?: string;
  };
  courses?: MoodleCourseType[];
  error?: string;
};

export default async function Page() {
  const origin = getAppOrigin();
  const url = new URL("/api/courses/me", origin);
  const cookieHeader = cookies().toString();

  let courses: MoodleCourseType[] = [];
  let user: EnrolledCoursesResponse["user"];
  let error: string | null = null;

  try {
    const response = await fetch(url.toString(), {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      error = `Unable to load your courses (${response.status})`;
    } else {
      const payload = (await response.json()) as EnrolledCoursesResponse;
      courses = Array.isArray(payload?.courses) ? payload.courses : [];
      user = payload?.user;
      if (payload?.error) {
        error = payload.error;
      }
    }
  } catch (fetchError) {
    error =
      fetchError instanceof Error
        ? fetchError.message
        : "Unable to load your courses at this time.";
  }

  return (
    <EnrolledCoursesSection
      courses={courses}
      user={user}
      error={error}
    />
  );
}
