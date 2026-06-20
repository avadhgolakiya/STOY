"use client";

import { useAppContext } from "../context/AppContext";

export default function ToastContainer() {
  const { toasts } = useAppContext();

  return (
    <div
      id="toast-container"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => {
        let bgClass = "bg-velvet-300 border-luxePink-500 text-luxePink-500";
        let iconClass = "fa-circle-check";

        if (toast.type === "error") {
          bgClass = "bg-velvet-300 border-red-500 text-red-400";
          iconClass = "fa-triangle-exclamation";
        } else if (toast.type === "info") {
          bgClass = "bg-velvet-300 border-fuchsia-500 text-fuchsia-400";
          iconClass = "fa-circle-info";
        }

        return (
          <div
            key={toast.id}
            className={`${bgClass} border p-4 rounded-xl shadow-2xl flex items-center gap-3 pointer-events-auto transition-all duration-300 animate-slide-up`}
          >
            <i className={`fa-solid ${iconClass} text-base shrink-0`}></i>
            <p className="text-[11px] uppercase tracking-wider font-semibold">
              {toast.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
