import { Router } from "express";
import {
  getCoupons,
  getCouponByCode,
  saveCoupon,
  deleteCoupon,
  type Coupon,
} from "../lib/db-store.js";

const router = Router();

// POST /api/coupons/validate — check a coupon code
router.post("/coupons/validate", (req, res) => {
  const { code, orderValue } = req.body as { code: string; orderValue: number };

  if (!code) {
    return res.status(400).json({ error: "Coupon code is required" });
  }

  const coupon = getCouponByCode(code);

  if (!coupon || !coupon.isActive) {
    return res.status(404).json({ error: "Invalid or expired coupon code" });
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    return res.status(400).json({ error: "Coupon has expired" });
  }

  if (orderValue < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
    });
  }

  const rawDiscount = (orderValue * coupon.discountPercent) / 100;
  const discountAmount = Math.min(rawDiscount, coupon.maxDiscount);

  return res.json({
    coupon: {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount: Math.round(discountAmount),
      description: coupon.description,
    },
  });
});

// GET /api/coupons — admin list all
router.get("/coupons", (_req, res) => {
  return res.json({ coupons: getCoupons() });
});

// POST /api/coupons — admin create
router.post("/coupons", (req, res) => {
  const data = req.body as Omit<Coupon, "id">;
  if (!data.code || !data.discountPercent) {
    return res.status(400).json({ error: "Code and discount percent are required" });
  }

  const existing = getCouponByCode(data.code);
  if (existing) {
    return res.status(409).json({ error: "Coupon code already exists" });
  }

  const newCoupon: Coupon = {
    ...data,
    id: Date.now().toString(),
    code: data.code.toUpperCase().trim(),
    isActive: data.isActive ?? true,
  };

  saveCoupon(newCoupon);
  return res.status(201).json({ coupon: newCoupon });
});

// PATCH /api/coupons/:id — admin update
router.patch("/coupons/:id", (req, res) => {
  const coupons = getCoupons();
  const existing = coupons.find((c) => c.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Coupon not found" });
  }
  const updated: Coupon = { ...existing, ...req.body, id: existing.id };
  saveCoupon(updated);
  return res.json({ coupon: updated });
});

// DELETE /api/coupons/:id — admin delete
router.delete("/coupons/:id", (req, res) => {
  const deleted = deleteCoupon(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Coupon not found" });
  }
  return res.json({ success: true });
});

export default router;
