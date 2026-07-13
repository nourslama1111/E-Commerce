import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getReviewsByProduct, createReview, ReviewError } from "@/lib/reviews";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviews = await getReviewsByProduct(id);
  return NextResponse.json(reviews);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  try {
    const review = await createReview({
      productId: id,
      userId: user.id,
      rating: Number(body.rating),
      comment: String(body.comment ?? ""),
    });
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    if (err instanceof ReviewError)
      return NextResponse.json({ error: err.message }, { status: 400 });
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
