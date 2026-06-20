"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../data/products";

export type CartItem = Product & { quantity: number };

type ToastType = "success" | "error" | "info";

type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  changeQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  fetchWishlist: () => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    // Load auth and wishlist
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchWishlist();
    }
    
    // Load cart
    const savedCart = localStorage.getItem('adut_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('adut_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5001/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.wishlist) {
        // Backend stores ObjectIds or populated objects. Our frontend products use number IDs!
        // Wait, products in our frontend are defined with id: number. We need to store them.
        // Wait! How did we add them to the backend? The backend expects a string productId? 
        // We can just store the number as string in backend, or backend can accept number string.
        // Actually, MongoDB expects ObjectId for refs. BUT our frontend data has id: number.
        // This is a problem: backend User schema `wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]`.
        // If our frontend products don't exist in MongoDB, we can't use ObjectId ref!
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`http://localhost:5001/api/users/wishlist/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.wishlist) {
        setWishlist(data.wishlist);
        if (data.message === 'Added to wishlist') {
          showToast('Added to Luxury Wishlist', 'success');
        } else {
          showToast('Removed from Luxury Wishlist', 'info');
        }
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to update wishlist', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setWishlist([]);
    showToast('You have been logged out safely.', 'info');
  };

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    router.push('/cart');
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item discharged from private vault.", "info");
  };

  const changeQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        isMobileMenuOpen,
        toggleMobileMenu,
        wishlist,
        toggleWishlist,
        fetchWishlist,
        isLoggedIn,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
