import { Router } from "express";
import { getCategories, saveCategory, type Category } from "../lib/db-store.js";
import { getStats } from "../lib/db-store.js";

const router = Router();

// GET /api/categories
router.get("/categories", (_req, res) => {
  return res.json({ categories: getCategories() });
});

// POST /api/categories (admin)
router.post("/categories", (req, res) => {
  const data = req.body as Omit<Category, "id">;
  if (!data.name) {
    return res.status(400).json({ error: "Category name is required" });
  }
  const newCategory: Category = {
    ...data,
    id: Date.now().toString(),
    slug: data.name.toLowerCase().replace(/\s+/g, "-"),
    productCount: data.productCount ?? 0,
  };
  saveCategory(newCategory);
  return res.status(201).json({ category: newCategory });
});

// GET /api/admin/stats
router.get("/admin/stats", (_req, res) => {
  return res.json(getStats());
});

export default router;
