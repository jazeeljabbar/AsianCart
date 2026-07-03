import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Pencil,
  Save,
  X,
  KeyRound,
  Phone,
  Mail,
  BadgeCheck,
} from "lucide-react";

const API = "http://localhost:5000";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  weight: string;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
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
}

const STATUS_COLORS: Record<Order["status"], string> = {
  Processing: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_STEPS = ["Processing", "Confirmed", "Shipped", "Delivered"];

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("ac_token");
    if (!token) {
      setLocation("/");
      return;
    }
    loadData(token);
  }, [setLocation]);

  const loadData = async (token: string) => {
    setLoading(true);
    try {
      const [userRes, ordersRes] = await Promise.all([
        fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : null),
        fetch(`${API}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : null),
      ]);
      if (userRes?.user) {
        setUser(userRes.user);
        setEditName(userRes.user.name);
        setEditPhone(userRes.user.phone ?? "");
      }
      if (ordersRes?.orders) setOrders(ordersRes.orders.filter((o: Order) => o.userId === (userRes?.user?.id ?? "")));
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setProfileMsg({ type: "error", text: "Name cannot be empty." });
      return;
    }
    if (changingPassword) {
      if (!currentPassword) { setProfileMsg({ type: "error", text: "Enter your current password." }); return; }
      if (newPassword.length < 6) { setProfileMsg({ type: "error", text: "New password must be at least 6 characters." }); return; }
      if (newPassword !== confirmPassword) { setProfileMsg({ type: "error", text: "New passwords do not match." }); return; }
    }

    setProfileSaving(true);
    setProfileMsg(null);
    const token = localStorage.getItem("ac_token");
    try {
      const body: Record<string, string> = { name: editName, phone: editPhone };
      if (changingPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }
      const res = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setEditing(false);
        setChangingPassword(false);
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      } else {
        setProfileMsg({ type: "error", text: data.error ?? "Failed to update profile." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Network error. Please try again." });
    }
    setProfileSaving(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setChangingPassword(false);
    setEditName(user?.name ?? "");
    setEditPhone(user?.phone ?? "");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setProfileMsg(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-12 h-12 border-4 border-[#003C32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] gap-4">
        <p className="text-[#1D2B25] font-bold">Please sign in to view your dashboard.</p>
        <button onClick={() => setLocation("/")} className="px-6 py-3 bg-[#003C32] text-white rounded-full font-bold text-sm hover:bg-[#002f27] transition-colors">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2EAE5] px-4 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-sm font-semibold text-[#003C32] hover:text-[#57BF3C] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </button>
          <h1 className="font-extrabold text-[#003C32]">My Account</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* User greeting */}
        <div className="bg-[#003C32] text-white rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#9AD62A] text-[#1D2B25] flex items-center justify-center text-2xl font-extrabold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-white/60">Welcome back,</p>
              <h2 className="text-xl font-extrabold">{user.name}</h2>
              <p className="text-sm text-white/60 mt-0.5">{user.email}</p>
            </div>
            <div className="ml-auto hidden sm:block text-right">
              <p className="text-2xl font-extrabold text-[#9AD62A]">{orders.length}</p>
              <p className="text-xs text-white/60">Total Orders</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#E2EAE5] rounded-2xl p-1.5 mb-6 inline-flex">
          {(["orders", "profile"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setProfileMsg(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#003C32] text-white"
                  : "text-gray-500 hover:text-[#003C32]"
              }`}
            >
              {tab === "orders" ? <Package className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {tab === "orders" ? "My Orders" : "Profile"}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E2EAE5]">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="font-bold text-[#1D2B25] mb-2">No orders yet</p>
                <p className="text-sm text-gray-400 mb-6">Your orders will appear here once you place them.</p>
                <button
                  onClick={() => setLocation("/")}
                  className="px-6 py-3 bg-[#003C32] text-white rounded-full font-bold text-sm hover:bg-[#002f27] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : selectedOrder ? (
              <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-[#E2EAE5] overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-mono text-xs text-gray-400">{order.id}</p>
                          <p className="font-bold text-[#1D2B25] text-sm mt-0.5">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex gap-2 mb-3">
                        {order.items.slice(0, 3).map((item) => (
                          <img
                            key={item.productId}
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E2EAE5]"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=80"; }}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-xl bg-[#F0F5F2] flex items-center justify-center text-xs font-bold text-[#003C32]">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                          <p className="font-extrabold text-[#003C32] text-sm mt-0.5">₹{order.total}</p>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#003C32] hover:text-[#57BF3C] transition-colors"
                          data-testid={`btn-order-detail-${order.id}`}
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            {/* Success/error message */}
            <AnimatePresence>
              {profileMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold ${
                    profileMsg.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {profileMsg.type === "success" ? <BadgeCheck className="w-5 h-5 flex-shrink-0" /> : <X className="w-5 h-5 flex-shrink-0" />}
                  {profileMsg.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Account Info card */}
            <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#003C32] text-lg">Account Information</h3>
                {!editing ? (
                  <button
                    onClick={() => { setEditing(true); setProfileMsg(null); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#003C32] border border-[#003C32] rounded-full hover:bg-[#003C32] hover:text-white transition-all"
                    data-testid="btn-edit-profile"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
                      data-testid="btn-cancel-edit"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileSaving}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-[#003C32] text-white rounded-full hover:bg-[#002f27] disabled:opacity-60 transition-all"
                      data-testid="btn-save-profile"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5 max-w-lg">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#1D2B25] mb-2">
                    <User className="w-3.5 h-3.5 text-[#003C32]" /> Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 border border-[#003C32] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]/30 bg-white"
                      data-testid="input-profile-name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#F5F9F6] rounded-xl text-sm text-[#1D2B25]">{user.name}</div>
                  )}
                </div>

                {/* Email (read-only always) */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#1D2B25] mb-2">
                    <Mail className="w-3.5 h-3.5 text-[#003C32]" /> Email Address
                    <span className="ml-1 text-[10px] text-gray-400 font-normal">(cannot be changed)</span>
                  </label>
                  <div className="px-4 py-3 bg-[#F5F9F6] rounded-xl text-sm text-gray-400">{user.email}</div>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#1D2B25] mb-2">
                    <Phone className="w-3.5 h-3.5 text-[#003C32]" /> Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 border border-[#003C32] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]/30 bg-white"
                      data-testid="input-profile-phone"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#F5F9F6] rounded-xl text-sm text-[#1D2B25]">{user.phone || "Not set"}</div>
                  )}
                </div>

                {/* Account Type */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#1D2B25] mb-2">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#003C32]" /> Account Type
                  </label>
                  <div className="px-4 py-3 bg-[#F5F9F6] rounded-xl text-sm text-[#1D2B25]">
                    {user.role === "admin" ? "Administrator" : "Customer"}
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password card — only shown in edit mode */}
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E2EAE5] p-6"
              >
                <button
                  onClick={() => setChangingPassword(!changingPassword)}
                  className="flex items-center gap-2 text-sm font-bold text-[#003C32] hover:text-[#57BF3C] transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  {changingPassword ? "Cancel Password Change" : "Change Password"}
                </button>

                <AnimatePresence>
                  {changingPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 space-y-4 max-w-lg">
                        <div>
                          <label className="text-xs font-bold text-[#1D2B25] block mb-2">Current Password</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]/30"
                            data-testid="input-current-password"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#1D2B25] block mb-2">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]/30"
                            data-testid="input-new-password"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#1D2B25] block mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32]/30"
                            data-testid="input-confirm-password"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  const stepIdx = STATUS_STEPS.indexOf(order.status);
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-[#003C32] hover:text-[#57BF3C] transition-colors">
        <ChevronLeft className="w-4 h-4" /> All Orders
      </button>

      <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400">Order ID</p>
            <p className="font-mono font-bold text-[#003C32]">{order.id}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Progress tracker */}
        {order.status !== "Cancelled" && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex-1 relative flex flex-col items-center">
                  {i > 0 && (
                    <div className={`absolute right-1/2 top-3 w-full h-0.5 ${i <= stepIdx ? "bg-[#9AD62A]" : "bg-[#E2EAE5]"}`} />
                  )}
                  <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i < stepIdx ? "bg-[#9AD62A] text-[#1D2B25]" : i === stepIdx ? "bg-[#003C32] text-white" : "bg-[#F0F5F2] text-gray-400"
                  }`}>
                    {i < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-[9px] font-semibold mt-1 ${i === stepIdx ? "text-[#003C32]" : "text-gray-400"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="border-t border-[#E2EAE5] pt-4 mb-4">
          <p className="font-bold text-sm text-[#003C32] mb-3">Items</p>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E2EAE5]"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=80"; }}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1D2B25]">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.weight} × {item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-[#003C32]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-[#E2EAE5] pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#57BF3C]">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
              <span>–₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-[#003C32] border-t border-[#E2EAE5] pt-2">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="border-t border-[#E2EAE5] pt-4 mt-4">
          <p className="font-bold text-sm text-[#003C32] mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Shipping Address
          </p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.addressLine1}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}
