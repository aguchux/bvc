import { NextRequest, NextResponse } from "next/server";
import { getMoodleClient } from "../../../../lib/moodle";

const VALID_FIELDS = ["username", "email", "id"] as const;

type ValidField = (typeof VALID_FIELDS)[number];

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const explicitField = params.get("field");
    const explicitValue = params.get("value");

    let field: ValidField | null = null;
    let value: string | null = null;

    if (params.has("username")) {
        field = "username";
        value = params.get("username");
    } else if (params.has("email")) {
        field = "email";
        value = params.get("email");
    } else if (params.has("id")) {
        field = "id";
        value = params.get("id");
    } else if (
        explicitField &&
        explicitValue &&
        VALID_FIELDS.includes(explicitField as ValidField)
    ) {
        field = explicitField as ValidField;
        value = explicitValue;
    }

    if (!field || !value) {
        return NextResponse.json(
            {
                error:
                    "Query must include `username`, `email`, or `id` (or provide `field`+`value`).",
            },
            { status: 400 },
        );
    }

    const normalizedValue =
        field === "id" ? String(parseInt(value, 10)) : value.trim();
    if (field === "id" && Number.isNaN(Number(normalizedValue))) {
        return NextResponse.json(
            { error: "User ID must be a number." },
            { status: 400 },
        );
    }

    try {
        const moodleClient = getMoodleClient();
        const user = await moodleClient.getUserByField(field, normalizedValue);
        const payload = Array.isArray(user) && user.length > 0 ? user[0] : null;
        return NextResponse.json(
            { user: payload, field, value: normalizedValue },
            { status: 200 },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unable to fetch user";
        return NextResponse.json({ error: message }, { status: 502 });
    }
}
