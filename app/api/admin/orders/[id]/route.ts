import { NextResponse } from "next/server";
import type { OrderStatus } from "@prisma/client";
import { requireAdminApi } from "@/lib/session";
import { updateOrderStatus } from "@/lib/orders";

const VALID_STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi();
  if (guard.response) return guard.response;

  try {
    const { id } = await params;
    const body = await request.json();

    if (!VALID_STATUSES.includes(body.status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const order = await updateOrderStatus(id, body.status as OrderStatus);
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
