"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";

export default function AddressPage() {
  const router = useRouter();
  const { setShippingAddress, cart, showToast } = useAppContext();
  
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    flatNo: "",
    street: "",
    landmark: "",
    pinCode: "",
    city: "",
    state: "",
  });

  const [couponCode, setCouponCode] = useState("");

  if (cart.length === 0) {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.firstName || !address.lastName || !address.mobileNumber || !address.email || !address.flatNo || !address.pinCode || !address.city || !address.state) {
      showToast("Please fill out all mandatory fields", "error");
      return;
    }
    setShippingAddress(address);
    router.push("/checkout/payment");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginalPrice = cart.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const discount = totalOriginalPrice > subtotal ? totalOriginalPrice - subtotal : 0;

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-[#131118] text-gray-300 font-sans pb-20 pt-16">
      {/* Header */}
      <div className="bg-[#1a1820] border-b border-[#2a2635] pt-12 pb-6 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-extrabold text-white tracking-widest uppercase mb-4">Checkout</h1>
          <div className="flex items-center text-xs font-bold tracking-widest text-gray-500 gap-2">
            <span className="flex items-center text-[#00d084] gap-1"><i className="fa-solid fa-circle-check"></i> CART</span>
            <span><i className="fa-solid fa-chevron-right text-[8px]"></i></span>
            <span className="flex items-center text-luxePink-500 gap-1"><span className="w-4 h-4 bg-luxePink-500 text-white rounded-full flex items-center justify-center text-[10px]">2</span> DETAILS</span>
            <span><i className="fa-solid fa-chevron-right text-[8px]"></i></span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 bg-[#2a2635] text-white rounded-full flex items-center justify-center text-[10px]">3</span> PAYMENT</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Forms) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div>
              <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Personal Information</h2>
              <div className="bg-[#1e1c24] border border-[#2a2635] rounded-xl p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">First Name *</label>
                    <input type="text" name="firstName" required value={address.firstName} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g. Rahul" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name *</label>
                    <input type="text" name="lastName" required value={address.lastName} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g. Sharma" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number *</label>
                    <input type="tel" name="mobileNumber" required value={address.mobileNumber} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="10-digit number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email *</label>
                    <input type="email" name="email" required value={address.email} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="your@email.com" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">Delivery Address</h2>
              <div className="bg-[#1e1c24] border border-[#2a2635] rounded-xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Flat No. / Building Name *</label>
                  <input type="text" name="flatNo" required value={address.flatNo} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g. Flat 4B, Sunrise Apartments" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Street / Area / Locality</label>
                  <input type="text" name="street" value={address.street} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g. Vasant Vihar, Street no. 3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Landmark *</label>
                  <input type="text" name="landmark" required value={address.landmark} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="Near any famous shop / temple / bank" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pin Code *</label>
                    <input type="text" name="pinCode" required value={address.pinCode} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="6-digit code" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">City *</label>
                    <input type="text" name="city" required value={address.city} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors" placeholder="e.g. Delhi" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">State *</label>
                    <div className="relative">
                      <select name="state" required value={address.state} onChange={handleChange} className="w-full bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors appearance-none">
                        <option value="" disabled>Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Other">Other</option>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-xs text-gray-500 pointer-events-none"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Discount Coupon */}
            <div>
              <div className="bg-[#1e1c24] border border-[#2a2635] rounded-xl p-6">
                <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-tag text-yellow-500"></i> Discount Coupon
                </h2>
                <div className="flex gap-4">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 bg-[#131118] border border-[#2a2635] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-luxePink-500 transition-colors uppercase" placeholder="Enter coupon code" />
                  <button type="button" className="bg-[#2a2635] hover:bg-[#383344] text-white font-bold px-6 rounded-lg text-sm transition-colors">APPLY</button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Order Summary) */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e1c24] border border-[#2a2635] rounded-xl p-6 sticky top-24">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase mb-1">Order Summary</h2>
              <p className="text-xs text-gray-400 mb-6">{cart.length} item{cart.length > 1 ? 's' : ''}</p>
              
              <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-md object-cover border border-[#2a2635]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-semibold truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity} · {formattedPrice(item.price)} each</p>
                    </div>
                    <p className="text-xs font-bold text-white">{formattedPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-gray-400 border-t border-[#2a2635] pt-6 mb-6">
                <div className="flex justify-between">
                  <span>MRP Total</span>
                  <span className="text-white">{formattedPrice(totalOriginalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-luxePink-500">
                    <span>Discount on MRP</span>
                    <span>-{formattedPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formattedPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white">To be calculated</span>
                </div>
              </div>

              <div className="bg-[#2a2635]/50 border border-luxePink-500/20 rounded-lg p-3 flex gap-3 items-start mb-6">
                <i className="fa-solid fa-bolt text-luxePink-500 mt-0.5"></i>
                <p className="text-xs text-gray-300">Pay online at checkout & get <span className="text-luxePink-500 font-bold">FREE shipping</span></p>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold">To Pay</span>
                <span className="text-2xl text-white font-extrabold">{formattedPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="bg-[#00d084]/10 text-[#00d084] text-xs font-bold rounded-lg py-2 flex items-center justify-center gap-2 mb-6">
                  <i className="fa-solid fa-tag"></i> You save {formattedPrice(discount)} on this order
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-[#ff2e93] hover:bg-[#ff1482] text-white font-extrabold uppercase tracking-widest py-4 rounded-lg transition duration-300 shadow-[0_0_20px_rgba(255,46,147,0.3)] flex justify-center items-center mb-6"
              >
                CONTINUE <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px] text-gray-400">
                <div className="flex items-center gap-2"><i className="fa-solid fa-box text-luxePink-500"></i> Plain brown box</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-file-invoice text-luxePink-500"></i> Discreet billing</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-shield-halved text-luxePink-500"></i> 100% private</div>
                <div className="flex items-center gap-2"><i className="fa-solid fa-star text-luxePink-500"></i> Best quality</div>
              </div>

              <div className="mt-6 bg-[#00d084]/5 border border-[#00d084]/20 rounded-lg p-3 text-[10px] text-gray-400 leading-relaxed">
                <span className="text-[#00d084] font-bold"><i className="fa-solid fa-lock"></i> 100% Secure Checkout</span> — SSL encrypted. Your details are never shared. Tap to learn more.
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
