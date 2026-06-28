"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setStatus("loading");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-velvet-400 via-velvet-300 to-velvet-400 flex flex-col items-center justify-center px-4 py-20">

      {/* Breadcrumb */}
      <div className="text-[10px] tracking-widest uppercase text-gray-500 mb-10 flex items-center gap-2">
        <Link href="/" className="hover:text-luxePink-400 transition">Home</Link>
        <span>/</span>
        <span className="text-luxePink-400">Contact Us</span>
      </div>

      <div className="w-full max-w-2xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="text-[10px] text-luxePink-500 tracking-[0.4em] uppercase block mb-3">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-cinzel text-white font-bold uppercase tracking-wide">
            Contact Us
          </h1>
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-luxePink-500 to-transparent mx-auto mt-4" />
          <p className="text-gray-400 text-xs mt-4 leading-relaxed">
            Have a question or need help? We're here for you. Fill in the form below and we'll get back to you shortly.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-velvet-300/60 border border-luxePink-500/15 rounded-2xl p-8 sm:p-10 backdrop-blur-sm shadow-2xl shadow-black/40">
          {status === "success" ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-luxePink-500/20 border border-luxePink-500/40 flex items-center justify-center mx-auto mb-5">
                <i className="fa-solid fa-check text-luxePink-400 text-2xl"></i>
              </div>
              <h2 className="text-white font-cinzel text-xl font-bold mb-2">Message Sent!</h2>
              <p className="text-gray-400 text-sm">We'll get back to you as soon as possible.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-luxePink-400 text-xs tracking-widest uppercase hover:text-luxePink-300 transition"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Name */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                  className="w-full bg-velvet-400/60 border border-luxePink-500/20 hover:border-luxePink-500/40 focus:border-luxePink-500 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-all duration-300"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 99999 99999"
                  required
                  className="w-full bg-velvet-400/60 border border-luxePink-500/20 hover:border-luxePink-500/40 focus:border-luxePink-500 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-all duration-300"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  required
                  rows={5}
                  className="w-full bg-velvet-400/60 border border-luxePink-500/20 hover:border-luxePink-500/40 focus:border-luxePink-500 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-all duration-300 resize-none"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full mt-2 bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-luxePink-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </span>
                ) : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Info row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-velvet-300/40 border border-luxePink-500/10 rounded-xl px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-luxePink-500/15 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-envelope text-luxePink-400 text-sm"></i>
            </div>
            <div>
              <p className="text-[9px] tracking-widest uppercase text-gray-500 mb-0.5">Email</p>
              <p className="text-xs text-white">avadhgolakiya88@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-velvet-300/40 border border-luxePink-500/10 rounded-xl px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-luxePink-500/15 flex items-center justify-center shrink-0">
              <i className="fa-brands fa-whatsapp text-luxePink-400 text-sm"></i>
            </div>
            <div>
              <p className="text-[9px] tracking-widest uppercase text-gray-500 mb-0.5">WhatsApp</p>
              <p className="text-xs text-white">Available 10am – 8pm IST</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
