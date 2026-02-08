import { NextRequest, NextResponse } from "next/server";
import {
  buildSessionValue,
  getSessionCookieHeader,
} from "../../../lib/auth/cookie";
import { createMoodleUser } from "../../../lib/moodle";
import { getMoodleClient } from "lib/moodle";
export const runtime = "nodejs";

const MIN_PASSWORD_LENGTH = 8;

function validatePayload(payload: Record<string, unknown>) {
  const { username, email, password, firstname, lastname } = payload;
  if (!username || !email || !password || !firstname || !lastname) {
    return "All fields (username, email, password, firstname, lastname) are required.";
  }
  if (typeof password === "string" && password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const payload =
    (await request.json().catch(() => ({}) as Record<string, unknown>)) ?? {};
  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { username, email, password, firstname, lastname } = payload as {
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  };

  try {
    const client = getMoodleClient();
    const moodleUser = await createMoodleUser({
      username,
      password,
      firstname,
      lastname,
      email,
    });
    const tokenPayload = await client.login(username, password);

    const response = NextResponse.json(
      {
        user: {
          id: moodleUser.id,
          username: moodleUser.username,
          email: moodleUser.email ?? email,
          firstname: moodleUser.firstname,
          lastname: moodleUser.lastname,
        },
        moodleToken: tokenPayload.token,
      },
      { status: 201 },
    );
    response.headers.set(
      "Set-Cookie",
      getSessionCookieHeader(
        undefined,
        buildSessionValue(username, tokenPayload.token),
      ),
    );
    return response;
  } catch (error) {
    console.error("Moodle register error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create Moodle account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
