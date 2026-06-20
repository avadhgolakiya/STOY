"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { products, Product } from "../data/products";
import { useAppContext } from "../context/AppContext";

export default function ProductGrid() {
  const router = useRouter();
  const { addToCart, searchQuery, isLoggedIn, wishlist, toggleWishlist } = useAppContext();
  const [currentFilter, setCurrentFilter] = useState("All");
  const categories = ["All", "Watches", "Jewelry", "Leather Goods", "Fragrances", "Apparel"];

  const filteredProducts = products.filter((p) => {
    const matchesFilter = currentFilter === "All" || p.category === currentFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <section id="new-arrivals" className="py-5 bg-velvet-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-luxePink-500 text-xs uppercase tracking-[0.35em] block mb-2 text-glow-pink">
                ACQUIRE OUR MASTERPIECES
              </span>
              <h2 className="text-2xl sm:text-4xl font-cinzel text-white font-extrabold tracking-wide">
                Elite New Collections
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCurrentFilter(cat)}
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full transition duration-300 font-semibold ${currentFilter === cat
                      ? "border border-luxePink-500 text-velvet-400 bg-luxePink-400 shadow-lg shadow-luxePink-500/10"
                      : "border border-luxePink-500/20 text-luxePink-500 hover:border-luxePink-500 hover:bg-luxePink-500/10"
                    }`}
                >
                  {cat === "All" ? "ALL PIECES" : cat === "Leather Goods" ? "COUTURE BAGS" : cat}
                </button>
              ))}
            </div>
          </div>

          <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-500">
                <i className="fa-solid fa-ban text-3xl text-luxePink-500/20 mb-3 block"></i>
                <p className="text-xs uppercase tracking-widest">No Premium Pieces Match Your Search Parameters</p>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const formattedPrice = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(p.price);
                const formattedOriginalPrice = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(p.originalPrice);

                return (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/product/${p.id}`)}
                    className="cursor-pointer luxury-card-shadow bg-velvet-300 border border-luxePink-500/10 rounded-2xl overflow-hidden relative group transition-all duration-300"
                  >
                    <div className="relative h-72 overflow-hidden bg-velvet-200 luxury-scale-hover">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover filter contrast-125 brightness-95 group-hover:brightness-75 luxury-transition hue-rotate-[290deg]"
                      />
                      <span className="absolute top-4 left-4 bg-velvet-400/90 backdrop-blur-sm border border-luxePink-500/30 text-luxePink-500 text-[8px] font-extrabold tracking-[0.2em] px-3 py-1 rounded">
                        {p.tag}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-velvet-400 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-velvet-400/50 backdrop-blur-sm">
                        <Link
                          href={`/product/${p.id}`}
                          className="w-12 h-12 rounded-full bg-luxePink-500 text-velvet-400 hover:bg-white hover:text-velvet-400 flex items-center justify-center luxury-transition pink-border-glow transform scale-90 hover:scale-105"
                        >
                          <i className="fa-solid fa-eye text-sm"></i>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p);
                          }}
                          className="w-12 h-12 rounded-full bg-velvet-400 border border-luxePink-500 text-luxePink-500 hover:bg-luxePink-500 hover:text-velvet-400 flex items-center justify-center luxury-transition pink-border-glow transform scale-90 hover:scale-105"
                        >
                          <i className="fa-solid fa-cart-plus text-sm"></i>
                        </button>
                        {isLoggedIn && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(p.id);
                            }}
                            className={`w-12 h-12 rounded-full border border-luxePink-500 flex items-center justify-center luxury-transition pink-border-glow transform scale-90 hover:scale-105 ${wishlist.includes(p.id)
                                ? "bg-luxePink-500 text-white"
                                : "bg-velvet-400 text-luxePink-500 hover:bg-luxePink-500 hover:text-velvet-400"
                              }`}
                          >
                            <i className={`${wishlist.includes(p.id) ? "fa-solid" : "fa-regular"} fa-heart text-sm`}></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-luxePink-500 uppercase tracking-[0.2em] font-bold">
                          {p.category}
                        </span>
                        <span className="text-xs text-fuchsia-400">
                          <i className="fa-solid fa-star text-[9px] mr-1"></i>5.0
                        </span>
                      </div>
                      <h3 className="font-cinzel text-white text-sm font-semibold group-hover:text-luxePink-500 transition duration-300 mb-4 truncate">
                        {p.title}
                      </h3>
                      <div className="flex justify-between items-end pt-4 border-t border-luxePink-500/10 gap-2">
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <span className="text-[9px] sm:text-[10px] text-gray-500 line-through">
                              {formattedOriginalPrice}
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-luxePink-400 font-bold bg-luxePink-950/50 px-1 py-0.5 sm:px-1.5 rounded border border-luxePink-500/10 whitespace-nowrap">
                              {p.discount}% OFF
                            </span>
                          </div>
                          <span className="text-luxePink-500 font-extrabold text-sm sm:text-base block text-glow-pink truncate">
                            {formattedPrice}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p);
                          }}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-luxePink-600 hover:bg-luxePink-500 text-white rounded-full flex-shrink-0 flex items-center justify-center transition-colors shadow-lg shadow-luxePink-500/20 mb-1"
                        >
                          <i className="fa-solid fa-shopping-bag text-[10px] sm:text-[12px]"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}
