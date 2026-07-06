import { prisma } from "./db";
import type { Product } from "@/models/types";

export interface ProductQuery {
  category?: string; // category slug
  search?: string;
  sort?: string;
  page?: number;
}

export interface ProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
}

const PER_PAGE = 9;

type PrismaProductWithCategory = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  category: { id: string; name: string; slug: string; description: string };
  inStock: boolean;
  rating: number;
  reviewCount: number;
};

function serialize(doc: PrismaProductWithCategory): Product {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    categoryId: doc.categoryId,
    category: {
      id: doc.category.id,
      name: doc.category.name,
      slug: doc.category.slug,
      description: doc.category.description,
    },
    inStock: doc.inStock,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
  };
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductsResult> {
  const { category, search, sort = "newest", page = 1 } = query;

  const where = {
    ...(category ? { category: { slug: category } } : {}),
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const skip = (page - 1) * PER_PAGE;

  const [docs, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: PER_PAGE,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: docs.map(serialize),
    total,
    totalPages: Math.ceil(total / PER_PAGE),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const doc = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  return doc ? serialize(doc) : null;
}

export async function getFeaturedProducts(count = 3): Promise<Product[]> {
  const docs = await prisma.product.findMany({
    where: { inStock: true },
    take: count,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return docs.map(serialize);
}
