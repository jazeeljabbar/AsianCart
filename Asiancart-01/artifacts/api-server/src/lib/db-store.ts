import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(process.cwd(), "artifacts/db.json");

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "customer";
  name: string;
  phone: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  weight: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  imageUrl: string;
  description: string;
  isFeatured: boolean;
  badge: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  weight: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  status: "Processing" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

interface DbStore {
  users: User[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
}

function read(): DbStore {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as DbStore;
  } catch (err) {
    console.error("Failed to read DB at path:", DB_PATH);
    console.error(err);
    return { users: [], products: [], categories: [], orders: [], coupons: [] };
  }
}

function write(data: DbStore): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Users ───────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  return read().users;
}

export function getUserById(id: string): User | undefined {
  return read().users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return read().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function saveUser(user: User): void {
  const db = read();
  const idx = db.users.findIndex((u) => u.id === user.id);
  if (idx >= 0) db.users[idx] = user;
  else db.users.push(user);
  write(db);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  return read().products;
}

export function getProductById(id: string): Product | undefined {
  return read().products.find((p) => p.id === id);
}

export function saveProduct(product: Product): void {
  const db = read();
  const idx = db.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) db.products[idx] = product;
  else db.products.push(product);
  write(db);
}

export function deleteProduct(id: string): boolean {
  const db = read();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  write(db);
  return db.products.length < before;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return read().categories;
}

export function saveCategory(category: Category): void {
  const db = read();
  const idx = db.categories.findIndex((c) => c.id === category.id);
  if (idx >= 0) db.categories[idx] = category;
  else db.categories.push(category);
  write(db);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function getOrders(): Order[] {
  return read().orders;
}

export function getOrdersByUserId(userId: string): Order[] {
  return read().orders.filter((o) => o.userId === userId);
}

export function getOrderById(id: string): Order | undefined {
  return read().orders.find((o) => o.id === id);
}

export function saveOrder(order: Order): void {
  const db = read();
  const idx = db.orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) db.orders[idx] = order;
  else db.orders.push(order);
  write(db);
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export function getCoupons(): Coupon[] {
  return read().coupons;
}

export function getCouponByCode(code: string): Coupon | undefined {
  return read().coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );
}

export function saveCoupon(coupon: Coupon): void {
  const db = read();
  const idx = db.coupons.findIndex((c) => c.id === coupon.id);
  if (idx >= 0) db.coupons[idx] = coupon;
  else db.coupons.push(coupon);
  write(db);
}

export function deleteCoupon(id: string): boolean {
  const db = read();
  const before = db.coupons.length;
  db.coupons = db.coupons.filter((c) => c.id !== id);
  write(db);
  return db.coupons.length < before;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function getStats() {
  const db = read();
  const totalRevenue = db.orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = db.orders.length;
  const totalUsers = db.users.filter((u) => u.role === "customer").length;
  const totalProducts = db.products.length;
  const lowStockProducts = db.products.filter((p) => p.stock < 20).length;

  return { totalRevenue, totalOrders, totalUsers, totalProducts, lowStockProducts };
}
