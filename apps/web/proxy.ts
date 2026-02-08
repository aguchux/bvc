import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionToken } from "./lib/auth/session";

/**
 * Protected route patterns that should not be indexed by search engines
 * and require an authenticated session.
 */
const PROTECTED_ROUTES = ["/dashboard"];

const AUTH_PAGES = ["/auth", "/auth/register"];

/**
 * Middleware to enforce authentication and add X-Robots-Tag header for protected routes.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const token = getSessionToken(request.headers.get("cookie") ?? undefined);

  // Redirect authenticated users away from auth pages
  if (AUTH_PAGES.includes(pathname) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Add SEO guardrails on protected content
  if (isProtectedRoute) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet",
    );
  }

  return response;
}

/**
 *
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|imgs|socials|app-icons).*)",
  ],
};
