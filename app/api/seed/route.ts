import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { seedCategories, seedProducts } from "@/lib/data";

export async function POST() {
  try {
    const [existingCats, existingProducts] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
    ]);

    if (existingCats > 0 || existingProducts > 0) {
      return NextResponse.json({
        message: "Already seeded",
        categories: existingCats,
        products: existingProducts,
      });
    }

    // 1. Seed categories
    await prisma.category.createMany({ data: seedCategories });

    // 2. Build a name → id map
    const categories = await prisma.category.findMany();
    const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

    // 3. Seed products using real categoryId
    await prisma.product.createMany({
      data: seedProducts.map(({ categoryName, ...rest }) => ({
        ...rest,
        categoryId: catMap[categoryName],
      })),
    });

    return NextResponse.json({
      message: "Seeded successfully",
      categories: seedCategories.length,
      products: seedProducts.length,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
