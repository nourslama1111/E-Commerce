import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { createPaidOrder, type ShippingDetails, type ValidatedOrderItem } from "@/lib/orders";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const { userId, items } = metadata;

    if (!userId || !items) {
      return NextResponse.json({ error: "Missing metadata on session" }, { status: 400 });
    }

    const shipping: ShippingDetails = {
      name: metadata.shippingName ?? "",
      email: metadata.shippingEmail ?? "",
      address: metadata.shippingAddress ?? "",
      city: metadata.shippingCity ?? "",
      state: metadata.shippingState ?? "",
      zip: metadata.shippingZip ?? "",
      country: metadata.shippingCountry ?? "",
    };

    try {
      await createPaidOrder({
        userId,
        orderItems: JSON.parse(items) as ValidatedOrderItem[],
        shipping,
        stripeSessionId: session.id,
      });
    } catch (err) {
      // Stripe may redeliver the same event; a unique-constraint violation on
      // stripeSessionId just means this session was already recorded, so it
      // is acknowledged rather than retried.
      const isDuplicate =
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
      if (!isDuplicate) {
        return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
