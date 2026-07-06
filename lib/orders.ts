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

export interface CreateOrderInput {
  userId: string;
  items: { productId: string; quantity: number }[];
  shipping: ShippingDetails;
}

export async function createOrder(input: CreateOrderInput) {
  const { userId, items, shipping } = input;

  if (items.length === 0) throw new OrderError("Your cart is empty");

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  // Prices and names are read from the database here, never trusted from the
  // client — a tampered request body must not be able to change what an item
  // actually costs.
  const orderItems = items.map(({ productId, quantity }) => {
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

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return prisma.order.create({
    data: {
      userId,
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

// Scoping the lookup by userId in the same query (rather than fetching by id
// and checking ownership after) means one user can never even learn that
// another user's order id exists.
export async function getOrderById(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    include: { items: true },
  });
}
