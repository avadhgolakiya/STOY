"use client";

import { useState } from "react";
import { Product } from "../data/products";
import { useAppContext } from "../context/AppContext";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart, showToast } = useAppContext();
  const [quantity, setQuantity] = useState(1);

  const handleAddMainToCart = () => {
    for(let i=0; i<quantity; i++) {
      addToCart(product);
    }
  };

  const formattedPrice = (price: number) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="mb-8">
      <p className="text-sm font-semibold mb-3 text-gray-300">Quantity:</p>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center border border-luxePink-500/30 rounded-lg overflow-hidden bg-velvet-300 h-12">
          <button 
            className="w-10 h-full flex items-center justify-center text-luxePink-500 hover:bg-luxePink-500/10 transition"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <span className="w-12 text-center font-bold text-white text-lg">{quantity}</span>
          <button 
            className="w-10 h-full flex items-center justify-center text-luxePink-500 hover:bg-luxePink-500/10 transition"
            onClick={() => setQuantity(q => q + 1)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        
        <button 
          onClick={handleAddMainToCart}
          className="flex-1 w-full sm:w-auto bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-extrabold uppercase tracking-widest h-12 rounded-lg transition duration-300 shadow-[0_0_20px_rgba(219,39,119,0.3)] flex justify-center items-center"
        >
          Add to cart - {formattedPrice(product.price * quantity)}
        </button>
      </div>
      
      <button className="w-full mt-4 bg-velvet-300 border border-luxePink-500 text-luxePink-500 hover:bg-luxePink-500 hover:text-white font-extrabold uppercase tracking-widest h-12 rounded-lg transition duration-300 flex justify-center items-center gap-2">
        BUY IT NOW <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
}
