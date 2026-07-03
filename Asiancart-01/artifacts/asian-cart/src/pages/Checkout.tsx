import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  CreditCard,
  Package,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  weight: string;
}

interface CheckoutData {
  items: CartItem[];
  coupon: { code: string; discountPercent: number; discountAmount: number } | null;
  subtotal: number;
  total: number;
}

const STEPS = ["Delivery", "Payment", "Review", "Confirm"];

const STATES = [
  "Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala",
  "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "West Bengal",
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Step 1 — Address
  const [address, setAddress] = useState(() => {
    const saved = localStorage.getItem("ac_delivery_address");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    };
  });

  // Step 2 — Payment
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("checkout_data");
    if (raw) {
      try {
        setCheckoutData(JSON.parse(raw));
      } catch {
        setLocation("/");
      }
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003C32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const { items, coupon, total } = checkoutData;
  const delivery = checkoutData.subtotal >= 999 ? 0 : 99;
  const grandTotal = total + delivery;

  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ac_delivery_address", JSON.stringify(address));
    setStep(1);
  };

  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ac_token");
      const userRaw = token
        ? await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json()).catch(() => null)
        : null;

      const body = {
        userId: userRaw?.user?.id ?? "guest",
        customerName: address.fullName,
        customerEmail: address.email,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        couponCode: coupon?.code ?? null,
        discount: coupon?.discountAmount ?? 0,
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod:
          paymentMethod === "card"
            ? `Card ending ${cardNumber.slice(-4)}`
            : paymentMethod === "upi"
            ? `UPI: ${upiId}`
            : "Cash on Delivery",
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.order?.id ?? `ORD-${Date.now()}`);
      } else {
        setOrderId(`ORD-${Date.now()}`);
      }
    } catch {
      setOrderId(`ORD-${Date.now()}`);
    }
    setLoading(false);
    sessionStorage.removeItem("checkout_data");
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2EAE5] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => (step > 0 ? setStep((s) => s - 1) : setLocation("/"))}
            className="flex items-center gap-2 text-sm font-semibold text-[#003C32] hover:text-[#57BF3C] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {step > 0 ? STEPS[step - 1] : "Back to Shop"}
          </button>
          <img
            src="/asian-cart-logo.png"
            alt="Asian Cart"
            className="h-10 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="w-24" />
        </div>
      </header>

      {/* Progress steps */}
      {step < 3 && (
        <div className="bg-white border-b border-[#E2EAE5] px-4 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-0">
              {STEPS.slice(0, 3).map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        i < step
                          ? "bg-[#9AD62A] text-[#1D2B25]"
                          : i === step
                          ? "bg-[#003C32] text-white"
                          : "bg-[#F0F5F2] text-gray-400"
                      }`}
                    >
                      {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 font-semibold ${i === step ? "text-[#003C32]" : "text-gray-400"}`}>
                      {s}
                    </span>
                  </div>
                  {i < 2 && <div className={`h-px w-16 mx-1 mt-[-12px] ${i < step ? "bg-[#9AD62A]" : "bg-[#E2EAE5]"}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 border border-[#E2EAE5]"
                >
                  <h2 className="font-extrabold text-lg text-[#003C32] mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Delivery Address
                  </h2>
                  <form onSubmit={handleAddressNext} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Full Name"
                        value={address.fullName}
                        onChange={(v) => setAddress((a) => ({ ...a, fullName: v }))}
                        placeholder="Rahul Sharma"
                        required
                        testId="input-fullname"
                      />
                      <Field
                        label="Phone Number"
                        value={address.phone}
                        onChange={(v) => setAddress((a) => ({ ...a, phone: v }))}
                        placeholder="+91 98765 43210"
                        type="tel"
                        required
                        testId="input-phone"
                      />
                    </div>
                    <Field
                      label="Email Address"
                      value={address.email}
                      onChange={(v) => setAddress((a) => ({ ...a, email: v }))}
                      placeholder="you@example.com"
                      type="email"
                      required
                      testId="input-email"
                    />
                    <Field
                      label="Address Line 1"
                      value={address.addressLine1}
                      onChange={(v) => setAddress((a) => ({ ...a, addressLine1: v }))}
                      placeholder="Flat no, Building, Street"
                      required
                      testId="input-address1"
                    />
                    <Field
                      label="Address Line 2 (Optional)"
                      value={address.addressLine2}
                      onChange={(v) => setAddress((a) => ({ ...a, addressLine2: v }))}
                      placeholder="Landmark, Area"
                      testId="input-address2"
                    />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Field
                        label="City"
                        value={address.city}
                        onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
                        placeholder="Mumbai"
                        required
                        testId="input-city"
                      />
                      <div>
                        <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">State *</label>
                        <select
                          required
                          value={address.state}
                          onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                          className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32] bg-white"
                          data-testid="select-state"
                        >
                          <option value="">Select state</option>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <Field
                        label="Pincode"
                        value={address.pincode}
                        onChange={(v) => setAddress((a) => ({ ...a, pincode: v }))}
                        placeholder="400001"
                        pattern="[0-9]{6}"
                        required
                        testId="input-pincode"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#003C32] text-white font-bold rounded-2xl hover:bg-[#002f27] transition-colors flex items-center justify-center gap-2"
                      data-testid="btn-continue-payment"
                    >
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-6 border border-[#E2EAE5]"
                >
                  <h2 className="font-extrabold text-lg text-[#003C32] mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment Method
                  </h2>
                  <form onSubmit={handlePaymentNext} className="space-y-6">
                    {/* Payment options */}
                    <div className="space-y-3">
                      {(["upi", "card"] as const).map((method) => (
                        <label
                          key={method}
                          className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                            paymentMethod === method
                              ? "border-[#003C32] bg-[#F0F9F0]"
                              : "border-[#E2EAE5] hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="accent-[#003C32]"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-bold text-[#1D2B25]">
                              {method === "upi" ? "UPI Payment" : "Credit / Debit Card"}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {method === "upi" ? "Google Pay, PhonePe, Paytm, BHIM" : "Visa, Mastercard, Rupay"}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* UPI */}
                    {paymentMethod === "upi" && (
                      <Field
                        label="UPI ID"
                        value={upiId}
                        onChange={setUpiId}
                        placeholder="name@paytm / 98765@upi"
                        required
                        testId="input-upi"
                      />
                    )}

                    {/* Card */}
                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <Field
                          label="Card Number"
                          value={cardNumber}
                          onChange={setCardNumber}
                          placeholder="1234 5678 9012 3456"
                          required
                          testId="input-card-number"
                        />
                        <Field
                          label="Cardholder Name"
                          value={cardName}
                          onChange={setCardName}
                          placeholder="As on card"
                          required
                          testId="input-card-name"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Field
                            label="Expiry (MM/YY)"
                            value={cardExpiry}
                            onChange={setCardExpiry}
                            placeholder="12/27"
                            required
                            testId="input-card-expiry"
                          />
                          <Field
                            label="CVV"
                            value={cardCvv}
                            onChange={setCardCvv}
                            placeholder="•••"
                            type="password"
                            required
                            testId="input-card-cvv"
                          />
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600">
                          🔒 This is a demo. Do not enter real card details.
                        </div>
                      </div>
                    )}



                    <button
                      type="submit"
                      className="w-full py-4 bg-[#003C32] text-white font-bold rounded-2xl hover:bg-[#002f27] transition-colors flex items-center justify-center gap-2"
                      data-testid="btn-continue-review"
                    >
                      Review Order <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Address review */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E2EAE5]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-[#003C32] flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Delivering to
                      </h3>
                      <button onClick={() => setStep(0)} className="text-xs text-[#57BF3C] font-semibold hover:underline">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm font-bold text-[#1D2B25]">{address.fullName}</p>
                    <p className="text-sm text-gray-500">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                    <p className="text-sm text-gray-500">{address.city}, {address.state} — {address.pincode}</p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                  </div>

                  {/* Payment review */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E2EAE5]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-[#003C32] flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Payment
                      </h3>
                      <button onClick={() => setStep(1)} className="text-xs text-[#57BF3C] font-semibold hover:underline">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-[#1D2B25] font-semibold">
                      {paymentMethod === "upi" ? `UPI — ${upiId}` : `Card •••• ${cardNumber.slice(-4)}`}
                    </p>
                  </div>

                  {/* Items review */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E2EAE5]">
                    <h3 className="font-bold text-sm text-[#003C32] mb-4 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Your Items ({items.length})
                    </h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E2EAE5]"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=80"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#1D2B25] truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400">{item.weight} × {item.quantity}</p>
                          </div>
                          <span className="text-xs font-bold text-[#003C32]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full py-4 bg-[#003C32] hover:bg-[#002f27] disabled:opacity-60 text-white font-bold rounded-2xl transition-colors text-base"
                    data-testid="btn-place-order"
                  >
                    {loading ? "Placing Order..." : `Place Order · ₹${grandTotal}`}
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    By placing this order you agree to our Terms of Service and Privacy Policy
                  </p>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-8 border border-[#E2EAE5] text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-[#9AD62A] rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#1D2B25]" />
                  </motion.div>
                  <h2 className="text-2xl font-extrabold text-[#003C32] mb-2">Order Placed!</h2>
                  <p className="text-gray-500 mb-3">Thank you, {address.fullName}!</p>
                  <div className="inline-block bg-[#FAF7F2] border border-[#E2EAE5] rounded-2xl px-6 py-3 mb-6">
                    <p className="text-xs text-gray-400 mb-1">Order ID</p>
                    <p className="font-mono font-bold text-[#003C32]">{orderId}</p>
                  </div>
                  <div className="flex justify-center gap-3 mb-8">
                    {["Processing", "Confirmed", "Shipped", "Delivered"].map((s, i) => (
                      <div key={s} className="flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-[#9AD62A] text-[#1D2B25]" : "bg-[#F0F5F2] text-gray-400"}`}>
                          {i + 1}
                        </div>
                        <span className={`text-[9px] font-semibold ${i === 0 ? "text-[#003C32]" : "text-gray-300"}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    A confirmation has been sent to <strong>{address.email}</strong>.<br />
                    Estimated delivery: <strong>3–5 business days</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setLocation("/account")}
                      className="px-6 py-3 border border-[#003C32] text-[#003C32] rounded-full font-bold text-sm hover:bg-[#003C32] hover:text-white transition-all"
                    >
                      Track My Order
                    </button>
                    <button
                      onClick={() => setLocation("/")}
                      className="px-6 py-3 bg-[#003C32] text-white rounded-full font-bold text-sm hover:bg-[#002f27] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          {step < 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#E2EAE5] sticky top-24">
                <h3 className="font-bold text-[#003C32] mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Order Summary
                </h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E2EAE5] flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=80"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1D2B25] truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-[#003C32]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E2EAE5] pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{checkoutData.subtotal}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-xs text-[#57BF3C] font-semibold">
                      <span>Coupon ({coupon.code})</span>
                      <span>–₹{coupon.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? "text-[#57BF3C] font-semibold" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#003C32] pt-2 border-t border-[#E2EAE5]">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
                {checkoutData.subtotal < 999 && (
                  <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                    <Truck className="inline w-3.5 h-3.5 mr-1" />
                    Add ₹{999 - checkoutData.subtotal} more for free delivery!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper field component
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  pattern,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  pattern?: string;
  testId?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-[#1D2B25] block mb-1.5">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        className="w-full px-4 py-3 border border-[#E2EAE5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003C32] transition"
        data-testid={testId}
      />
    </div>
  );
}
