import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { validateOrderItems, OrderError, type ShippingDetails } from "@/lib/orders";

const REQUIRED_SHIPPING_FIELDS: (keyof ShippingDetails)[] = [
  "name",
  "email",
  "address",
  "city",
  "state",
  "zip",
  "country",
];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { items, shipping } = body as {
    items?: { productId: string; quantity: number }[];
    shipping?: Partial<ShippingDetails>;
  };

  if (!Array.isArray(items) || items.length === 0)
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });

  for (const field of REQUIRED_SHIPPING_FIELDS) {
    if (!shipping?.[field]?.trim())
      return NextResponse.json({ error: `Shipping ${field} is required` }, { status: 400 });
  }
  const validShipping = shipping as ShippingDetails;

  let orderItems;
  try {
    orderItems = await validateOrderItems(
      items.map((i) => ({ productId: i.productId, quantity: Number(i.quantity) }))
    );
  } catch (err) {
    if (err instanceof OrderError)
      return NextResponse.json({ error: err.message }, { status: 400 });
    return NextResponse.json({ error: "Failed to validate cart" }, { status: 500 });
  }

  const origin = new URL(request.url).origin;

  // The webhook persists the order from this same snapshot rather than
  // re-reading the catalog, so what gets saved always matches what Stripe
  // actually charged — even if a price or stock level changes before the
  // customer finishes paying. Keeping items/shipping in metadata (rather
  // than re-deriving them from Stripe line items) is only safe for
  // reasonably small carts: each metadata value is capped at 500 characters.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: validShipping.email,
    client_reference_id: user.id,
    line_items: orderItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: { name: item.productName },
      },
    })),
    metadata: {
      userId: user.id,
      items: JSON.stringify(orderItems),
      shippingName: validShipping.name,
      shippingEmail: validShipping.email,
      shippingAddress: validShipping.address,
      shippingCity: validShipping.city,
      shippingState: validShipping.state,
      shippingZip: validShipping.zip,
      shippingCountry: validShipping.country,
    },
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
  });

  if (!session.url)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });

  return NextResponse.json({ url: session.url });
}
