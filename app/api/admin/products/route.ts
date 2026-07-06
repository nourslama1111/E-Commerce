import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/session";

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard.response) return guard.response;

  try {
    const body = await request.json();

    if (!body.name?.trim())        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!body.description?.trim()) return NextResponse.json({ error: "Description is required" }, { status: 400 });
    if (!body.categoryId)          return NextResponse.json({ error: "Category is required" }, { status: 400 });
    if (!body.price || Number(body.price) <= 0)
      return NextResponse.json({ error: "Price must be greater than 0" }, { status: 400 });

    const product = await prisma.product.create({
      data: {
        name:        body.name.trim(),
        description: body.description.trim(),
        price:       Number(body.price),
        image:       body.image?.trim() ?? "",
        categoryId:  body.categoryId,
        inStock:     Boolean(body.inStock),
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
