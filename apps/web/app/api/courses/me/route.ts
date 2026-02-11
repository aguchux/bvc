import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "lib/auth/session";
import { getMoodleClientWithToken } from "lib/moodle";

type SiteInfoResponse = {
    userid?: number;
    username?: string;
    fullname?: string;
    firstname?: string;
    lastname?: string;
};

function formatFullName(info: SiteInfoResponse) {
    if (info.fullname) {
        return info.fullname;
    }
    const parts = [info.firstname, info.lastname].filter(Boolean);
    return parts.length ? parts.join(" ") : undefined;
}

export async function GET(request: NextRequest) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const token =
        getSessionToken(cookieHeader) ??
        request.nextUrl.searchParams.get("moodleToken");

    if (!token) {
        return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 },
        );
    }

    try {
        const client = getMoodleClientWithToken(token);
        const siteInfo = await client.call<SiteInfoResponse>(
            "core_webservice_get_site_info",
        );
        const userId = siteInfo?.userid;
        if (!userId) {
            throw new Error("Unable to determine Moodle user ID");
        }

        const courses = await client.getUserCourses(userId);

        return NextResponse.json({
            user: {
                id: userId,
                username: siteInfo.username,
                fullname: formatFullName(siteInfo),
            },
            courses: Array.isArray(courses) ? courses : [],
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unable to load courses";
        return NextResponse.json({ error: message }, { status: 502 });
    }
}
