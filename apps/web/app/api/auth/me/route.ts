import { NextRequest, NextResponse } from "next/server";
import { getSessionIdentifier } from "lib/auth/session";
import { getMoodleClientWithToken } from "lib/moodle";

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const moodleToken = params.get("moodleToken");

  const cookieHeader = request.headers.get("cookie") ?? "";
  const identifier = getSessionIdentifier(cookieHeader);

  if (!moodleToken && !identifier) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  } else {
    try {
      const moodleClient = getMoodleClientWithToken(moodleToken as string);
      const user = await moodleClient.getMoodleUserByEmail(
        identifier as string,
      );
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load profile";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }
}
