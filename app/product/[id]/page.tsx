import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductById } from "@/lib/products";
import { getReviewsByProduct, getUserReviewForProduct } from "@/lib/reviews";
import { getCurrentUser } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import ReviewForm from "@/components/ReviewForm";

interface Props {
  params: Promise<{ id: string }>;
}

const CATEGORY_BG: Record<string, string> = {
  Apparel: "bg-blue-50 dark:bg-blue-950",
  Accessories: "bg-amber-50 dark:bg-amber-950",
  Bags: "bg-emerald-50 dark:bg-emerald-950",
  Home: "bg-rose-50 dark:bg-rose-950",
};

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= filled ? "text-amber-400" : "text-zinc-200 dark:text-zinc-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-zinc-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const [reviews, user] = await Promise.all([getReviewsByProduct(id), getCurrentUser()]);
  const existingReview = user ? await getUserReviewForProduct(id, user.id) : null;

  const imageBg = CATEGORY_BG[product.category.name] ?? "bg-zinc-100 dark:bg-zinc-800";

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/products" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
          Products
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        {product.image ? (
          <div className="relative h-96 overflow-hidden rounded-3xl lg:h-[520px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              preload
            />
          </div>
        ) : (
          <div className={`h-96 rounded-3xl lg:h-[520px] ${imageBg}`} />
        )}

        {/* Product info */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {product.category.name}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-zinc-500">({product.reviewCount} reviews)</span>
          </div>

          <p className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">
            {formatPrice(product.price)}
          </p>

          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-400"}`}
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <AddToCartButton
            product={product}
            className="mt-8 w-full py-4 text-base font-semibold sm:w-72"
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 max-w-2xl border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        <div className="mt-6">
          {user ? (
            existingReview ? (
              <p className="text-sm text-zinc-500">You&apos;ve already reviewed this product.</p>
            ) : (
              <ReviewForm productId={product.id} />
            )
          ) : (
            <p className="text-sm text-zinc-500">
              <Link
                href={`/login?callbackUrl=/product/${product.id}`}
                className="font-medium text-zinc-900 underline dark:text-white"
              >
                Sign in
              </Link>{" "}
              to leave a review.
            </p>
          )}
        </div>

        {reviews.length > 0 && (
          <ul className="mt-8 divide-y divide-zinc-100 dark:divide-zinc-800">
            {reviews.map((review) => (
              <li key={review.id} className="py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {review.user.name ?? "Anonymous"}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-sm text-zinc-400">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
