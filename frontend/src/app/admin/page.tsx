"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testiForm, setTestiForm] = useState({ clientName: "", role: "Client", quote: "", rating: 5, image: "" });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "", category: "", price: "", originalPrice: "", discount: "", desc: "", image: "", additionalImages: [] as string[], tag: "New Arrival", stock: "", size: ""
  });
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

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

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders from API...");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { cache: 'no-store' });
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

  const updateDeliveryStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryStatus: status })
      });
      if (res.ok) {
        alert("Status updated and email notification sent!");
        fetchOrders();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
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
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
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
      alert("Some images failed to upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTestimonials();
    fetchProducts();
    fetchOrders();
    // Check if admin is logged in via token in localStorage
    const token = localStorage.getItem("adminToken");
    // For now, if there is no backend hooked up, we'll just show the dashboard for development
    // In production, we'd uncomment this redirect:
    // if (!token) {
    //   router.push("/admin/login");
    // }
  }, [router]);

  // Fetch specific data when tabs change to keep it fresh
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "categories") {
      fetchCategories();
    } else if (activeTab === "testimonials") {
      fetchTestimonials();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-velvet-500 text-white font-sans">
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-velvet-400 border-r border-luxePink-500/20 hidden md:flex flex-col">
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
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide ${activeTab === "orders" ? "bg-luxePink-500/20 text-luxePink-400 border border-luxePink-500/30" : "text-gray-400 hover:bg-velvet-300 hover:text-white"}`}
            >
              <i className="fa-solid fa-shopping-bag w-6"></i> Orders
            </button>
          </nav>
          
          <div className="p-4 border-t border-luxePink-500/20">
            <button 
              onClick={() => {
                localStorage.removeItem("adminToken");
                router.push("/");
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
              {activeTab === "products" && "Product Inventory"}
              {activeTab === "categories" && "Manage Categories"}
              {activeTab === "testimonials" && "Client Testimonials"}
              {activeTab === "banners" && "Hero Banners"}
              {activeTab === "orders" && "Recent Orders"}
            </h2>
            
            {activeTab !== "orders" && (
              <button 
                onClick={() => {
                  setFormData({ title: "", category: "", price: "", originalPrice: "", discount: "", desc: "", image: "", additionalImages: [], tag: "New Arrival", stock: "", size: "" });
                  setEditingProductId(null);
                  setShowAddForm(true);
                }}
                className="bg-gradient-to-r from-luxePink-600 to-fuchsia-600 hover:from-luxePink-500 hover:to-fuchsia-500 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider luxury-transition shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                <i className="fa-solid fa-plus mr-2"></i> Add New
              </button>
            )}
          </header>

          {/* Content Area */}
          {!showAddForm && activeTab === "orders" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 min-h-[500px] shadow-2xl relative">
              <h4 className="font-cinzel text-white text-lg border-b border-luxePink-500/20 pb-4 mb-6">Recent Orders</h4>
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
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider ${
                              order.paymentStatus === 'paid' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={order.deliveryStatus || 'Not Confirmed yet'} 
                              onChange={(e) => updateDeliveryStatus(order._id, e.target.value)}
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
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 min-h-[500px] shadow-2xl relative">
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
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 min-h-[500px] shadow-2xl relative">
              <div className="mb-8">
                <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Create New Category</label>
                <form 
                  className="flex gap-4"
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
                        alert("Failed to add category");
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
                    className="flex-1 bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" 
                    placeholder="e.g., Handbags" 
                  />
                  <button type="submit" className="bg-luxePink-600 hover:bg-luxePink-500 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
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
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 min-h-[500px] shadow-2xl relative">
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
                      alert("Failed to add testimonial");
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
                      onChange={e => setTestiForm({...testiForm, clientName: e.target.value})}
                      className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" 
                      placeholder="e.g., Alexander V." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Role / Designation</label>
                    <input 
                      type="text" 
                      value={testiForm.role}
                      onChange={e => setTestiForm({...testiForm, role: e.target.value})}
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
                      onChange={e => setTestiForm({...testiForm, rating: Number(e.target.value)})}
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
                          onChange={(e) => setTestiForm({...testiForm, image: e.target.value})}
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
                                  alert("Image upload failed.");
                                }
                              } catch (error) {
                                console.error(error);
                                alert("Image upload failed.");
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
                      onChange={e => setTestiForm({...testiForm, quote: e.target.value})}
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
                      alert(`Product ${editingProductId ? "updated" : "added"} successfully!`);
                    } else {
                      alert(`Failed to ${editingProductId ? "update" : "add"} product`);
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Error adding product");
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Product Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g., Royal Rose Gold Watch" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors">
                      <option value="">Select a Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {formData.category.toLowerCase() === 'dildo' && (
                    <div>
                      <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Size Selection</label>
                      <select required value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors">
                        <option value="">Select a Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Current Price (₹)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="2500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Original Price (₹)</label>
                    <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="3000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Available Stock</label>
                    <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="10" />
                  </div>
                  <div className="md:col-span-2 border border-luxePink-500/30 p-4 rounded-lg bg-velvet-600/50">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Image Setup</label>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="text-gray-400 text-xs mb-1 block">Option 1: Paste an Image URL</span>
                        <input 
                          type="text" 
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
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
                    <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors h-32" placeholder="Product details..."></textarea>
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
        </main>
      </div>
    </div>
  );
}
