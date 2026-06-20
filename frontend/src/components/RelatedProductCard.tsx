"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "../data/products";
import { useAppContext } from "../context/AppContext";

export default function RelatedProductCard({ related }: { related: Product }) {
  const router = useRouter();
  const { addToCart, showToast, isLoggedIn, wishlist, toggleWishlist } = useAppContext();

  const formattedPrice = (price: number) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div
      onClick={() => router.push(`/product/${related.id}`)}
      className="cursor-pointer luxury-card-shadow bg-velvet-300 border border-luxePink-500/10 rounded-2xl overflow-hidden relative group transition-all duration-300"
    >
      <div className="relative h-72 overflow-hidden bg-velvet-200 luxury-scale-hover">
        <img
          src={related.image}
          alt={related.title}
          className="w-full h-full object-cover filter contrast-125 brightness-95 group-hover:brightness-75 luxury-transition hue-rotate-[290deg]"
        />
        <span className="absolute top-4 left-4 bg-velvet-400/90 backdrop-blur-sm border border-luxePink-500/30 text-luxePink-500 text-[8px] font-extrabold tracking-[0.2em] px-3 py-1 rounded">
          {related.tag}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-velvet-400 via-transparent to-transparent opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-velvet-400/50 backdrop-blur-sm">
          <Link
            href={`/product/${related.id}`}
            className="w-12 h-12 rounded-full bg-luxePink-500 text-velvet-400 hover:bg-white hover:text-velvet-400 flex items-center justify-center luxury-transition pink-border-glow transform scale-90 hover:scale-105"
          >
            <i className="fa-solid fa-eye text-sm"></i>
          </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(related);
              }}
              className="w-12 h-12 rounded-full bg-velvet-400 border border-luxePink-500 text-luxePink-500 hover:bg-luxePink-500 hover:text-velvet-400 flex items-center justify-center luxury-transition pink-border-glow transform scale-90 hover:scale-105"
            >
              <i className="fa-solid fa-cart-plus text-sm"></i>
            </button>
            {isLoggedIn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(related.id);
                }}
                className={`w-12 h-12 rounded-full border border-luxePink-500 flex items-center justify-center luxury-transition pink-border-glow transform scale-90 hover:scale-105 ${
                  wishlist.includes(related.id)
                    ? "bg-luxePink-500 text-white"
                    : "bg-velvet-400 text-luxePink-500 hover:bg-luxePink-500 hover:text-velvet-400"
                }`}
              >
                <i className={`${wishlist.includes(related.id) ? "fa-solid" : "fa-regular"} fa-heart text-sm`}></i>
              </button>
            )}
          </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] text-luxePink-500 uppercase tracking-[0.2em] font-bold">
            {related.category}
          </span>
          <span className="text-xs text-fuchsia-400">
            <i className="fa-solid fa-star text-[9px] mr-1"></i>5.0
          </span>
        </div>
        <h3 className="font-cinzel text-white text-sm font-semibold group-hover:text-luxePink-500 transition duration-300 mb-4 truncate">
          {related.title}
        </h3>
        <div className="flex justify-between items-end pt-4 border-t border-luxePink-500/10 gap-2">
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] text-gray-500 line-through">
                {formattedPrice(related.originalPrice)}
              </span>
              <span className="text-[8px] sm:text-[9px] text-luxePink-400 font-bold bg-luxePink-950/50 px-1 py-0.5 sm:px-1.5 rounded border border-luxePink-500/10 whitespace-nowrap">
                {related.discount}% OFF
              </span>
            </div>
            <span className="text-luxePink-500 font-extrabold text-sm sm:text-base block text-glow-pink truncate">
              {formattedPrice(related.price)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(related);
            }}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-luxePink-600 hover:bg-luxePink-500 text-white rounded-full flex-shrink-0 flex items-center justify-center transition-colors shadow-lg shadow-luxePink-500/20 mb-1"
          >
            <i className="fa-solid fa-shopping-bag text-[10px] sm:text-[12px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
