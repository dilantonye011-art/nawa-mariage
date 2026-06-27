"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, MapPin, X, Search, Moon, Sun, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { VerificationBadge } from "@/components/VerificationBadge";
import type { User } from "@/types";

export default function DiscoverPage() {
  const { user } = useAuth();
  const { likeUser, hasLiked, isMatched } = useLikes(user?.id);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({ minAge: 18, maxAge: 60, gender: "" as "" | "male" | "female", city: "", verifiedOnly: false, sortBy: "recent" as "recent" | "age" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("nawa_dark_mode");
    if (saved) setDarkMode(saved === "true");
    const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
    const others = users.filter((u: User) => u.id !== user?.id);
    setProfiles(others); setFiltered(others);
  }, [user?.id]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("nawa_dark_mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    let result = [...profiles];
    if (filters.gender) result = result.filter((p) => p.gender === filters.gender);
    if (filters.city) result = result.filter((p) => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    result = result.filter((p) => p.age >= filters.minAge && p.age <= filters.maxAge);
    if (filters.verifiedOnly) result = result.filter((p) => p.verificationStatus === "verified");
    if (filters.sortBy === "age") result.sort((a, b) => a.age - b.age);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setFiltered(result);
  }, [filters, profiles]);

  const handleLike = (profileId: string) => {
    if (!user) return;
    const result = likeUser(profileId);
    if (result?.isMatch) alert("C est un match !");
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">Se connecter</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-gray-900 dark:text-white">Decouvrir</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"><SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">{darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-600" />}</button>
            <Link href="/profile/" className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-primary-600">{user.name?.[0]}</span></Link>
          </div>
        </div>
      </div>
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Filtres</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500 mb-1 block">Age min</label><input type="number" min={18} max={100} value={filters.minAge} onChange={(e) => setFilters((f) => ({ ...f, minAge: parseInt(e.target.value) || 18 }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Age max</label><input type="number" min={18} max={100} value={filters.maxAge} onChange={(e) => setFilters((f) => ({ ...f, maxAge: parseInt(e.target.value) || 60 }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500 mb-1 block">Genre</label><select value={filters.gender} onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value as any }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"><option value="">Tous</option><option value="male">Homme</option><option value="female">Femme</option></select></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Ville</label><input type="text" value={filters.city} onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))} placeholder="Rechercher..." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" /></div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => setFilters((f) => ({ ...f, verifiedOnly: e.target.checked }))} className="rounded border-gray-300" />Profils verifies uniquement</label>
              <select value={filters.sortBy} onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as any }))} className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"><option value="recent">Plus recents</option><option value="age">Age</option></select>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20"><Search className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">Aucun profil trouve</p><p className="text-sm text-gray-400 mt-1">Essayez d autres filtres</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((profile) => (
              <div key={profile.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 relative">
                  {profile.photos?.[0] ? <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-4xl font-serif text-gray-300">{profile.name?.[0]}</span></div>}
                  <div className="absolute top-3 right-3"><VerificationBadge status={profile.verificationStatus} size="md" /></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{profile.name}, {profile.age}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{profile.city}</p>
                  {profile.bio && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{profile.bio}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => handleLike(profile.id)} disabled={hasLiked(profile.id)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1 ${hasLiked(profile.id) ? "bg-red-100 dark:bg-red-900/30 text-red-600" : "bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100"}`}><Heart className={`w-4 h-4 ${hasLiked(profile.id) ? "fill-red-500" : ""}`} />{hasLiked(profile.id) ? "Aime" : "J aime"}</button>
                    {isMatched(profile.id) && <Link href="/messages/" className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1"><MessageCircle className="w-4 h-4" />Message</Link>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
