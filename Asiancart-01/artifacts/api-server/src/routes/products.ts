import { Router } from "express";
import {
  getProducts,
  getProductById,
  saveProduct,
  deleteProduct,
  type Product,
} from "../lib/db-store.js";

const router = Router();

// GET /api/products
router.get("/products", (req, res) => {
  let products = getProducts();

  const { category, search, featured, sort } = req.query as Record<string, string>;

  if (category) {
    products = products.filter((p) =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (featured === "true") {
    products = products.filter((p) => p.isFeatured);
  }

  if (sort === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === "discount") {
    products.sort((a, b) => b.discount - a.discount);
  }

  return res.json({ products, total: products.length });
});

// GET /api/products/:id
router.get("/products/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  return res.json({ product });
});

// POST /api/products (admin)
router.post("/products", (req, res) => {
  const data = req.body as Omit<Product, "id">;
  if (!data.name || !data.price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const newProduct: Product = {
    ...data,
    id: Date.now().toString(),
    slug: data.name.toLowerCase().replace(/\s+/g, "-"),
    reviews: data.reviews ?? 0,
    badge: data.badge ?? null,
    isFeatured: data.isFeatured ?? false,
  };

  saveProduct(newProduct);
  return res.status(201).json({ product: newProduct });
});

// PATCH /api/products/:id (admin)
router.patch("/products/:id", (req, res) => {
  const existing = getProductById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updated: Product = { ...existing, ...req.body, id: existing.id };
  saveProduct(updated);
  return res.json({ product: updated });
});

// DELETE /api/products/:id (admin)
router.delete("/products/:id", (req, res) => {
  const deleted = deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Product not found" });
  }
  return res.json({ success: true });
});

export default router;
