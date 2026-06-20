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
    title: "", category: "", price: "", originalPrice: "", discount: "", desc: "", image: "", tag: "New Arrival"
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/categories");
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
      const res = await fetch("http://localhost:5001/api/testimonials");
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
      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formDataFile
      });
      if (res.ok) {
        const imagePath = await res.text();
        setFormData({ ...formData, image: `http://localhost:5001${imagePath}` });
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

  useEffect(() => {
    fetchCategories();
    fetchTestimonials();
    // Check if admin is logged in via token in localStorage
    const token = localStorage.getItem("adminToken");
    // For now, if there is no backend hooked up, we'll just show the dashboard for development
    // In production, we'd uncomment this redirect:
    // if (!token) {
    //   router.push("/admin/login");
    // }
  }, [router]);

  return (
    <div className="min-h-screen bg-velvet-500 text-white font-sans">
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-velvet-400 border-r border-luxePink-500/20 hidden md:flex flex-col">
          <div className="p-6 border-b border-luxePink-500/20">
            <h1 className="font-cinzel font-bold text-xl text-glow-pink text-white">
              ADUT STORE
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
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-luxePink-600 to-fuchsia-600 hover:from-luxePink-500 hover:to-fuchsia-500 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider luxury-transition shadow-[0_0_15px_rgba(236,72,153,0.3)]"
              >
                <i className="fa-solid fa-plus mr-2"></i> Add New
              </button>
            )}
          </header>

          {/* Content Area */}
          {!showAddForm && activeTab === "products" && (
            <div className="bg-velvet-400 border border-luxePink-500/20 rounded-2xl p-8 min-h-[500px] flex items-center justify-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-luxePink-500/10 blur-[100px] rounded-full pointer-events-none"></div>
               <div className="text-center z-10">
                  <i className="fa-solid fa-database text-6xl text-luxePink-500/40 mb-4 block"></i>
                  <h3 className="text-xl font-cinzel text-white mb-2">Awaiting Backend Connection</h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto">
                    Once your MongoDB Atlas IP is whitelisted and the backend is running, this area will populate with your live {activeTab}.
                  </p>
               </div>
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
                      const res = await fetch("http://localhost:5001/api/categories", {
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
                            await fetch(`http://localhost:5001/api/categories/${cat._id}`, { method: "DELETE" });
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
                                await fetch(`http://localhost:5001/api/testimonials/${t._id}`, { method: "DELETE" });
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
                    const res = await fetch("http://localhost:5001/api/testimonials", {
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
                                const res = await fetch("http://localhost:5001/api/upload", {
                                  method: "POST",
                                  body: formDataFile
                                });
                                if (res.ok) {
                                  const imagePath = await res.text();
                                  setTestiForm({ ...testiForm, image: `http://localhost:5001${imagePath}` });
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
                        {testiForm.image && testiForm.image.startsWith("http://localhost:5001") && (
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
                <h3 className="text-xl font-cinzel font-bold text-white">Add New Product</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Product Title</label>
                    <input type="text" className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g., Royal Rose Gold Watch" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Category</label>
                    <select className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors">
                      <option value="">Select a Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Current Price ($)</label>
                    <input type="number" className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="2500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Original Price ($)</label>
                    <input type="number" className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="3000" />
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
                        {formData.image && formData.image.startsWith("http://localhost:5001") && (
                          <div className="mt-2 text-green-400 text-xs">
                            <i className="fa-solid fa-check mr-1"></i> Uploaded successfully!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-luxePink-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea className="w-full bg-velvet-500 border border-luxePink-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-luxePink-500 transition-colors h-32" placeholder="Product details..."></textarea>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="button" className="bg-luxePink-600 hover:bg-luxePink-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
