import { prisma } from "./db";

export class ReviewError extends Error {}

export interface RatingSummary {
  rating: number;
  reviewCount: number;
}

const EMPTY_SUMMARY: RatingSummary = { rating: 0, reviewCount: 0 };

export async function getRatingSummary(productId: string): Promise<RatingSummary> {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    rating: result._avg.rating ?? 0,
    reviewCount: result._count.rating,
  };
}

// Batched (one query, not N+1) so list views can show ratings without a
// per-product round trip.
export async function getRatingSummaries(productIds: string[]): Promise<Map<string, RatingSummary>> {
  if (productIds.length === 0) return new Map();

  const groups = await prisma.review.groupBy({
    by: ["productId"],
    where: { productId: { in: productIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return new Map(
    groups.map((g) => [g.productId, { rating: g._avg.rating ?? 0, reviewCount: g._count.rating }])
  );
}

export function summaryFor(summaries: Map<string, RatingSummary>, productId: string): RatingSummary {
  return summaries.get(productId) ?? EMPTY_SUMMARY;
}

export async function getReviewsByProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
}

export async function getUserReviewForProduct(productId: string, userId: string) {
  return prisma.review.findUnique({
    where: { productId_userId: { productId, userId } },
  });
}

export interface CreateReviewInput {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}

export async function createReview({ productId, userId, rating, comment }: CreateReviewInput) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    throw new ReviewError("Rating must be a whole number between 1 and 5");
  if (!comment.trim()) throw new ReviewError("Comment is required");

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) throw new ReviewError("Product not found");

  const existing = await getUserReviewForProduct(productId, userId);
  if (existing) throw new ReviewError("You've already reviewed this product");

  return prisma.review.create({
    data: { productId, userId, rating, comment: comment.trim() },
    include: { user: { select: { name: true } } },
  });
}
