"use client";
import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || localStorage.getItem("nawa_pwa_dismissed")) return;
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e); setShow(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setPrompt(null);
  };

  const dismiss = () => { setShow(false); localStorage.setItem("nawa_pwa_dismissed", "true"); };

  if (!show) return null;
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-primary-600 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Download className="w-5 h-5" /></div>
        <div className="flex-1"><p className="font-medium text-sm">Installer Nawa Mariage</p><p className="text-xs text-primary-200">Accedez depuis votre ecran d accueil</p></div>
        <button onClick={install} className="px-3 py-1.5 bg-white text-primary-600 text-xs font-medium rounded-lg">Installer</button>
        <button onClick={dismiss} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
