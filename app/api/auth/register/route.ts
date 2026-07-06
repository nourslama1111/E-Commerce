import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, email, password } = body as Record<string, string>;

  if (!name?.trim() || name.trim().length < 2)
    return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
  if (!email?.trim() || !EMAIL_RE.test(email.trim()))
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  if (!password || password.length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing)
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  // Bootstrap: the very first account registered becomes the admin so
  // there's a way into /admin without anyone hand-editing the database.
  const isFirstUser = (await prisma.user.count()) === 0;

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: await hashPassword(password),
      role: isFirstUser ? "ADMIN" : "USER",
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user, { status: 201 });
}
