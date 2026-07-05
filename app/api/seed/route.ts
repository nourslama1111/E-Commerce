import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { products } from "@/lib/data";

export async function POST() {
  try {
    const existing = await prisma.product.count();
    if (existing > 0) {
      return NextResponse.json({ message: `Already seeded (${existing} products exist)` });
    }

    await prisma.product.createMany({
      data: products.map(({ id: _, ...rest }) => rest),
    });

    return NextResponse.json({ message: `Seeded ${products.length} products` });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
