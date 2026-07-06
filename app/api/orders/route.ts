import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createOrder, OrderError, type ShippingDetails } from "@/lib/orders";

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

  try {
    const order = await createOrder({
      userId: user.id,
      items: items.map((i) => ({ productId: i.productId, quantity: Number(i.quantity) })),
      shipping: shipping as ShippingDetails,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof OrderError)
      return NextResponse.json({ error: err.message }, { status: 400 });
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
