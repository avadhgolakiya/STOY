"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context/AppContext";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, wishlist, toggleWishlist, addToCart, logout } = useAppContext();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          logout();
          router.push('/auth');
          return;
        }

        // Fetch Orders
        try {
          const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const ordersData = await ordersRes.json();
          if (ordersRes.ok) {
            setOrders(ordersData);
          }
        } catch (err) {
          console.error("Failed to fetch orders", err);
        }

        // Fetch Products
        try {
          const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
          if (prodRes.ok) {
            setProducts(await prodRes.json());
          }
        } catch (err) {
          console.error("Failed to fetch products", err);
        }

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-velvet-400 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-luxePink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const favoriteProducts = products.filter(p => (wishlist as any[]).includes(p._id || p.id));

  const handleDownloadInvoice = (order: any) => {
    let parsedItems = [];
    try {
      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch(e) {}

    const itemsHtml = parsedItems.map((item: any) => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const invoiceHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; margin: 0; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; color: #555; }
            .top-bar { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #db2777; padding-bottom: 20px; }
            .brand { font-size: 32px; font-weight: bold; color: #db2777; font-family: cursive; font-style: italic; }
            .details { text-align: right; }
            table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 40px; }
            .total-row { font-weight: bold; font-size: 18px; color: #db2777; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="top-bar">
              <div>
                <div class="brand">Adult store</div>
                <div>Exclusive Velvet & Pink Atelier</div>
              </div>
              <div class="details">
                <div><strong>Invoice #:</strong> ${order._id.substring(0, 8).toUpperCase()}</div>
                <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
                <div><strong>Payment:</strong> Razorpay Online</div>
              </div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <strong>Billed To:</strong><br>
              ${order.customerName}<br>
              ${order.customerEmail}
            </div>

            <table>
              <tr style="background: #f8f8f8; font-weight: bold;">
                <td style="padding: 15px;">Item</td>
                <td style="padding: 15px; text-align: center;">Qty</td>
                <td style="padding: 15px; text-align: right;">Price</td>
                <td style="padding: 15px; text-align: right;">Total</td>
              </tr>
              ${itemsHtml}
              <tr>
                <td colspan="3" style="padding: 15px; text-align: right;"><strong>Delivery Fee</strong></td>
                <td style="padding: 15px; text-align: right;">₹${order.deliveryFee}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #eee;"><strong>Grand Total</strong></td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #eee;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </table>

            <div style="text-align: center; color: #888; margin-top: 50px; font-size: 14px;">
              Thank you for your exclusive purchase at Adult store.<br>
              For any support, please contact concierge@adultstore.com
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-velvet-400 pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto">

        {/* Account Details */}
        <div className="mb-16">
          <div className="flex justify-between items-end border-b border-luxePink-500/20 pb-4 mb-8">
            <h2 className="text-2xl font-cinzel text-white">
              My Profile
            </h2>
            <button 
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="text-xs uppercase tracking-widest text-luxePink-500 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>Log Out
            </button>
          </div>
          <div className="bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 bg-velvet-400 rounded-full flex items-center justify-center text-luxePink-500 text-3xl font-cinzel border border-luxePink-500/20 shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl text-white font-cinzel font-semibold">{user?.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
              <p className="text-xs text-luxePink-500/80 uppercase tracking-widest mt-4">Exclusive Member</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-cinzel text-white border-b border-luxePink-500/20 pb-4 mb-8">
            Your Luxury Wishlist
          </h2>
          
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-20 bg-velvet-300/50 rounded-2xl border border-luxePink-500/10">
              <i className="fa-regular fa-heart text-5xl text-luxePink-500/20 mb-4 block"></i>
              <p className="text-gray-400 tracking-widest uppercase text-sm mb-6">Your private vault is currently empty</p>
              <Link 
                href="/#new-arrivals" 
                className="inline-block bg-luxePink-500 text-white px-8 py-3 rounded uppercase tracking-widest text-xs font-bold hover:bg-luxePink-400 transition"
              >
                Discover Masterpieces
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {favoriteProducts.map((p) => {
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
                    key={p._id || p.id}
                    onClick={() => router.push(`/product/${p._id || p.id}`)}
                    className="cursor-pointer luxury-card-shadow bg-velvet-300 border border-luxePink-500/10 rounded-2xl overflow-hidden relative group transition-all duration-300"
                  >
                    <div className="relative h-72 overflow-hidden bg-velvet-200 luxury-scale-hover">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:brightness-75 luxury-transition"
                      />
                      <span className="absolute top-4 left-4 bg-velvet-400/90 backdrop-blur-sm border border-luxePink-500/30 text-luxePink-500 text-[8px] font-extrabold tracking-[0.2em] px-3 py-1 rounded">
                        {p.tag}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-velvet-400 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-velvet-400/50 backdrop-blur-sm">
                        <Link
                          href={`/product/${p._id || p.id}`}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist((p._id || p.id) as any);
                          }}
                          className={`w-12 h-12 rounded-full border border-luxePink-500 flex items-center justify-center luxury-transition pink-border-glow transform scale-90 hover:scale-105 ${
                            (wishlist as any[]).includes(p._id || p.id)
                              ? "bg-luxePink-500 text-white"
                              : "bg-velvet-400 text-luxePink-500 hover:bg-luxePink-500 hover:text-velvet-400"
                          }`}
                        >
                          <i className={`${(wishlist as any[]).includes(p._id || p.id) ? "fa-solid" : "fa-regular"} fa-heart text-sm`}></i>
                        </button>
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
                      <div className="flex justify-between items-end pt-4 border-t border-luxePink-500/10">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 line-through">
                              {formattedOriginalPrice}
                            </span>
                            <span className="text-[9px] text-luxePink-400 font-bold bg-luxePink-950/50 px-1.5 py-0.5 rounded border border-luxePink-500/10">
                              {p.discount}% OFF
                            </span>
                          </div>
                          <span className="text-luxePink-500 font-extrabold text-base block text-glow-pink">
                            {formattedPrice}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p);
                          }}
                          className="w-8 h-8 bg-luxePink-600 hover:bg-luxePink-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg shadow-luxePink-500/20 mb-1"
                        >
                          <i className="fa-solid fa-shopping-bag text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="mt-20">
          <h2 className="text-2xl font-cinzel text-white border-b border-luxePink-500/20 pb-4 mb-8">
            Order History
          </h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-velvet-300/50 rounded-2xl border border-luxePink-500/10">
              <i className="fa-solid fa-box-open text-5xl text-luxePink-500/20 mb-4 block"></i>
              <p className="text-gray-400 tracking-widest uppercase text-sm mb-6">No previous orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                let items = [];
                try {
                  items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                } catch(e) {}
                
                return (
                  <div key={order._id} className="bg-velvet-300 border border-luxePink-500/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-luxePink-500/10 pb-4 mb-4 gap-4">
                      <div>
                        <h3 className="text-white font-cinzel font-semibold text-lg">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                        <p className="text-gray-400 text-xs tracking-wider mb-2">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                          order.deliveryStatus === 'Cancelled'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : order.deliveryStatus === 'Delivered'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {order.deliveryStatus || 'Not Confirmed yet'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-luxePink-400 font-bold text-lg">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${order.paymentMethod === 'razorpay' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-luxePink-500/10 text-luxePink-400 border border-luxePink-500/20'}`}>
                          {order.paymentMethod === 'razorpay' ? 'Online Paid' : 'Cash on Delivery'}
                        </span>
                        
                        {order.paymentMethod === 'razorpay' && (
                          <button 
                            onClick={() => handleDownloadInvoice(order)}
                            className="text-[10px] uppercase tracking-widest bg-velvet-400 border border-luxePink-500/30 hover:border-luxePink-500 hover:bg-luxePink-500/10 text-luxePink-500 font-bold px-4 py-2 rounded transition whitespace-nowrap"
                          >
                            <i className="fa-solid fa-file-invoice mr-2"></i>Invoice
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex overflow-x-auto pb-2 gap-4 snap-x custom-scrollbar">
                      {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex-shrink-0 w-64 bg-velvet-400/50 rounded-lg border border-luxePink-500/5 p-3 flex gap-3 items-center snap-start">
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                            <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
