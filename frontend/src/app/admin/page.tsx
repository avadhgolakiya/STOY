"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

const COLORS = ["#EC4899", "#A855F7", "#F97316", "#06B6D4", "#22C55E"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-velvet-300 border border-luxePink-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-luxePink-400 mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || item.stroke }}></span>
            <span className="text-xs text-gray-300">{item.name}:</span>
            <span className="text-xs font-extrabold text-white">
              {item.name === "Earnings" 
                ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.value)
                : `${item.value} Orders`
              }
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateFilter, setDateFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testiForm, setTestiForm] = useState({ clientName: "", role: "Client", quote: "", rating: 5, image: "" });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "", category: "", price: "", originalPrice: "", discount: "", desc: "", image: "", additionalImages: [] as string[], tag: "New Arrival", stock: "", size: ""
  });
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [bannerForm, setBannerForm] = useState({ title: "", desc: "", image: "", isActive: false });
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<{ orderId: string; status: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchOrders = async (searchVal = orderSearchQuery) => {
    try {
      console.log("Fetching orders from API...");
      const url = searchVal 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/orders?search=${encodeURIComponent(searchVal)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/orders`;
      const res = await fetch(url, { cache: 'no-store' });
      console.log("Fetch orders response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched orders data:", data);
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const updateDeliveryStatus = async (orderId: string, status: string, message: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryStatus: status, message })
      });
      if (res.ok) {
        showToast("Status updated and email notification sent successfully!", "success");
        fetchOrders();
      } else {
        showToast("Failed to update status.", "error");
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating status.", "error");
      fetchOrders();
    }
  };

  const openStatusModal = (orderId: string, status: string) => {
    setStatusMessage("");
    setStatusModal({ orderId, status });
  };

  const getFilteredOrders = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const lastWeekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonthStart = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (dateFilter === "today") {
        return orderDate >= todayStart;
      }
      if (dateFilter === "yesterday") {
        return orderDate >= yesterdayStart && orderDate < todayStart;
      }
      if (dateFilter === "week") {
        return orderDate >= lastWeekStart;
      }
      if (dateFilter === "month") {
        return orderDate >= lastMonthStart;
      }
      return true;
    });
  };

  const getChartData = (filteredOrders: any[]) => {
    const groups: { [key: string]: { date: string; Earnings: number; Orders: number } } = {};
    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    sortedOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      });

      if (!groups[dateStr]) {
        groups[dateStr] = { date: dateStr, Earnings: 0, Orders: 0 };
      }

      groups[dateStr].Earnings += order.totalAmount || 0;
      groups[dateStr].Orders += 1;
    });

    return Object.values(groups);
  };

  const getStatusBreakdownData = (filteredOrders: any[]) => {
    const counts = {
      'Not Confirmed': 0,
      'Confirmed': 0,
      'Processing': 0,
      'Shipped': 0,
      'Delivered': 0
    };

    filteredOrders.forEach(order => {
      const status = order.deliveryStatus || 'Not Confirmed yet';
      if (status === 'Not Confirmed yet') counts['Not Confirmed']++;
      else if (status === 'Order Confirmed') counts['Confirmed']++;
      else if (status === 'Processing') counts['Processing']++;
      else if (status === 'Shipped') counts['Shipped']++;
      else if (status === 'Delivered') counts['Delivered']++;
    });

    return [
      { name: 'Not Confirmed', value: counts['Not Confirmed'] },
      { name: 'Confirmed', value: counts['Confirmed'] },
      { name: 'Processing', value: counts['Processing'] },
      { name: 'Shipped', value: counts['Shipped'] },
      { name: 'Delivered', value: counts['Delivered'] }
    ].filter(item => item.value > 0);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) return;

    setIsLoggingIn(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        setAdminToken(data.token);
        showToast("Logged in successfully!", "success");
        fetchCategories();
        fetchTestimonials();
        fetchProducts();
        fetchOrders();
        fetchBanners();
      } else {
        showToast(data.message || "Invalid admin credentials.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Connection error, please try again.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error("Failed to fetch banners", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append('image', file);
    setUploadingImage(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        body: formDataFile
      });
      if (res.ok) {
        const imagePath = await res.text();
        setFormData({ ...formData, image: `${process.env.NEXT_PUBLIC_API_URL}${imagePath}` });
      } else {
        showToast("Image upload failed.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Image upload failed.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadMultipleFilesHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formDataFile = new FormData();
        formDataFile.append('image', files[i]);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: "POST",
          body: formDataFile
        });

        if (res.ok) {
          const imagePath = await res.text();
          newImages.push(`${process.env.NEXT_PUBLIC_API_URL}${imagePath}`);
        } else {
          console.error(`Failed to upload file ${files[i].name}`);
        }
      }

      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newImages]
      }));
    } catch (error) {
      console.error(error);
      showToast("Some images failed to upload.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setAdminToken(token);
    setAuthLoading(false);

    if (token) {
      fetchCategories();
      fetchTestimonials();
      fetchProducts();
      fetchOrders();
      fetchBanners();
      fetchUsers();
    }
  }, []);

  // Fetch specific data when tabs change to keep it fresh
  useEffect(() => {
    if (!adminToken) return;
    if (activeTab === "orders" || activeTab === "dashboard") {
      fetchOrders();
    } else if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "categories") {
      fetchCategories();
    } else if (activeTab === "testimonials") {
      fetchTestimonials();
    } else if (activeTab === "banners") {
      fetchBanners();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, adminToken]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-velvet-500 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-luxePink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-velvet-500 flex items-center justify-center px-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxePink-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-luxePink-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="bg-velvet-300 border border-luxePink-500/20 max-w-md w-full rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-cinzel text-white font-extrabold tracking-widest uppercase mb-2">AdultDesire</h1>
            <p className="text-xs text-luxePink-500 tracking-widest uppercase font-semibold">Admin Panel Access</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                placeholder="admin@adultdesire.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full cursor-pointer bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-extrabold uppercase tracking-widest h-12 rounded-lg transition duration-300 shadow-[0_0_20px_rgba(219,39,119,0.3)] flex justify-center items-center disabled:opacity-50"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/" className="text-xs text-gray-500 hover:text-luxePink-400 transition-colors">
              <i className="fa-solid fa-arrow-left mr-1"></i> Back to Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-velvet-500 text-white font-sans">
      <div className="flex h-screen overflow-hidden flex-col md:flex-row w-full">

        {/* Mobile Top Bar */}
        <div className="md:hidden bg-velvet-400 border-b border-luxePink-500/20 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-300 hover:text-white p-1 text-xl cursor-pointer"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div>
              <h1 className="font-cinzel font-bold text-sm text-white tracking-wider">ADULT STORE</h1>
              <p className="text-[8px] text-luxePink-500 tracking-[0.2em] uppercase">Admin Portal</p>
            </div>
          </div>
          <span className="text-xs font-bold text-luxePink-400 uppercase bg-luxePink-500/10 px-3 py-1 rounded-full border border-luxePink-500/20">
            {activeTab}
          </span>
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div 
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            ></div>
            
            {/* Drawer Content */}
            <div className="relative w-64 max-w-xs bg-velvet-400 border-r border-luxePink-500/20 h-full flex flex-col p-6 z-10 animate-slide-from-left">
              <div className="flex items-center justify-between pb-6 border-b border-luxePink-500/20 mb-6">
                <div>
                  <h1 className="font-cinzel font-bold text-lg text-white">ADULT STORE</h1>
                  <p className="text-[9px] text-luxePink-500 tracking-[0.2em] uppercase">Admin Portal</p>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white text-lg p-1 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {[
                  { id: "dashboard", label: "Dashboard", icon: "fa-chart-line" },
                  { id: "products", label: "Products", icon: "fa-gem" },
                  { id: "categories", label: "Categories", icon: "fa-list" },
                  { id: "testimonials", label: "Testimonials", icon: "fa-comment-dots" },
                  { id: "banners", label: "Hero Banners", icon: "fa-image" },
                  { id: "orders", label: "Orders", icon: "fa-shopping-bag" },
                  { id: "users", label: "Users", icon: "fa-users" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide flex items-center cursor-pointer ${activeTab === item.id ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
                  >
                    <i className={`fa-solid ${item.icon} w-6`}></i> {item.label}
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-luxePink-500/20">
                <button 
                  onClick={() => {
                    localStorage.removeItem("adminToken");
                    setAdminToken(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-luxePink-500 transition-colors flex items-center cursor-pointer"
                >
                  <i className="fa-solid fa-sign-out-alt w-6"></i> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar (Desktop) */}
        <aside className="w-64 bg-velvet-400 border-r border-luxePink-500/20 hidden md:flex flex-col h-full">
          <div className="p-6 border-b border-luxePink-500/20">
            <h1 className="font-cinzel font-bold text-xl text-glow-pink text-white">
              ADULT STORE
            </h1>
            <p className="text-[10px] text-luxePink-500 tracking-[0.2em] mt-1 uppercase">
              Admin Portal
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide ${activeTab === "dashboard" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-chart-line w-6"></i> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide ${activeTab === "products" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-gem w-6"></i> Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide ${activeTab === "categories" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-list w-6"></i> Categories
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide ${activeTab === "testimonials" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-star w-6"></i> Testimonials
            </button>
            <button
              onClick={() => setActiveTab("banners")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide ${activeTab === "banners" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-image w-6"></i> Hero Banners
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide flex items-center cursor-pointer ${activeTab === "orders" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-shopping-bag w-6"></i> Orders
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide flex items-center cursor-pointer ${activeTab === "users" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-users w-6"></i> Users
            </button>
          </nav>

          <div className="p-4 border-t border-luxePink-500/20">
            <button
              onClick={() => {
                localStorage.removeItem("adminToken");
                setAdminToken(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-luxePink-500 transition-colors"
            >
              <i className="fa-solid fa-sign-out-alt w-6"></i> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-velvet-500 p-8">
          <header className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-cinzel font-bold text-white tracking-wide">
              {activeTab === "dashboard" && "Dashboard & Analytics"}
              {activeTab === "products" && "Product Inventory"}
              {activeTab === "categories" && "Manage Categories"}
              {activeTab === "testimonials" && "Client Testimonials"}
              {activeTab === "banners" && "Hero Banners"}
              {activeTab === "orders" && "Recent Orders"}
              {activeTab === "users" && "Registered Users"}
            </h2>

            {activeTab !== "orders" && activeTab !== "categories" && activeTab !== "dashboard" && (
              <button
                onClick={() => {
                  if (activeTab === "products") {
                    setFormData({ title: "", category: "", price: "", originalPrice: "", discount: "", desc: "", image: "", additionalImages: [], tag: "New Arrival", stock: "", size: "" });
                    setEditingProductId(null);
                  } else if (activeTab === "testimonials") {
                    setTestiForm({ clientName: "", role: "Client", quote: "", rating: 5, image: "" });
                  } else if (activeTab === "banners") {
                    setBannerForm({ title: "", desc: "", image: "", isActive: false });
                    setEditingBannerId(null);
                  }
                  setShowAddForm(true);
                }}
                className="bg-gradient-to-r from-luxePink-600 to-fuchsia-600 hover:from-luxePink-500 hover:to-fuchsia-500 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider luxury-transition shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                <i className="fa-solid fa-plus mr-2"></i> Add New
              </button>
            )}
          </header>

          {/* Content Area */}
          {/* Content Area */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Filter Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-velvet-400 border border-luxePink-500/10 p-4 rounded-xl shadow-lg">
                <div>
                  <h3 className="text-base sm:text-lg font-cinzel text-white font-semibold">Performance Overview</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">Track earnings, orders, and fulfillment stats</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "today", label: "Today" },
                    { value: "yesterday", label: "Yesterday" },
                    { value: "week", label: "Last 7 Days" },
                    { value: "month", label: "Last 30 Days" },
                    { value: "all", label: "All Time" }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setDateFilter(filter.value)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${dateFilter === filter.value
                          ? "bg-luxePink-600 border-luxePink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                          : "bg-velvet-500 border-[#2a2635] text-gray-400 hover:text-white"
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Revenue",
                    value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
                      getFilteredOrders().reduce((acc, order) => acc + (order.totalAmount || 0), 0)
                    ),
                    icon: "fa-money-bill-trend-up",
                    color: "text-green-400",
                    bg: "bg-green-500/10 border-green-500/20"
                  },
                  {
                    title: "Total Orders",
                    value: getFilteredOrders().length,
                    icon: "fa-cart-shopping",
                    color: "text-blue-400",
                    bg: "bg-blue-500/10 border-blue-500/20"
                  },
                  {
                    title: "Product Items Sold",
                    value: getFilteredOrders().reduce((acc, order) => {
                      try {
                        const items = JSON.parse(order.items || '[]');
                        return acc + items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
                      } catch {
                        return acc;
                      }
                    }, 0),
                    icon: "fa-gem",
                    color: "text-luxePink-400",
                    bg: "bg-luxePink-500/10 border-luxePink-500/20"
                  },
                  {
                    title: "Pending Orders",
                    value: getFilteredOrders().filter(o => o.deliveryStatus === 'Not Confirmed yet' || o.paymentStatus === 'pending').length,
                    icon: "fa-clock-rotate-left",
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10 border-yellow-500/20"
                  }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-6 rounded-xl border ${stat.bg} bg-velvet-400 shadow-lg relative group overflow-hidden`}>
                    <div className="absolute -right-4 -bottom-4 opacity-5 text-8xl text-white pointer-events-none group-hover:scale-110 transition-transform duration-500">
                      <i className={`fa-solid ${stat.icon}`}></i>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</span>
                      <span className={`${stat.color} text-lg`}>
                        <i className={`fa-solid ${stat.icon}`}></i>
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-white tracking-wide">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-velvet-400 border border-luxePink-500/10 p-5 rounded-xl">
                {[
                  { label: "Confirmed", count: getFilteredOrders().filter(o => o.deliveryStatus === 'Order Confirmed').length, color: "text-purple-400" },
                  { label: "Processing", count: getFilteredOrders().filter(o => o.deliveryStatus === 'Processing').length, color: "text-orange-400" },
                  { label: "Shipped", count: getFilteredOrders().filter(o => o.deliveryStatus === 'Shipped').length, color: "text-cyan-400" },
                  { label: "Delivered", count: getFilteredOrders().filter(o => o.deliveryStatus === 'Delivered').length, color: "text-green-400" }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-3 bg-velvet-500/50 rounded-lg border border-[#2a2635]">
                    <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{item.label}</span>
                    <span className={`text-xl font-black ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue & Sales Area Chart */}
                <div className="lg:col-span-2 bg-velvet-400 border border-luxePink-500/15 p-6 rounded-xl shadow-xl">
                  <h4 className="font-cinzel text-white text-base font-bold tracking-wide mb-6">Revenue &amp; Orders Trend</h4>
                  {getChartData(getFilteredOrders()).length === 0 ? (
                    <div className="h-72 flex items-center justify-center text-gray-500 italic text-sm">
                      No transaction data available for the selected period
                    </div>
                  ) : (
                    <div className="h-72 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={getChartData(getFilteredOrders())}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="rgba(255, 255, 255, 0.2)" 
                            tick={{ fill: "#9ca3af", fontSize: 10 }}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="rgba(255, 255, 255, 0.2)" 
                            tick={{ fill: "#9ca3af", fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            verticalAlign="top" 
                            height={36} 
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "11px", color: "#e5e7eb" }}
                          />
                          <Area 
                            name="Earnings"
                            type="monotone" 
                            dataKey="Earnings" 
                            stroke="#ec4899" 
                            strokeWidth={2.5}
                            fillOpacity={1} 
                            fill="url(#colorEarnings)" 
                          />
                          <Area 
                            name="Orders"
                            type="monotone" 
                            dataKey="Orders" 
                            stroke="#a855f7" 
                            strokeWidth={2.5}
                            fillOpacity={1} 
                            fill="url(#colorOrders)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Status Breakdown Donut Chart */}
                <div className="lg:col-span-1 bg-velvet-400 border border-luxePink-500/15 p-6 rounded-xl shadow-xl">
                  <h4 className="font-cinzel text-white text-base font-bold tracking-wide mb-6">Fulfillment Distribution</h4>
                  {getStatusBreakdownData(getFilteredOrders()).length === 0 ? (
                    <div className="h-72 flex items-center justify-center text-gray-500 italic text-sm">
                      No order status data available
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-72">
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getStatusBreakdownData(getFilteredOrders())}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {getStatusBreakdownData(getFilteredOrders()).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: any) => [`${value} Orders`, 'Count']} 
                              contentStyle={{ backgroundColor: "#150421", border: "1px solid rgba(236,72,153,0.3)", borderRadius: "8px", color: "#ffffff", fontSize: "12px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 text-[11px] text-gray-400 font-semibold">
                        {getStatusBreakdownData(getFilteredOrders()).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                            <span>{item.name}: {item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!showAddForm && activeTab === "orders" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-4 sm:p-8 min-h-[500px] shadow-2xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luxePink-500/20 pb-4 mb-6 gap-4">
                <h4 className="font-cinzel text-white text-lg">Recent Orders</h4>
                
                {/* Search Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchOrders(orderSearchQuery);
                  }}
                  className="flex gap-2 w-full sm:max-w-md"
                >
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search by Order ID, Email or Name..."
                      className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-luxePink-500"
                    />
                    <i className="fa-solid fa-search absolute left-3 top-2.5 text-gray-500 text-xs"></i>
                    {orderSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setOrderSearchQuery("");
                          fetchOrders("");
                        }}
                        className="absolute right-3 top-2 text-gray-400 hover:text-white p-0.5 text-xs cursor-pointer"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-luxePink-600 hover:bg-luxePink-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Search
                  </button>
                </form>
              </div>

              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No orders found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs text-luxePink-500 uppercase bg-velvet-500 border-b border-luxePink-500/20">
                      <tr>
                        <th className="px-6 py-4 font-semibold tracking-wider">Order ID</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Customer</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Amount</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Payment Status</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Delivery Status</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id} className="bg-velvet-400 border-b border-luxePink-500/10 hover:bg-velvet-300 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{order._id.substring(0, 8)}...</td>
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{order.customerName}</div>
                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">₹{order.totalAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider ${order.paymentStatus === 'paid'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.deliveryStatus || 'Not Confirmed yet'}
                              onChange={(e) => openStatusModal(order._id, e.target.value)}
                              className="bg-velvet-500 border border-luxePink-500/30 text-white text-xs rounded p-1 focus:outline-none focus:border-luxePink-500"
                            >
                              <option value="Not Confirmed yet">Not Confirmed yet</option>
                              <option value="Order Confirmed">Order Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {!showAddForm && activeTab === "products" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-4 sm:p-8 min-h-[500px] shadow-2xl relative">
              <h4 className="font-cinzel text-white text-lg border-b border-luxePink-500/20 pb-4 mb-6">Existing Products</h4>
              {products.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No products created yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => (
                    <div key={product._id} className="bg-[#131118] border border-[#2a2635] rounded-2xl overflow-hidden hover:border-luxePink-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(219,39,119,0.15)] group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                      <div className="aspect-[4/5] overflow-hidden relative bg-[#0a0a0a]">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white font-bold border border-white/10 shadow-lg tracking-wider">
                          ₹{product.price}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="text-white font-cinzel font-bold text-base line-clamp-1 flex-1 pr-2 group-hover:text-luxePink-400 transition-colors">{product.title}</h5>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({
                                  title: product.title || "",
                                  category: product.category || "",
                                  price: product.price ? product.price.toString() : "",
                                  originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
                                  discount: product.discount ? product.discount.toString() : "",
                                  desc: product.desc || "",
                                  image: product.image || "",
                                  additionalImages: product.additionalImages || [],
                                  tag: product.tag || "New Arrival",
                                  stock: product.stock?.toString() || "0",
                                  size: product.size || ""
                                });
                                setEditingProductId(product._id);
                                setShowAddForm(true);
                              }}
                              className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 p-2 -mt-2 rounded-full transition-all"
                              title="Edit Product"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm("Delete this product?")) {
                                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${product._id}`, { method: "DELETE" });
                                  fetchProducts();
                                }
                              }}
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 -mr-2 -mt-2 rounded-full transition-all"
                              title="Delete Product"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs uppercase tracking-widest font-semibold">
                          <span className="text-gray-500">{product.category}</span>
                          {product.tag && (
                            <span className="text-luxePink-500">{product.tag}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "categories" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-4 sm:p-8 min-h-[500px] shadow-2xl relative">
              <div className="mb-8">
                <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Create New Category</label>
                <form
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newCategoryName) return;
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: newCategoryName })
                      });
                      if (res.ok) {
                        setNewCategoryName("");
                        fetchCategories();
                      } else {
                        showToast("Failed to add category", "error");
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full sm:flex-1 bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                    placeholder="e.g., Handbags"
                  />
                  <button type="submit" className="w-full sm:w-auto cursor-pointer bg-luxePink-600 hover:bg-luxePink-500 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    Add
                  </button>
                </form>
              </div>

              <h4 className="font-cinzel text-white text-lg border-b border-luxePink-500/20 pb-4 mb-4">Existing Categories</h4>
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No categories created yet. (Or waiting for backend connection)</p>
              ) : (
                <ul className="space-y-3">
                  {categories.map(cat => (
                    <li key={cat._id} className="flex justify-between items-center bg-velvet-500 p-4 rounded-lg border border-luxePink-500/10">
                      <span className="text-white font-medium">{cat.name}</span>
                      <button
                        onClick={async () => {
                          if (confirm("Delete this category?")) {
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${cat._id}`, { method: "DELETE" });
                            fetchCategories();
                          }
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {!showAddForm && activeTab === "testimonials" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-4 sm:p-8 min-h-[500px] shadow-2xl relative">
              <h4 className="font-cinzel text-white text-lg border-b border-luxePink-500/20 pb-4 mb-4">Existing Testimonials</h4>
              {testimonials.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No testimonials added yet.</p>
              ) : (
                <ul className="space-y-4">
                  {testimonials.map((t: any) => (
                    <li key={t._id} className="flex gap-4 items-start bg-velvet-500 p-4 rounded-lg border border-luxePink-500/10">
                      {t.image ? (
                        <img src={t.image} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border border-luxePink-500/30" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-luxePink-500/10 border border-luxePink-500/30 flex items-center justify-center text-luxePink-500 font-cinzel font-bold text-lg">
                          {t.clientName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-white font-bold">{t.clientName}</h5>
                            <p className="text-luxePink-500 text-xs uppercase tracking-widest">{t.role}</p>
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this testimonial?")) {
                                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${t._id}`, { method: "DELETE" });
                                fetchTestimonials();
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                        <div className="flex text-fuchsia-400 text-xs mt-1 mb-2">
                          {[...Array(t.rating || 5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                        </div>
                        <p className="text-gray-300 text-sm font-light italic">"{t.quote}"</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {!showAddForm && activeTab === "banners" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-4 sm:p-8 min-h-[500px] shadow-2xl relative">
              <h4 className="font-cinzel text-white text-lg border-b border-luxePink-500/20 pb-4 mb-6">Existing Hero Banners</h4>
              {banners.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No banners created yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {banners.map((banner: any) => (
                    <div key={banner._id} className="bg-[#131118] border border-[#2a2635] rounded-2xl overflow-hidden hover:border-luxePink-500/50 transition-all duration-300 shadow-lg relative group">
                      <div className="aspect-[16/9] overflow-hidden relative bg-[#0a0a0a]">
                        <img src={banner.image} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border border-white/10 shadow-lg tracking-wider ${banner.isActive ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}`}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-center">
                          <h5 className="text-white font-cinzel font-bold text-base line-clamp-1 flex-1 pr-2">Banner Slide</h5>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setBannerForm({
                                  title: "",
                                  desc: "",
                                  image: banner.image || "",
                                  isActive: banner.isActive || false
                                });
                                setEditingBannerId(banner._id);
                                setShowAddForm(true);
                              }}
                              className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-full transition-all"
                              title="Edit Banner"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Delete this banner?")) {
                                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners/${banner._id}`, { method: "DELETE" });
                                  fetchBanners();
                                }
                              }}
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-full transition-all"
                              title="Delete Banner"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showAddForm && activeTab === "testimonials" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6 border-b border-luxePink-500/20 pb-4">
                <h3 className="text-xl font-cinzel font-bold text-white">Add New Testimonial</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(testiForm)
                    });
                    if (res.ok) {
                      setTestiForm({ clientName: "", role: "Client", quote: "", rating: 5, image: "" });
                      setShowAddForm(false);
                      fetchTestimonials();
                    } else {
                      showToast("Failed to add testimonial", "error");
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Client Name</label>
                    <input
                      type="text"
                      required
                      value={testiForm.clientName}
                      onChange={e => setTestiForm({ ...testiForm, clientName: e.target.value })}
                      className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                      placeholder="e.g., Alexander V."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Role / Designation</label>
                    <input
                      type="text"
                      value={testiForm.role}
                      onChange={e => setTestiForm({ ...testiForm, role: e.target.value })}
                      className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                      placeholder="e.g., Private Collector"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Star Rating (1-5)</label>
                    <input
                      type="number"
                      min="1" max="5" required
                      value={testiForm.rating}
                      onChange={e => setTestiForm({ ...testiForm, rating: Number(e.target.value) })}
                      className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2 border border-luxePink-500/30 p-4 rounded-lg bg-velvet-600/50">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Product Image / Avatar</label>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="text-gray-400 text-xs mb-1 block">Option 1: Paste an Image URL</span>
                        <input
                          type="text"
                          value={testiForm.image}
                          onChange={(e) => setTestiForm({ ...testiForm, image: e.target.value })}
                          className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-xs uppercase font-bold">OR</span>
                        <div className="h-px bg-luxePink-500/20 flex-1"></div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs mb-1 block">Option 2: Upload from Computer</span>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            id="testi-image-file"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formDataFile = new FormData();
                              formDataFile.append('image', file);
                              setUploadingImage(true);
                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                                  method: "POST",
                                  body: formDataFile
                                });
                                if (res.ok) {
                                  const imagePath = await res.text();
                                  setTestiForm({ ...testiForm, image: `${process.env.NEXT_PUBLIC_API_URL}${imagePath}` });
                                } else {
                                  showToast("Image upload failed.", "error");
                                }
                              } catch (error) {
                                console.error(error);
                                showToast("Image upload failed.", "error");
                              } finally {
                                setUploadingImage(false);
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="testi-image-file"
                            className="bg-velvet-400 border border-luxePink-500 hover:bg-luxePink-500/20 text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
                          >
                            <i className="fa-solid fa-upload mr-2"></i> Choose File
                          </label>
                          {uploadingImage && <span className="text-luxePink-500 text-sm animate-pulse">Uploading...</span>}
                        </div>
                        {testiForm.image && testiForm.image.startsWith(`${process.env.NEXT_PUBLIC_API_URL}`) && (
                          <div className="mt-2 text-green-400 text-xs">
                            <i className="fa-solid fa-check mr-1"></i> Uploaded successfully!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Review / Quote</label>
                    <textarea
                      required
                      value={testiForm.quote}
                      onChange={e => setTestiForm({ ...testiForm, quote: e.target.value })}
                      className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors h-24"
                      placeholder="Amazing experience..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-luxePink-600 hover:bg-luxePink-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    Save Testimonial
                  </button>
                </div>
              </form>
            </div>
          )}

          {showAddForm && activeTab === "banners" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6 border-b border-luxePink-500/20 pb-4">
                <h3 className="text-xl font-cinzel font-bold text-white">{editingBannerId ? "Edit Hero Banner" : "Add New Hero Banner"}</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const url = editingBannerId
                      ? `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${editingBannerId}`
                      : `${process.env.NEXT_PUBLIC_API_URL}/api/banners`;
                    const method = editingBannerId ? "PUT" : "POST";

                    const res = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(bannerForm)
                    });
                    if (res.ok) {
                      setBannerForm({ title: "", desc: "", image: "", isActive: false });
                      setEditingBannerId(null);
                      setShowAddForm(false);
                      fetchBanners();
                      showToast(`Banner ${editingBannerId ? "updated" : "added"} successfully!`, "success");
                    } else {
                      showToast(`Failed to ${editingBannerId ? "update" : "add"} banner`, "error");
                    }
                  } catch (err) {
                    console.error(err);
                    showToast("Error saving banner", "error");
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="md:col-span-2 border border-luxePink-500/30 p-4 rounded-lg bg-velvet-600/50">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Banner Image</label>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="text-gray-400 text-xs mb-1 block">Option 1: Paste an Image URL</span>
                        <input
                          type="text"
                          value={bannerForm.image}
                          onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                          className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-xs uppercase font-bold">OR</span>
                        <div className="h-px bg-luxePink-500/20 flex-1"></div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs mb-1 block">Option 2: Upload from Computer</span>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            id="banner-image-file"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formDataFile = new FormData();
                              formDataFile.append('image', file);
                              setUploadingImage(true);
                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                                  method: "POST",
                                  body: formDataFile
                                });
                                if (res.ok) {
                                  const imagePath = await res.text();
                                  setBannerForm({ ...bannerForm, image: `${process.env.NEXT_PUBLIC_API_URL}${imagePath}` });
                                } else {
                                  showToast("Image upload failed.", "error");
                                }
                              } catch (error) {
                                console.error(error);
                                showToast("Image upload failed.", "error");
                              } finally {
                                setUploadingImage(false);
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="banner-image-file"
                            className="bg-velvet-400 border border-luxePink-500 hover:bg-luxePink-500/20 text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
                          >
                            <i className="fa-solid fa-upload mr-2"></i> Choose File
                          </label>
                          {uploadingImage && <span className="text-luxePink-500 text-sm animate-pulse">Uploading...</span>}
                        </div>
                        {bannerForm.image && bannerForm.image.startsWith(`${process.env.NEXT_PUBLIC_API_URL}`) && (
                          <div className="mt-2 text-green-400 text-xs">
                            <i className="fa-solid fa-check mr-1"></i> Uploaded successfully!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={bannerForm.isActive}
                      onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-luxePink-600 focus:ring-luxePink-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Set as Active Banner (Will show on homepage slider)</label>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-luxePink-600 hover:bg-luxePink-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    {editingBannerId ? "Update Banner" : "Save Banner"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {showAddForm && activeTab === "products" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-6 border-b border-luxePink-500/20 pb-4">
                <h3 className="text-xl font-cinzel font-bold text-white">{editingProductId ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    let discountNum = 0;
                    if (formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)) {
                      discountNum = Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100);
                    }
                    const payload = {
                      ...formData,
                      price: Number(formData.price),
                      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                      discount: discountNum,
                      stock: Number(formData.stock),
                      additionalImages: formData.additionalImages
                    };
                    const url = editingProductId
                      ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProductId}`
                      : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
                    const method = editingProductId ? "PUT" : "POST";

                    const res = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                      setFormData({ title: "", category: "", price: "", originalPrice: "", discount: "", desc: "", image: "", additionalImages: [], tag: "New Arrival", stock: "", size: "" });
                      setEditingProductId(null);
                      setShowAddForm(false);
                      fetchProducts();
                      showToast(`Product ${editingProductId ? "updated" : "added"} successfully!`, "success");
                    } else {
                      showToast(`Failed to ${editingProductId ? "update" : "add"} product`, "error");
                    }
                  } catch (err) {
                    console.error(err);
                    showToast("Error adding product", "error");
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Product Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g., Royal Rose Gold Watch" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors">
                      <option value="">Select a Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {formData.category.toLowerCase() === 'dildo' && (
                    <div>
                      <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Size Selection</label>
                      <select required value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors">
                        <option value="">Select a Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Current Price (₹)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="2500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Original Price (₹)</label>
                    <input type="number" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="3000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Available Stock</label>
                    <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="10" />
                  </div>
                  <div className="md:col-span-2 border border-luxePink-500/30 p-4 rounded-lg bg-velvet-600/50">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Image Setup</label>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="text-gray-400 text-xs mb-1 block">Option 1: Paste an Image URL</span>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-xs uppercase font-bold">OR</span>
                        <div className="h-px bg-luxePink-500/20 flex-1"></div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs mb-1 block">Option 2: Upload from Computer</span>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            id="image-file"
                            onChange={uploadFileHandler}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-file"
                            className="bg-velvet-400 border border-luxePink-500 hover:bg-luxePink-500/20 text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
                          >
                            <i className="fa-solid fa-upload mr-2"></i> Choose File
                          </label>
                          {uploadingImage && <span className="text-luxePink-500 text-sm animate-pulse">Uploading...</span>}
                        </div>
                        {formData.image && formData.image.startsWith(`${process.env.NEXT_PUBLIC_API_URL}`) && (
                          <div className="mt-2 text-green-400 text-xs">
                            <i className="fa-solid fa-check mr-1"></i> Uploaded successfully!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 border border-luxePink-500/30 p-4 rounded-lg bg-velvet-600/50 mt-4">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Additional Images (Optional Gallery)</label>
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            id="additional-images-file"
                            multiple
                            onChange={uploadMultipleFilesHandler}
                            className="hidden"
                          />
                          <label
                            htmlFor="additional-images-file"
                            className="bg-velvet-400 border border-luxePink-500 hover:bg-luxePink-500/20 text-white px-6 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
                          >
                            <i className="fa-solid fa-images mr-2"></i> Choose Multiple Files
                          </label>
                          {uploadingImage && <span className="text-luxePink-500 text-sm animate-pulse">Uploading...</span>}
                        </div>
                        {formData.additionalImages.length > 0 && (
                          <div className="mt-4 grid grid-cols-4 gap-4">
                            {formData.additionalImages.map((img, idx) => (
                              <div key={idx} className="relative group rounded-md overflow-hidden border border-luxePink-500/30 aspect-square">
                                <img src={img} alt={`Additional ${idx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      additionalImages: prev.additionalImages.filter((_, i) => i !== idx)
                                    }));
                                  }}
                                  className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <i className="fa-solid fa-times"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea required value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors h-32" placeholder="Product details..."></textarea>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-luxePink-600 hover:bg-luxePink-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    {editingProductId ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Product Detail Modal */}
          {selectedProduct && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
              <div className="bg-velvet-400 border border-luxePink-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_30px_rgba(236,72,153,0.2)] flex flex-col md:flex-row relative">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full transition-colors">
                  <i className="fa-solid fa-times"></i>
                </button>
                <div className="md:w-1/2 h-64 md:h-auto bg-[#0a0a0a]">
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <span className="text-xs text-luxePink-500 font-bold uppercase tracking-widest mb-2 block">{selectedProduct.category}</span>
                  <h3 className="text-3xl font-cinzel text-white mb-4">{selectedProduct.title}</h3>
                  <div className="flex gap-4 mb-6 text-sm">
                    <span className="bg-luxePink-500/10 text-luxePink-400 border border-luxePink-500/30 px-3 py-1 rounded-full font-semibold text-xs tracking-wider">{selectedProduct.tag}</span>
                    <span className="bg-velvet-300 text-gray-300 border border-velvet-200 px-3 py-1 rounded-full font-semibold border-luxePink-500/30 text-xs tracking-wider">Stock: {selectedProduct.stock}</span>
                  </div>
                  <p className="text-gray-400 mb-8 leading-relaxed font-light">{selectedProduct.desc}</p>
                  <div className="flex items-end gap-4 border-t border-luxePink-500/20 pt-6">
                    <span className="text-3xl font-bold text-white tracking-wider">₹{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-lg text-gray-500 line-through mb-1">₹{selectedProduct.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Delivery Status & Message Modal */}
          {statusModal && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex justify-center items-center p-4 animate-fade-in">
              <div className="bg-velvet-300 border border-luxePink-500/20 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(236,72,153,0.15)] overflow-hidden relative luxury-transition">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#831843] to-[#db2777] px-6 py-4 flex justify-between items-center">
                  <h3 className="font-cinzel text-white text-lg font-bold tracking-wide">Update Order Status</h3>
                  <button
                    onClick={() => {
                      setStatusModal(null);
                      fetchOrders(); // Reverts dropdown selection
                    }}
                    className="text-white/80 hover:text-white transition-colors w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div className="bg-velvet-400 p-3 rounded-lg border border-luxePink-500/10">
                    <span className="text-[10px] text-luxePink-500 font-bold uppercase tracking-widest block mb-1">New Target Status</span>
                    <span className="text-white text-sm font-semibold tracking-wide flex items-center gap-2">
                      <i className="fa-solid fa-circle-info text-luxePink-400 text-xs"></i>
                      {statusModal.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Custom Message / Note to Customer <span className="text-gray-600 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-[#131118] border border-[#2a2635] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors placeholder:text-gray-600 resize-none"
                      placeholder="e.g. Your luxury vault is now packaged and dispatched with our private, armored dispatch courier. A tracking link will be sent separately."
                    />
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                      This note will be included directly in the premium HTML status update email sent automatically to the customer.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-[#131118] px-6 py-4 flex gap-4 justify-end border-t border-velvet-200">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusModal(null);
                      fetchOrders(); // Reverts dropdown selection
                    }}
                    className="bg-[#2a2635] hover:bg-[#383344] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={async () => {
                      setIsUpdatingStatus(true);
                      await updateDeliveryStatus(statusModal.orderId, statusModal.status, statusMessage);
                      setStatusModal(null);
                      setIsUpdatingStatus(false);
                    }}
                    className="bg-luxePink-600 hover:bg-luxePink-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2"
                  >
                    {isUpdatingStatus ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane text-[10px]"></i> Update & Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "users" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-4 sm:p-8 min-h-[500px] shadow-2xl relative animate-fade-in">
              <h4 className="font-cinzel text-white text-lg border-b border-luxePink-500/20 pb-4 mb-6">Registered Users</h4>
              {usersList.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No registered users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs text-luxePink-500 uppercase bg-velvet-500 border-b border-luxePink-500/20">
                      <tr>
                        <th className="px-6 py-4 font-semibold tracking-wider">User Details</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Contact Number</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Orders / Wishlist</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Address History</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map(u => (
                        <tr key={u._id} className="bg-velvet-400 border-b border-luxePink-500/10 hover:bg-velvet-300 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-white font-semibold">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </td>
                          <td className="px-6 py-4 text-white font-medium">
                            {u.phone || <span className="text-gray-600 text-xs italic">No orders yet</span>}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.isVerified 
                                ? "bg-green-500/10 text-green-400 border border-green-500/25"
                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25"
                            }`}>
                              {u.isVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            <div>Orders: <strong className="text-white font-bold">{u.ordersCount}</strong></div>
                            <div className="text-xs">Wishlist: <strong className="text-white font-semibold">{u.wishlistCount} items</strong></div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-300 max-w-xs truncate" title={u.lastAddress}>
                            {u.lastAddress || <span className="text-gray-600 italic">No address listed</span>}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
