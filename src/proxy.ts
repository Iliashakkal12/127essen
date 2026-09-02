import { NextRequest, NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/server/admin-session";

/**
 * ⚠️ TEMPORARY — DEVELOPMENT ONLY ⚠️
 *
 * The WAGTI_ADMIN_CODE gate below is disabled by request (2026-09-02) so
 * the platform owner can check /admin without re-logging in on every new
 * preview URL while the app is under active, solo development. /admin is
 * NOT linked anywhere in the public site, but with this off, anyone who
 * gets the URL (a shared screenshot, browser history, etc.) can open it —
 * there is no lock on the door right now.
 *
 * MUST be re-enabled (see REAL_MIDDLEWARE below) before this app is
 * shared with anyone else or handles real data. The login page, API
 * routes, and session-cookie logic are all still fully in place and
 * tested — re-enabling is a one-line swap, not a rebuild.
 */
export async function proxy(request: NextRequest) {
  void request;
  return NextResponse.next();
}

// Re-enable by replacing the `proxy` export above with this one.
async function REAL_MIDDLEWARE(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authorized = await verifyAdminSessionToken(token);

  if (!authorized) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
void REAL_MIDDLEWARE;

export const config = {
  matcher: ["/admin/:path*"],
};
