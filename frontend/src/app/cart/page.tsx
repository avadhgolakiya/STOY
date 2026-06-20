"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, changeQuantity, isLoggedIn, showToast, clearCart } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = paymentMethod === "cod" ? 40 : 0;
  const total = subtotal + deliveryFee;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
      showToast("Please log in to proceed with checkout.", "error");
      router.push("/auth");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5001/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: subtotal,
          paymentMethod
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      if (paymentMethod === "cod") {
        showToast("Order placed successfully via Cash on Delivery!", "success");
        clearCart();
        router.push("/thank-you");
      } else if (paymentMethod === "razorpay") {
        // If the backend sent a dummy order because API keys are missing, simulate success
        if (data.razorpayOrder.isDummy) {
          showToast("Simulated Payment Successful! (Razorpay Keys Missing)", "info");
          clearCart();
          router.push("/thank-you");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummykey123", // fallback dummy key
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: "Adut Store",
          description: "Luxury Purchase",
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch("http://localhost:5001/api/orders/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              showToast("Payment Successful! Your luxury pieces are being prepared.", "success");
              clearCart();
              router.push("/thank-you");
            } else {
              showToast("Payment Verification Failed", "error");
            }
          },
          theme: {
            color: "#db2777" // luxePink-500
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          showToast("Payment Failed or Cancelled", "error");
        });
        rzp.open();
      }
    } catch (e: any) {
      showToast(e.message || "An error occurred during checkout", "error");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
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
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span className="text-white">{deliveryFee === 0 ? "Free" : formattedPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-luxePink-500/10 pt-4">
                    <span className="text-white">Total</span>
                    <span className="text-luxePink-500 text-glow-pink">{formattedPrice(total)}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-widest text-luxePink-500 mb-4 font-bold">Payment Method</h3>
                  <div className="space-y-3">
                    <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-luxePink-500 bg-luxePink-500/5' : 'border-luxePink-500/20 bg-velvet-400 hover:border-luxePink-500/50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="razorpay" 
                          checked={paymentMethod === 'razorpay'} 
                          onChange={() => setPaymentMethod('razorpay')}
                          className="accent-luxePink-500 w-4 h-4"
                        />
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-sm">Online Payment (Razorpay)</span>
                          <span className="text-[10px] text-gray-400 mt-1">Zero Delivery Fee</span>
                        </div>
                      </div>
                    </label>

                    <label className={`block border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-luxePink-500 bg-luxePink-500/5' : 'border-luxePink-500/20 bg-velvet-400 hover:border-luxePink-500/50'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="cod" 
                          checked={paymentMethod === 'cod'} 
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-luxePink-500 w-4 h-4"
                        />
                        <div className="flex flex-col">
                          <span className="text-white font-semibold text-sm">Cash on Delivery</span>
                          <span className="text-[10px] text-luxePink-500 mt-1">+ ₹40 Delivery Fee</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-extrabold uppercase tracking-widest h-14 rounded-lg transition duration-300 shadow-[0_0_20px_rgba(219,39,119,0.3)] flex justify-center items-center disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Continue Payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
