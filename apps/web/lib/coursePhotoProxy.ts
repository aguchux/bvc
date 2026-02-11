import { NextRequest, NextResponse } from "next/server";
import { getMoodleClient, getMoodleClientWithToken } from "./moodle";
import { getSessionToken } from "./auth/session";

const CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=600";
const USER_AGENT = "Bonny-LMS-Proxy/1.0";

const errorResponse = (status: number) =>
  new NextResponse(null, {
    status,
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });

function mapMoodleErrorToHttp(e: any) {
  const msg = String(e?.message || e?.data?.message || "");
  if (msg.includes("Can't find data record in database")) return 404;
  if (msg.includes("Access control exception")) return 403;
  if (msg.includes("View courses without participation")) return 403;
  return 502;
}

async function resolveCourseId(paramsPromise: Promise<{ courseId?: string } | undefined>) {
  const resolvedParams = await paramsPromise;
  const rawId = resolvedParams?.courseId;
  if (!rawId) {
    return null;
  }
  const courseId = Number(rawId);
  if (!Number.isFinite(courseId) || Number.isNaN(courseId) || courseId <= 0) {
    return null;
  }
  return courseId;
}

export async function proxyCoursePhotoResponse(
  request: NextRequest,
  paramsPromise: Promise<{ courseId?: string } | undefined>,
): Promise<NextResponse> {
  const courseId = await resolveCourseId(paramsPromise);
  if (!courseId) {
    return errorResponse(400);
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const token =
    getSessionToken(cookieHeader) ?? request.nextUrl.searchParams.get("moodleToken");

  const moodleClient = token
    ? getMoodleClientWithToken(token)
    : getMoodleClient();

  try {
    const photoUrl = await moodleClient.getCoursePhoto(courseId);
    if (!photoUrl) {
      return errorResponse(404);
    }

    const remote = await fetch(photoUrl, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!remote.ok) {
      console.warn("Course photo fetch failed", {
        courseId,
        status: remote.status,
        statusText: remote.statusText,
      });
      return errorResponse(remote.status);
    }

    return new NextResponse(remote.body, {
      status: remote.status,
      headers: {
        "Content-Type": remote.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": CACHE_CONTROL,
      },
    });
  } catch (error) {
    const status = mapMoodleErrorToHttp(error);
    console.error("Course photo proxy error", { courseId, error });
    return errorResponse(status);
  }
}
