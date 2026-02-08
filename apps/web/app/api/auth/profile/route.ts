import { NextRequest, NextResponse } from "next/server";

type StoredProfile = Record<string, unknown>;

const profileStore = new Map<string, StoredProfile>();

function resolveOpenId(raw?: string | null) {
  const trimmed = raw?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export async function GET(request: NextRequest) {
  const openId = resolveOpenId(request.nextUrl.searchParams.get("openId"));
  if (!openId) {
    return NextResponse.json({ error: "openId is required" }, { status: 400 });
  }

  const stored = profileStore.get(openId) ?? null;
  return NextResponse.json({ profile: stored });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    openId?: string;
    profile?: StoredProfile;
  } | null;

  const openId = resolveOpenId(body?.openId);
  const profile =
    body?.profile && typeof body.profile === "object" ? body.profile : null;

  if (!openId) {
    return NextResponse.json({ error: "openId is required" }, { status: 400 });
  }

  if (!profile) {
    return NextResponse.json(
      { error: "Profile payload is required" },
      { status: 400 },
    );
  }

  profileStore.set(openId, profile);
  return NextResponse.json({ profile }, { status: 200 });
}
