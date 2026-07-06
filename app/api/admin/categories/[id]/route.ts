import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/session";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard.response) return guard.response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, slug, description } = body as Record<string, string>;

  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!slug?.trim()) return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  if (!/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ error: "Slug must be lowercase letters, numbers, and hyphens only" }, { status: 400 });

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() ?? "",
      },
    });
    return NextResponse.json(category);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "A category with this name or slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard.response) return guard.response;

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
