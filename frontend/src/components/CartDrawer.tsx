"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, toggleCart, cart, changeQuantity, removeFromCart, clearCart, showToast } = useAppContext();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your vault is currently empty. Add premium drops first!", "error");
      return;
    }
    toggleCart();
    router.push("/cart");
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-velvet-300/98 backdrop-blur-md shadow-2xl border-l border-luxePink-500/20 transform ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-500 ease-in-out flex flex-col justify-between`}
    >
      <div className="p-6 border-b border-luxePink-500/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-bag-shopping text-luxePink-500 text-lg"></i>
          <h3 className="font-cinzel text-lg text-white font-bold uppercase tracking-widest">
            Private Vault
          </h3>
        </div>
        <button onClick={toggleCart} className="text-gray-400 hover:text-white transition duration-200">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 luxury-scrollbar">
        {cart.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <i className="fa-solid fa-vault text-4xl text-luxePink-500/20 mb-4 block"></i>
            <p className="text-xs uppercase tracking-widest">Your Private Vault is Currently Vacant</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item._id || item.id} className="flex items-center gap-3 sm:gap-4 bg-velvet-400 p-3 sm:p-4 rounded-xl border border-luxePink-500/10">
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg border border-luxePink-500/15 hue-rotate-[290deg]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] sm:text-xs text-white font-semibold uppercase tracking-wider truncate">{item.title}</h4>
                <p className="text-[10px] sm:text-[11px] text-luxePink-500 font-bold mt-1">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => changeQuantity((item._id || item.id)!, -1)}
                    className="w-5 h-5 bg-velvet-200 hover:bg-luxePink-500 hover:text-velvet-400 text-luxePink-500 rounded flex items-center justify-center text-xs transition duration-200"
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <span className="text-xs text-white font-bold px-2">{item.quantity}</span>
                  <button
                    onClick={() => changeQuantity((item._id || item.id)!, 1)}
                    className="w-5 h-5 bg-velvet-200 hover:bg-luxePink-500 hover:text-velvet-400 text-luxePink-500 rounded flex items-center justify-center text-xs transition duration-200"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart((item._id || item.id)!)}
                className="text-gray-500 hover:text-red-500 transition duration-200 p-2"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-velvet-400 border-t border-luxePink-500/10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400 text-xs uppercase tracking-widest">Total Vault Value</span>
          <span className="text-white font-bold text-xl">{formattedTotal}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-luxePink-500 hover:bg-luxePink-600 text-velvet-400 font-extrabold uppercase tracking-widest py-4 rounded-xl transition duration-300 shadow-lg shadow-luxePink-500/20"
        >
          Secure Checkout <i className="fa-solid fa-shield-halved ml-2"></i>
        </button>
        <button
          onClick={clearCart}
          className="w-full mt-4 text-[10px] text-gray-500 hover:text-luxePink-500 uppercase tracking-widest transition duration-300"
        >
          Discharge Entire Vault
        </button>
      </div>
    </div>
  );
}
