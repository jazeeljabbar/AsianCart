import { Router } from "express";
import {
  getOrders,
  getOrdersByUserId,
  getOrderById,
  saveOrder,
  type Order,
  type OrderItem,
  getProductById,
} from "../lib/db-store.js";

const router = Router();

// POST /api/orders — place a new order
router.post("/orders", (req, res) => {
  const {
    userId,
    customerName,
    customerEmail,
    items,
    couponCode,
    discount,
    shippingAddress,
    paymentMethod,
  } = req.body as {
    userId: string;
    customerName: string;
    customerEmail: string;
    items: Array<{ productId: string; quantity: number }>;
    couponCode?: string;
    discount?: number;
    shippingAddress: Order["shippingAddress"];
    paymentMethod: string;
  };

  if (!items?.length || !shippingAddress || !paymentMethod) {
    return res.status(400).json({ error: "Items, shipping address and payment method are required" });
  }

  // Build order items with product data
  const orderItems: OrderItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    const linePrice = product.price * item.quantity;
    subtotal += linePrice;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      imageUrl: product.imageUrl,
      weight: product.weight,
    });
  }

  const discountAmount = discount ?? 0;
  const total = Math.max(0, subtotal - discountAmount);

  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    userId: userId ?? "guest",
    customerName: customerName ?? shippingAddress.fullName,
    customerEmail: customerEmail ?? "",
    items: orderItems,
    subtotal,
    discount: discountAmount,
    total,
    couponCode: couponCode ?? null,
    shippingAddress,
    paymentMethod,
    status: "Processing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveOrder(newOrder);
  return res.status(201).json({ order: newOrder });
});

// GET /api/orders — admin gets all, customer gets own
router.get("/orders", (req, res) => {
  const { userId, role } = req.query as { userId?: string; role?: string };

  let orders: Order[];
  if (role === "admin") {
    orders = getOrders();
  } else if (userId) {
    orders = getOrdersByUserId(userId);
  } else {
    orders = getOrders();
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return res.json({ orders, total: orders.length });
});

// GET /api/orders/:id
router.get("/orders/:id", (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  return res.json({ order });
});

// PATCH /api/orders/:id/status — admin only
router.patch("/orders/:id/status", (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const { status } = req.body as { status: Order["status"] };
  const validStatuses: Order["status"][] = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveOrder(order);

  return res.json({ order });
});

export default router;
