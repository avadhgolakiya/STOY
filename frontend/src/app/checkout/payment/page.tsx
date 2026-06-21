"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";

export default function PaymentPage() {
  const router = useRouter();
  const { cart, shippingAddress, showToast, clearCart } = useAppContext();
  const paymentMethod = "razorpay";
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cart.length === 0 || !shippingAddress) {
      router.push("/cart");
    }
  }, [cart, shippingAddress, router]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 0;
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
    if (cart.length === 0 || !shippingAddress) return;

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
          paymentMethod,
          shippingAddress
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((data.message || 'Failed to create order') + ': ' + (data.error || '') + '\n' + (data.stack || ''));
      }

      if (paymentMethod === "razorpay") {
        if (data.razorpayOrder.isDummy) {
          showToast("Simulated Payment Successful! (Razorpay Keys Missing)", "info");
          clearCart();
          router.push("/thank-you");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummykey123",
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: "Adult store",
          description: "Luxury Purchase",
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
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
            color: "#db2777"
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

  if (!shippingAddress) return null;

  return (
    <div className="min-h-screen bg-velvet-400 pt-32 pb-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-cinzel text-white font-extrabold tracking-wide mb-8 border-b border-luxePink-500/20 pb-4">
          Complete Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Address Summary */}
          <div className="space-y-6">
            <div className="bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-cinzel text-white">Shipping To</h2>
                <button onClick={() => router.push("/checkout/address")} className="text-xs text-luxePink-500 hover:text-white uppercase tracking-widest transition">Edit</button>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <p className="text-white font-semibold">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                <p>{shippingAddress.flatNo}, {shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pinCode}</p>
                <p>Landmark: {shippingAddress.landmark}</p>
                <p>Phone: {shippingAddress.mobileNumber}</p>
                <p>Email: {shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6">
              <h2 className="text-lg font-cinzel text-white mb-4">Payment Method</h2>
              <div className="space-y-3">
                <div className="block border rounded-lg p-4 border-luxePink-500 bg-luxePink-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-[5px] border-luxePink-500 bg-white"></div>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-sm">Online Payment (Razorpay)</span>
                      <span className="text-[10px] text-gray-400 mt-1">Zero Delivery Fee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6 sticky top-32">
              <h2 className="text-xl font-cinzel text-white mb-6 border-b border-luxePink-500/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart.length} items)</span>
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

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-extrabold uppercase tracking-widest h-14 rounded-lg transition duration-300 shadow-[0_0_20px_rgba(219,39,119,0.3)] flex justify-center items-center disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
