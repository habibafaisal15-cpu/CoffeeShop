import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-session";

const PROTECTED_API = [
  "/api/products/manage",
  "/api/categories/manage",
  "/api/upload",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) {
      if (authed) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!authed) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (
    pathname.match(/^\/api\/orders\/[^/]+$/) &&
    request.method === "PATCH"
  ) {
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (PROTECTED_API.some((route) => pathname.startsWith(route))) {
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/products/manage",
    "/api/categories/manage",
    "/api/upload",
    "/api/orders/:path*",
  ],
};
