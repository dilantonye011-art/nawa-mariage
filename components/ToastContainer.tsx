"use client";
import { useState, useEffect } from "react";
import { X, Heart, MessageCircle, CheckCircle, Info, AlertCircle } from "lucide-react";
import type { ToastType } from "@/types";

const configs: Record<ToastType, { icon: React.ReactNode; bg: string }> = {
  success: { icon: <CheckCircle className="w-4 h-4 text-green-500" />, bg: "bg-green-50 dark:bg-green-900/20 border-green-200" },
  info: { icon: <Info className="w-4 h-4 text-blue-500" />, bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200" },
  like: { icon: <Heart className="w-4 h-4 text-red-500 fill-red-500" />, bg: "bg-red-50 dark:bg-red-900/20 border-red-200" },
  match: { icon: <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />, bg: "bg-pink-50 dark:bg-pink-900/20 border-pink-200" },
  message: { icon: <MessageCircle className="w-4 h-4 text-primary-500" />, bg: "bg-primary-50 dark:bg-primary-900/20 border-primary-200" },
  error: { icon: <AlertCircle className="w-4 h-4 text-red-500" />, bg: "bg-red-50 dark:bg-red-900/20 border-red-200" },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: string; type: ToastType; message: string }[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type: e.detail.type, message: e.detail.message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("nawa-toast", handler);
      return () => window.removeEventListener("nawa-toast", handler);
    }
  }, []);

  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-md mx-auto">
      {toasts.map((toast) => {
        const c = configs[toast.type];
        return (
          <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${c.bg}`}>
            {c.icon}
            <p className="flex-1 text-sm text-gray-800 dark:text-gray-200">{toast.message}</p>
            <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} className="p-1 hover:bg-black/10 rounded-lg"><X className="w-3.5 h-3.5 text-gray-500" /></button>
          </div>
        );
      })}
    </div>
  );
}
