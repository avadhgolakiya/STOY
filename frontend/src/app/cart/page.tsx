"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, changeQuantity, isLoggedIn, showToast, clearCart } = useAppContext();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Delivery fee will be calculated at checkout
  const total = subtotal;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
      showToast("Please log in to proceed with checkout.", "error");
      router.push("/auth?redirect=/checkout/address");
      return;
    }
    router.push("/checkout/address");
  };

  return (
    <div className="min-h-screen bg-velvet-400 pt-32 pb-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-cinzel text-white font-extrabold tracking-wide mb-12">
          Your Luxury Vault
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-velvet-300/50 rounded-2xl border border-luxePink-500/10">
            <i className="fa-solid fa-bag-shopping text-5xl text-luxePink-500/20 mb-4 block"></i>
            <p className="text-gray-400 tracking-widest uppercase text-sm mb-6">Your vault is currently empty</p>
            <Link 
              href="/#new-arrivals" 
              className="inline-block bg-luxePink-500 text-white px-8 py-3 rounded uppercase tracking-widest text-xs font-bold hover:bg-luxePink-400 transition"
            >
              Discover Masterpieces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 bg-velvet-300 border border-luxePink-500/10 p-4 rounded-xl items-center relative group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-velvet-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-cinzel font-semibold text-lg">{item.title}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-luxePink-500 transition"
                      >
                        <i className="fa-solid fa-xmark text-lg"></i>
                      </button>
                    </div>
                    <p className="text-xs text-luxePink-500 tracking-widest uppercase mb-4">{item.category}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 bg-velvet-400 rounded-lg px-2 py-1 border border-luxePink-500/20">
                        <button onClick={() => changeQuantity(item.id, -1)} className="w-6 h-6 text-gray-400 hover:text-white transition">
                          <i className="fa-solid fa-minus text-xs"></i>
                        </button>
                        <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => changeQuantity(item.id, 1)} className="w-6 h-6 text-gray-400 hover:text-white transition">
                          <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                      </div>
                      <span className="text-luxePink-400 font-bold">{formattedPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6 sticky top-32">
                <h2 className="text-xl font-cinzel text-white mb-6 border-b border-luxePink-500/10 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formattedPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-luxePink-500/10 pt-4">
                    <span className="text-white">Total</span>
                    <span className="text-luxePink-500 text-glow-pink">{formattedPrice(total)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-extrabold uppercase tracking-widest h-14 rounded-lg transition duration-300 shadow-[0_0_20px_rgba(219,39,119,0.3)] flex justify-center items-center"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
