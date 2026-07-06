import "server-only";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";

export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  return session?.user ?? null;
}

// For Server Components / layouts / pages: redirects instead of rendering.
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

// For Route Handlers: no redirect (an API route can't send the browser
// somewhere useful), so the caller gets a ready-to-return 401/403 instead.
export async function requireAdminApi(): Promise<
  { user: CurrentUser; response?: undefined } | { user?: undefined; response: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (user.role !== "ADMIN") {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user };
}
