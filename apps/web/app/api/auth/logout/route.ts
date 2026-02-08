import { NextRequest, NextResponse } from "next/server";
import { getSessionClearCookieHeader } from "../../../../lib/auth/cookie";

const buildRedirectUrl = (request: NextRequest) => {
  const redirectTarget = request.nextUrl.searchParams.get("redirect") ?? "/";
  return new URL(redirectTarget, request.url);
};

const logoutResponse = (request: NextRequest) => {
  const response = NextResponse.redirect(buildRedirectUrl(request));
  response.headers.set("Set-Cookie", getSessionClearCookieHeader());
  return response;
};

export function GET(request: NextRequest) {
  return logoutResponse(request);
}

export function POST(request: NextRequest) {
  return logoutResponse(request);
}
