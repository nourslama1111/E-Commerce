import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.price !== undefined && Number(body.price) <= 0)
      return NextResponse.json({ error: "Price must be greater than 0" }, { status: 400 });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name:        body.name?.trim(),
        description: body.description?.trim(),
        price:       body.price ? Number(body.price) : undefined,
        image:       body.image?.trim(),
        categoryId:  body.categoryId,
        inStock:     body.inStock,
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
