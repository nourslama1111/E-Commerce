import type { OrderStatus } from "@prisma/client";
import { prisma } from "./db";

export class OrderError extends Error {}

export interface ShippingDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface ValidatedOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// Prices and names are read from the database here, never trusted from the
// client — a tampered request body must not be able to change what an item
// actually costs. Shared by the direct-order path and the Stripe Checkout
// session path so a cart is re-priced identically either way.
export async function validateOrderItems(items: CartItemInput[]): Promise<ValidatedOrderItem[]> {
  if (items.length === 0) throw new OrderError("Your cart is empty");

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  return items.map(({ productId, quantity }) => {
    const product = productById.get(productId);
    if (!product) throw new OrderError("One of the items in your cart no longer exists");
    if (!product.inStock) throw new OrderError(`${product.name} is out of stock`);
    if (!Number.isInteger(quantity) || quantity < 1)
      throw new OrderError(`Invalid quantity for ${product.name}`);

    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
    };
  });
}

interface PersistOrderInput {
  userId: string;
  orderItems: ValidatedOrderItem[];
  shipping: ShippingDetails;
  status: OrderStatus;
  stripeSessionId?: string;
}

function persistOrder({ userId, orderItems, shipping, status, stripeSessionId }: PersistOrderInput) {
  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return prisma.order.create({
    data: {
      userId,
      status,
      stripeSessionId,
      subtotal,
      total: subtotal, // no shipping/tax calculation yet
      shippingName: shipping.name,
      shippingEmail: shipping.email,
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingZip: shipping.zip,
      shippingCountry: shipping.country,
      items: { create: orderItems },
    },
    include: { items: true },
  });
}

export interface CreateOrderInput {
  userId: string;
  items: CartItemInput[];
  shipping: ShippingDetails;
}

export async function createOrder(input: CreateOrderInput) {
  const { userId, items, shipping } = input;
  const orderItems = await validateOrderItems(items);
  return persistOrder({ userId, orderItems, shipping, status: "PENDING" });
}

export interface CreatePaidOrderInput {
  userId: string;
  orderItems: ValidatedOrderItem[];
  shipping: ShippingDetails;
  stripeSessionId: string;
}

// Used by the Stripe webhook once payment is confirmed. Takes the items as
// already validated/priced at Checkout Session creation time rather than
// re-reading the catalog — an order must reflect what the customer was
// actually charged, even if a price or stock level changes in the meantime.
export async function createPaidOrder(input: CreatePaidOrderInput) {
  const { userId, orderItems, shipping, stripeSessionId } = input;
  return persistOrder({ userId, orderItems, shipping, status: "PAID", stripeSessionId });
}

// Scoping the lookup by userId in the same query (rather than fetching by id
// and checking ownership after) means one user can never even learn that
// another user's order id exists.
export async function getOrderById(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    include: { items: true },
  });
}

export async function getOrderByStripeSessionId(stripeSessionId: string, userId: string) {
  return prisma.order.findFirst({
    where: { stripeSessionId, userId },
    include: { items: true },
  });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });
}
