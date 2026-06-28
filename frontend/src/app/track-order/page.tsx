"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "../../context/AppContext";

type OrderItem = {
  _id?: string;
  id?: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
};

type TrackedOrder = {
  _id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  items: string | OrderItem[];
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
    flatNo: string;
    street: string;
    landmark?: string;
    pinCode: string;
    city: string;
    state: string;
  };
};

function TrackerContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const { showToast } = useAppContext();
  
  const [orderId, setOrderId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (idParam) {
      setOrderId(idParam);
      fetchOrderStatus(idParam);
    }
  }, [idParam]);

  const fetchOrderStatus = async (searchId: string) => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please log in to track your order.");
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/track/${searchId.trim()}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to retrieve order status.");
      }
      
      setOrder(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Order not found. Please verify the ID is correct.");
      showToast(err.message || "Order not found.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderStatus(orderId);
  };

  // Steps definition for tracker
  const steps = [
    { key: "Pending", label: "Order Placed", icon: "fa-receipt", desc: "We have received your order" },
    { key: "Processing", label: "Processing", icon: "fa-box-open", desc: "Your package is prepared discreetly" },
    { key: "Shipped", label: "Dispatched", icon: "fa-truck-ramp-box", desc: "Dispatched & out for delivery" },
    { key: "Delivered", label: "Delivered", icon: "fa-circle-check", desc: "Handed over safely & privately" },
  ];

  const getStatusIndex = (status: string) => {
    const s = status || "Pending";
    if (s === "Cancelled") return -1;
    return steps.findIndex(step => step.key.toLowerCase() === s.toLowerCase());
  };

  const statusIndex = order ? getStatusIndex(order.deliveryStatus) : 0;

  // Helper to parse items
  const getOrderItems = (itemsField: string | OrderItem[]): OrderItem[] => {
    try {
      return typeof itemsField === "string" ? JSON.parse(itemsField) : itemsField;
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-velvet-400 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-start items-center">
      
      {/* Title Header */}
      <div className="text-center max-w-xl mb-12">
        <span className="text-luxePink-500 text-xs uppercase tracking-[0.35em] block mb-2 text-glow-pink">
          DISCREET COURIER TRACKING
        </span>
        <h1 className="text-3xl sm:text-5xl font-cinzel text-white font-extrabold tracking-wide">
          Track Your Order
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
          Enter your unique 24-character private Order ID below to view its packaging, shipping, and delivery progress status in real-time.
        </p>
      </div>

      {/* Query Search Form Card */}
      <div className="max-w-xl w-full bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-luxePink-500/5 rounded-full blur-3xl"></div>
        
        <form onSubmit={handleSearchSubmit} className="relative z-10 flex flex-col gap-4">
          <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest">
            Enter Order ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={orderId}
              required
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 667f5b2ac3d4e6f9a0123456"
              className="flex-1 bg-velvet-400 border border-luxePink-500/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-luxePink-500 focus:ring-1 focus:ring-luxePink-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-luxePink-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Tracking...
                </>
              ) : (
                "Track Order"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-xl w-full bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-400 text-xs sm:text-sm animate-fade-in relative overflow-hidden flex flex-col items-center">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
          <i className="fa-solid fa-triangle-exclamation text-2xl mb-2 block text-red-500"></i>
          <p className="mb-4">{error}</p>
          {error.includes("log in") && (
            <a 
              href="/auth" 
              className="bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-bold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-lg transition-all duration-300 cursor-pointer shadow-md"
            >
              Go to Login
            </a>
          )}
        </div>
      )}

      {/* Order Status Display Panel */}
      {order && (
        <div className="max-w-3xl w-full bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in-up relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          {/* Header Summary */}
          <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-luxePink-500/10 pb-6 mb-8 gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-luxePink-500 font-bold bg-luxePink-950/40 border border-luxePink-500/15 rounded px-2.5 py-1 mb-2.5 inline-block">
                Order Located
              </span>
              <h2 className="text-white font-cinzel font-bold text-lg sm:text-2xl">
                Order #{order._id.toUpperCase()}
              </h2>
              <p className="text-gray-400 text-xs mt-1.5 font-light tracking-wide">
                Purchased: {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
            
            <div className="text-left md:text-right flex flex-col md:items-end gap-1.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-widest font-semibold">Total Amount</span>
              <span className="text-luxePink-500 font-extrabold text-2xl text-glow-pink">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-gray-400 text-[10px] tracking-wider font-light">
                {order.paymentMethod === "cod" ? "COD Delivery Fee (₹40) Included" : "Paid Securely Online"}
              </span>
            </div>
          </div>

          {/* Stepper Status / Cancelled Notification */}
          {order.deliveryStatus === "Cancelled" ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 mb-8 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
              <i className="fa-solid fa-ban text-4xl mb-3 text-red-500"></i>
              <h3 className="font-cinzel font-bold text-lg text-white tracking-widest uppercase mb-2">Order Cancelled</h3>
              <p className="text-gray-300 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
                This order has been cancelled and will not be dispatched. If you believe this is a mistake or have questions, please reach out to our client services at <span className="text-luxePink-400 font-serif">patron@maisonvelours.com</span>.
              </p>
            </div>
          ) : (
            <div className="mb-12">
              <h3 className="text-white font-cinzel text-xs tracking-[0.25em] uppercase font-bold mb-6">
                Delivery Tracker
              </h3>
              
              {/* Stepper Steps Desktop Layout */}
              <div className="hidden md:grid grid-cols-4 relative">
                {/* Connector line */}
                <div className="absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-velvet-200 z-0">
                  <div 
                    className="h-full bg-gradient-to-r from-luxePink-500 to-purple-500 transition-all duration-700"
                    style={{ width: `${statusIndex >= 0 ? (statusIndex / 3) * 100 : 0}%` }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const isActive = idx <= statusIndex;
                  const isCurrent = idx === statusIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isActive 
                          ? "bg-velvet-300 border-luxePink-500 text-luxePink-500 shadow-lg shadow-luxePink-500/20" 
                          : "bg-velvet-400 border-velvet-200 text-gray-500"
                      }`}>
                        <i className={`fa-solid ${step.icon} text-sm ${isCurrent ? "animate-pulse" : ""}`}></i>
                      </div>
                      <span className={`text-[11px] uppercase tracking-wider font-bold mt-4 transition-colors ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}>
                        {step.label}
                      </span>
                      <span className="text-[9px] text-gray-400 mt-1 leading-normal px-2 max-w-[140px] block font-light">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Stepper Steps Mobile Vertical Layout */}
              <div className="flex md:hidden flex-col gap-6 relative pl-6">
                {/* Connector line vertical */}
                <div className="absolute top-3 bottom-3 left-[15px] w-0.5 bg-velvet-200">
                  <div 
                    className="w-full bg-gradient-to-b from-luxePink-500 to-purple-500 transition-all duration-700"
                    style={{ height: `${statusIndex >= 0 ? (statusIndex / 3) * 100 : 0}%` }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const isActive = idx <= statusIndex;
                  const isCurrent = idx === statusIndex;
                  return (
                    <div key={step.key} className="flex items-start gap-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0 ${
                        isActive 
                          ? "bg-velvet-300 border-luxePink-500 text-luxePink-500 shadow-md shadow-luxePink-500/10" 
                          : "bg-velvet-400 border-velvet-200 text-gray-500"
                      }`}>
                        <i className={`fa-solid ${step.icon} text-xs ${isCurrent ? "animate-pulse" : ""}`}></i>
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] text-gray-400 mt-0.5 font-light">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Masked Customer & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-luxePink-500/10 pt-8 mb-8 text-xs font-light">
            <div>
              <h4 className="font-cinzel text-white text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
                Customer Details
              </h4>
              <p className="text-gray-400 mb-1.5"><span className="text-gray-500">Name:</span> {order.customerName}</p>
              <p className="text-gray-400"><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
            </div>
            <div>
              <h4 className="font-cinzel text-white text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
                Delivery Address (Masked)
              </h4>
              <p className="text-gray-400 mb-1">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-gray-400 mb-1">
                {order.shippingAddress.flatNo}, {order.shippingAddress.street}
              </p>
              <p className="text-gray-400 mb-1">
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pinCode}
              </p>
              <p className="text-gray-400">
                <span className="text-gray-500">Contact:</span> {order.shippingAddress.mobileNumber}
              </p>
            </div>
          </div>

          {/* Ordered Vault Items */}
          <div className="border-t border-luxePink-500/10 pt-8">
            <h4 className="font-cinzel text-white text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
              Items in this shipment
            </h4>
            <div className="space-y-4">
              {getOrderItems(order.items).map((item, idx) => (
                <div key={idx} className="bg-velvet-400/30 rounded-xl border border-luxePink-500/5 p-4 flex gap-4 items-center">
                  <img src={item.image} alt={item.title} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-contain bg-velvet-500/20" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-luxePink-500 font-semibold">{item.category}</span>
                    <h5 className="text-white text-xs sm:text-sm font-semibold truncate mt-0.5">{item.title}</h5>
                    <p className="text-gray-400 text-xs font-light mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-white text-xs sm:text-sm font-bold block">₹{item.price.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">each</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-velvet-400 flex items-center justify-center text-white font-cinzel uppercase tracking-widest text-xs">Initializing Tracker...</div>}>
      <TrackerContent />
    </Suspense>
  );
}
