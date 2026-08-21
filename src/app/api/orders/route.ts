import { NextRequest, NextResponse } from "next/server";
import {
  addOrder,
  calculatePoints,
  generateOrderId,
  getOrders,
} from "@/lib/db";
import { Order, OrderItem, ServiceType } from "@/lib/types";

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    items,
    subtotal,
    total,
    serviceType,
    deliveryInstructions,
  } = body as {
    items: OrderItem[];
    subtotal: number;
    total: number;
    serviceType: ServiceType;
    deliveryInstructions?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: generateOrderId(),
    items,
    subtotal,
    total,
    serviceType,
    status: "pending",
    deliveryInstructions,
    pointsEarned: calculatePoints(total, serviceType),
    createdAt: now,
    updatedAt: now,
  };

  addOrder(order);
  return NextResponse.json(order, { status: 201 });
}
