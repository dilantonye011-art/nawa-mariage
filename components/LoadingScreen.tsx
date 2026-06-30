"use client";
import { Heart } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
      <div className="relative">
        <Heart className="w-16 h-16 text-primary-600 animate-pulse" fill="currentColor" />
        <div className="absolute inset-0 w-16 h-16 bg-primary-600/30 rounded-full animate-ping"></div>
      </div>
      <p className="mt-6 text-gray-400 text-sm animate-pulse">Chargement de l'amour...</p>
    </div>
  );
}