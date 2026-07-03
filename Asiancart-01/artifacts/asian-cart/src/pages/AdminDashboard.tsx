import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Users,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  category: string;
  weight: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  stock: number;
  imageUrl: string;
  description: string;
  isFeatured: boolean;
  badge: string | null;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: "Processing" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockProducts: number;
}

const STATUS_COLORS: Record<string, string> = {
  Processing: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const ORDER_STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const API = "http://localhost:5000/api";

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T | null> {
  try {
    const token = localStorage.getItem("ac_token");
    const res = await fetch(`${API}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opts?.headers,
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "coupons">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Product form
  const [pForm, setPForm] = useState({
    name: "", category: "", weight: "", price: "", originalPrice: "", stock: "", imageUrl: "", description: "", isFeatured: false, badge: "",
  });

  // Coupon form
  const [cForm, setCForm] = useState({
    code: "", discountPercent: "", minOrderValue: "", maxDiscount: "", expiresAt: "", description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("ac_token");
    if (!token) { setLocation("/"); return; }
    checkAdmin(token);
  }, [setLocation]);

  const checkAdmin = async (token: string) => {
    const res = await apiFetch<{ user: { role: string } }>("/auth/me");
    if (res?.user?.role !== "admin") { setLocation("/"); return; }
    setIsAdmin(true);
    await loadAll();
  };

  const loadAll = async () => {
    setLoading(true);
    const [statsRes, prodsRes, ordersRes, couponsRes] = await Promise.all([
      apiFetch<Stats>("/admin/stats"),
      apiFetch<{ products: Product[] }>("/products"),
      apiFetch<{ orders: Order[] }>("/orders?role=admin"),
      apiFetch<{ coupons: Coupon[] }>("/coupons"),
    ]);
    if (statsRes) setStats(statsRes);
    if (prodsRes?.products) setProducts(prodsRes.products);
    if (ordersRes?.orders) setOrders(ordersRes.orders);
    if (couponsRes?.coupons) setCoupons(couponsRes.coupons);
    setLoading(false);
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setPForm({
        name: product.name,
        category: product.category,
        weight: product.weight,
        price: product.price.toString(),
        originalPrice: product.originalPrice.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl,
        description: product.description ?? "",
        isFeatured: product.isFeatured,
        badge: product.badge ?? "",
      });
    } else {
      setEditingProduct(null);
      setPForm({ name: "", category: "", weight: "", price: "", originalPrice: "", stock: "", imageUrl: "", description: "", isFeatured: false, badge: "" });
    }
    setShowProductModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max_width = 400;
        const max_height = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > max_width) {
            height *= max_width / width;
            width = max_width;
          }
        } else {
          if (height > max_height) {
            width *= max_height / height;
            height = max_height;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setPForm((f) => ({ ...f, imageUrl: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: pForm.name,
      category: pForm.category,
      weight: pForm.weight,
      price: Number(pForm.price),
      originalPrice: Number(pForm.originalPrice),
      discount: Math.round(((Number(pForm.originalPrice) - Number(pForm.price)) / Number(pForm.originalPrice)) * 100),
      stock: Number(pForm.stock),
      imageUrl: pForm.imageUrl,
      description: pForm.description,
      isFeatured: pForm.isFeatured,
      badge: pForm.badge || null,
    };

    let ok = false;
    if (editingProduct) {
      const res = await apiFetch(`/products/${editingProduct.id}`, { method: "PATCH", body: JSON.stringify(body) });
      ok = !!res;
    } else {
      const res = await apiFetch("/products", { method: "POST", body: JSON.stringify(body) });
      ok = !!res;
    }

    if (ok) {
      toast({ title: editingProduct ? "Product updated" : "Product created", duration: 2000 });
      setShowProductModal(false);
      loadAll();
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await apiFetch(`/products/${id}`, { method: "DELETE" });
    toast({ title: "Product deleted", duration: 2000 });
    loadAll();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await apiFetch(`/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    toast({ title: `Order status updated to ${status}`, duration: 2000 });
    loadAll();
  };

  const saveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      code: cForm.code.toUpperCase(),
      discountPercent: Number(cForm.discountPercent),
      minOrderValue: Number(cForm.minOrderValue),
      maxDiscount: Number(cForm.maxDiscount),
      expiresAt: cForm.expiresAt,
      description: cForm.description,
      isActive: true,
    };

    let ok = false;
    if (editingCoupon) {
      const res = await apiFetch(`/coupons/${editingCoupon.id}`, { method: "PATCH", body: JSON.stringify(body) });
      ok = !!res;
    } else {
      const res = await apiFetch("/coupons", { method: "POST", body: JSON.stringify(body) });
      ok = !!res;
    }

    if (ok) {
      toast({ title: editingCoupon ? "Coupon updated" : "Coupon created", duration: 2000 });
      setShowCouponModal(false);
      loadAll();
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await apiFetch(`/coupons/${id}`, { method: "DELETE" });
    toast({ title: "Coupon deleted", duration: 2000 });
    loadAll();
  };

  const toggleCouponActive = async (coupon: Coupon) => {
    await apiFetch(`/coupons/${coupon.id}`, { method: "PATCH", body: JSON.stringify({ isActive: !coupon.isActive }) });
    loadAll();
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-12 h-12 border-4 border-[#003C32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const TABS = [
    { id: "overview" as const, label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "products" as const, label: "Products", icon: <Package className="w-4 h-4" /> },
    { id: "orders" as const, label: "Orders", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "coupons" as const, label: "Coupons", icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-[#003C32] text-white px-4 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/")}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-extrabold text-lg">Admin Dashboard</h1>
              <p className="text-white/60 text-xs">Asian Cart Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <div className="w-2 h-2 rounded-full bg-[#9AD62A] animate-pulse" />
            System Online
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-[#E2EAE5] sticky top-[72px] z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#003C32] text-[#003C32]"
                    : "border-transparent text-gray-400 hover:text-[#003C32]"
                }`}
                data-testid={`admin-tab-${tab.id}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Overview ────────────────────────────────────────────────────── */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <TrendingUp className="w-5 h-5" />, label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, color: "bg-[#003C32]" },
                { icon: <ShoppingCart className="w-5 h-5" />, label: "Total Orders", value: stats.totalOrders.toString(), color: "bg-[#1D2B25]" },
                { icon: <Users className="w-5 h-5" />, label: "Customers", value: stats.totalUsers.toString(), color: "bg-[#57BF3C]" },
                { icon: <Package className="w-5 h-5" />, label: "Products", value: stats.totalProducts.toString(), color: "bg-[#9AD62A]" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-[#E2EAE5] p-5"
                >
                  <div className={`w-10 h-10 rounded-xl ${s.color} text-white flex items-center justify-center mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-extrabold text-[#1D2B25]">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {stats.lowStockProducts > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  <strong>{stats.lowStockProducts} product{stats.lowStockProducts > 1 ? "s" : ""}</strong> have low stock (under 20 units). Consider restocking soon.
                </p>
              </div>
            )}

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-[#E2EAE5] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2EAE5] flex items-center justify-between">
                <h3 className="font-bold text-[#003C32]">Recent Orders</h3>
                <button onClick={() => setActiveTab("orders")} className="text-xs text-[#57BF3C] font-semibold hover:underline">
                  View all
                </button>
              </div>
              <div className="divide-y divide-[#F0F5F2]">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-[#1D2B25] truncate">{order.customerName}</p>
                      <p className="font-mono text-[10px] text-gray-400">{order.id}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-sm text-[#003C32]">₹{order.total}</span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="px-6 py-8 text-center text-sm text-gray-400">No orders yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Products ────────────────────────────────────────────────────── */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-[#003C32] text-xl">Products ({products.length})</h2>
              <button
                onClick={() => openProductModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#003C32] text-white rounded-full text-sm font-bold hover:bg-[#002f27] transition-colors"
                data-testid="btn-add-product"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2EAE5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F9F6] border-b border-[#E2EAE5]">
                      {["Product", "Category", "Price", "Stock", "Featured", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#1D2B25] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5F2]">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#E2EAE5] flex-shrink-0"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=80"; }}
                            />
                            <div>
                              <p className="font-bold text-[#1D2B25] text-xs">{product.name}</p>
                              <p className="text-[10px] text-gray-400">{product.weight}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{product.category}</td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-bold text-[#003C32] text-xs">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-[10px] text-gray-400 line-through ml-1.5">₹{product.originalPrice}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.stock < 20 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {product.isFeatured ? (
                            <CheckCircle2 className="w-4 h-4 text-[#57BF3C]" />
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openProductModal(product)}
                              className="p-1.5 hover:bg-[#F0F5F2] rounded-lg transition-colors text-[#003C32]"
                              data-testid={`btn-edit-product-${product.id}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600"
                              data-testid={`btn-delete-product-${product.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ──────────────────────────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-[#003C32] text-xl">Orders ({orders.length})</h2>
            <div className="bg-white rounded-2xl border border-[#E2EAE5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F9F6] border-b border-[#E2EAE5]">
                      {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Update"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#1D2B25] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F5F2]">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{order.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-xs text-[#1D2B25]">{order.customerName}</p>
                          <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{order.items?.length ?? 0}</td>
                        <td className="px-4 py-3 font-bold text-xs text-[#003C32]">₹{order.total}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[10px] text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-[#E2EAE5] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#003C32]"
                            data-testid={`select-order-status-${order.id}`}
                          >
                            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">No orders yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Coupons ─────────────────────────────────────────────────────── */}
        {activeTab === "coupons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-[#003C32] text-xl">Coupons ({coupons.length})</h2>
              <button
                onClick={() => { setEditingCoupon(null); setCForm({ code: "", discountPercent: "", minOrderValue: "", maxDiscount: "", expiresAt: "", description: "" }); setShowCouponModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#003C32] text-white rounded-full text-sm font-bold hover:bg-[#002f27] transition-colors"
                data-testid="btn-add-coupon"
              >
                <Plus className="w-4 h-4" /> New Coupon
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="bg-white rounded-2xl border border-[#E2EAE5] p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono font-extrabold text-lg text-[#003C32]">{coupon.code}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{coupon.description}</p>
                  <div className="text-xs text-gray-400 space-y-0.5 mb-4">
                    <div>{coupon.discountPercent}% off · Min ₹{coupon.minOrderValue} · Max ₹{coupon.maxDiscount}</div>
                    <div>Expires: {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCouponActive(coupon)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${coupon.isActive ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-400 hover:text-red-600"
                      data-testid={`btn-delete-coupon-${coupon.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {coupons.length === 0 && (
                <div className="col-span-full text-center py-12 text-sm text-gray-400">No coupons yet.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Product Modal ─────────────────────────────────────────────────── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E2EAE5] sticky top-0 bg-white">
              <h3 className="font-extrabold text-[#003C32]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1.5 hover:bg-[#F0F5F2] rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={saveProduct} className="p-6 space-y-4">
              <AdminField label="Product Name" value={pForm.name} onChange={(v) => setPForm((f) => ({ ...f, name: v }))} required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">Category</label>
                  <select
                    value={pForm.category}
                    onChange={(e) => setPForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32] transition bg-white"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    <option value="Rice & Flour">Rice & Flour</option>
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Dry Fruits & Nuts">Dry Fruits & Nuts</option>
                    <option value="Pantry Staples">Pantry Staples</option>
                    <option value="Perfumes">Perfumes</option>
                    <option value="Daily Essentials">Daily Essentials</option>
                  </select>
                </div>
                <AdminField label="Weight" value={pForm.weight} onChange={(v) => setPForm((f) => ({ ...f, weight: v }))} placeholder="e.g. 5 kg" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminField label="Price (₹)" value={pForm.price} onChange={(v) => setPForm((f) => ({ ...f, price: v }))} type="number" required />
                <AdminField label="Original Price (₹)" value={pForm.originalPrice} onChange={(v) => setPForm((f) => ({ ...f, originalPrice: v }))} type="number" required />
              </div>
              <AdminField label="Stock Quantity" value={pForm.stock} onChange={(v) => setPForm((f) => ({ ...f, stock: v }))} type="number" required />
              
              <div>
                <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">Product Image</label>
                <div className="flex items-center gap-4">
                  {pForm.imageUrl ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E2EAE5] bg-gray-50 flex-shrink-0">
                      <img src={pForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPForm((f) => ({ ...f, imageUrl: "" }))}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#E2EAE5] flex flex-col items-center justify-center text-gray-400 bg-gray-50 flex-shrink-0">
                      <Package className="w-6 h-6 stroke-1" />
                      <span className="text-[10px] mt-1 font-semibold">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      id="file-upload"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center justify-center px-4 py-2 border border-[#003C32] text-[#003C32] hover:bg-[#003C32] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Choose File
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium leading-relaxed">
                      Upload from device. JPG, PNG up to 5MB. Automatically compressed.
                    </p>
                  </div>
                </div>
              </div>

              <AdminField label="Badge (optional)" value={pForm.badge} onChange={(v) => setPForm((f) => ({ ...f, badge: v }))} placeholder="e.g. Best Seller" />
              <div>
                <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={pForm.description}
                  onChange={(e) => setPForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32] resize-none"
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pForm.isFeatured}
                  onChange={(e) => setPForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="w-4 h-4 accent-[#003C32]"
                />
                <span className="text-sm font-semibold text-[#1D2B25]">Feature on homepage</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 border border-[#E2EAE5] rounded-2xl text-sm font-bold text-gray-500 hover:bg-[#F0F5F2] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-[#003C32] text-white rounded-2xl text-sm font-bold hover:bg-[#002f27] transition-colors" data-testid="btn-save-product">
                  {editingProduct ? "Update" : "Create"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Coupon Modal ──────────────────────────────────────────────────── */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[#E2EAE5]">
              <h3 className="font-extrabold text-[#003C32]">
                {editingCoupon ? "Edit Coupon" : "New Coupon"}
              </h3>
              <button onClick={() => setShowCouponModal(false)} className="p-1.5 hover:bg-[#F0F5F2] rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={saveCoupon} className="p-6 space-y-4">
              <AdminField label="Coupon Code" value={cForm.code} onChange={(v) => setCForm((f) => ({ ...f, code: v.toUpperCase() }))} placeholder="SAVE20" required testId="input-coupon-code" />
              <div className="grid grid-cols-2 gap-4">
                <AdminField label="Discount %" value={cForm.discountPercent} onChange={(v) => setCForm((f) => ({ ...f, discountPercent: v }))} type="number" required />
                <AdminField label="Max Discount (₹)" value={cForm.maxDiscount} onChange={(v) => setCForm((f) => ({ ...f, maxDiscount: v }))} type="number" required />
              </div>
              <AdminField label="Min Order Value (₹)" value={cForm.minOrderValue} onChange={(v) => setCForm((f) => ({ ...f, minOrderValue: v }))} type="number" required />
              <AdminField label="Expiry Date" value={cForm.expiresAt} onChange={(v) => setCForm((f) => ({ ...f, expiresAt: v }))} type="date" required />
              <AdminField label="Description" value={cForm.description} onChange={(v) => setCForm((f) => ({ ...f, description: v }))} placeholder="e.g. 20% off for new users" required />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCouponModal(false)} className="flex-1 py-3 border border-[#E2EAE5] rounded-2xl text-sm font-bold text-gray-500 hover:bg-[#F0F5F2] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-[#003C32] text-white rounded-2xl text-sm font-bold hover:bg-[#002f27] transition-colors" data-testid="btn-save-coupon">
                  {editingCoupon ? "Update" : "Create"} Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminField({
  label, value, onChange, type = "text", required, placeholder, testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  testId?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32] transition"
        data-testid={testId}
      />
    </div>
  );
}
