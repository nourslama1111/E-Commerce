import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Optimistic, cookie-only check (no DB hit) that gate-keeps /admin and
// /api/admin. This is the first line of defense; each admin Route Handler
// re-checks via requireAdminApi() since Proxy alone isn't sufficient — see
// lib/session.ts.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const user = req.auth?.user;

  if (!user) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user.role !== "ADMIN") {
    if (isApiRoute) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
