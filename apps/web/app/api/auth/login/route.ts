import { NextRequest, NextResponse } from "next/server";
import {
    buildSessionValue,
    getSessionCookieHeader,
} from "lib/auth/cookie";
import { getMoodleLoginClient } from "lib/moodle";

export async function POST(request: NextRequest) {
    const { username, email, password } = (await request
        .json()
        .catch(() => ({}) as any)) as {
            username?: string;
            email?: string;
            password?: string;
        };

    if (!password || (!username && !email)) {
        return NextResponse.json(
            { error: "Username/email and password are required." },
            { status: 400 },
        );
    }

    const identifier = (username || email)?.trim();
    if (!identifier) {
        return NextResponse.json(
            { error: "Username/email is required." },
            { status: 400 },
        );
    }

    try {
        const moodleClient = getMoodleLoginClient();
        const tokenPayload = await moodleClient.login(identifier, password);
        let userRecord = null;
        try {
            const results = await moodleClient.getUserByField("username", identifier);
            userRecord = Array.isArray(results) ? (results[0] ?? null) : null;
        } catch (err) {
            // silently ignore metadata failures
        }

        const response = NextResponse.json(
            {
                user: userRecord,
                moodleToken: tokenPayload.token,
            },
            { status: 200 },
        );
        response.headers.set(
            "Set-Cookie",
            getSessionCookieHeader(
                undefined,
                buildSessionValue(identifier, tokenPayload.token),
            ),
        );
        return response;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unable to authenticate";
        return NextResponse.json({ error: message }, { status: 401 });
    }
}
