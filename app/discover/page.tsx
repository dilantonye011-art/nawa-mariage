"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, MessageCircle, MapPin, X, Search, Moon, Sun, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { VerificationBadge } from "@/components/VerificationBadge";
import { useMatching } from "@/hooks/useMatching";
import type { User } from "@/types";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, BellRing } from "lucide-react";


export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { likeUser, hasLiked, isMatched } = useLikes(user?.id);
  const { suggestions, loading: matchingLoading } = useMatching(user?.id);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({ 
    minAge: 18, maxAge: 60, 
    gender: "" as "" | "male" | "female", 
    city: "", verifiedOnly: false, 
    sortBy: "recent" as "recent" | "age" 
  });
  const { permission, requestPermission, unreadCount } = useNotifications(user?.id);


  // ⭐ CHARGER LES PROFILS VIA LE MATCHING INTELLIGENT
  useEffect(() => {
    if (!suggestions.length) return;
    const users = suggestions.map(s => s.user);
    setProfiles(users);
    setFiltered(users);
  }, [suggestions]);

  // ⭐ DARK MODE
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("nawa_dark_mode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("nawa_dark_mode", String(darkMode));
  }, [darkMode]);

  // ⭐ FILTRES
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

  // ⭐ LIKE AVEC MODAL MATCH
  const handleLike = async (profileId: string) => {
    if (!user) return;
    const result = await likeUser(profileId);
    
    if (result?.isMatch) {
      const matchedProfile = profiles.find(p => p.id === profileId);
      setMatchedUser(matchedProfile || null);
      setShowMatch(true);
    }
  };

  // ⭐ REDIRECTION SI PAS CONNECTÉ
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">Se connecter</Link>
    </div>
  );

  // ⭐ LOADING
  if (loading || matchingLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-gray-900 dark:text-white">Découvrir</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <Link href="/profile/" className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-600">{user.name?.[0]}</span>
            </Link>

            <button 
  onClick={requestPermission}
  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative"
>
  {permission === "granted" ? (
    <BellRing className="w-5 h-5 text-primary-500" />
  ) : (
    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
  )}
  {unreadCount > 0 && (
    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</button>

          </div>
        </div>
      </div>

      {/* FILTRES */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Filtres</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Âge min</label>
                <input type="number" min={18} max={100} value={filters.minAge} 
                  onChange={(e) => setFilters((f) => ({ ...f, minAge: parseInt(e.target.value) || 18 }))} 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Âge max</label>
                <input type="number" min={18} max={100} value={filters.maxAge} 
                  onChange={(e) => setFilters((f) => ({ ...f, maxAge: parseInt(e.target.value) || 60 }))} 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Genre</label>
                <select value={filters.gender} 
                  onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value as any }))} 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                  <option value="">Tous</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Ville</label>
                <input type="text" value={filters.city} 
                  onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))} 
                  placeholder="Rechercher..." 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={filters.verifiedOnly} 
                  onChange={(e) => setFilters((f) => ({ ...f, verifiedOnly: e.target.checked }))} 
                  className="rounded border-gray-300" />
                Profils vérifiés uniquement
              </label>
              <select value={filters.sortBy} 
                onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as any }))} 
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                <option value="recent">Plus récents</option>
                <option value="age">Âge</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* PROFILS */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Aucun profil trouvé</p>
            <p className="text-sm text-gray-400 mt-1">Revenez plus tard !</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((profile, index) => (
              <div key={profile.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                {/* Photo */}
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 relative">
                  {profile.photos?.[0] ? (
                    <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-300">{profile.name?.[0]}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <VerificationBadge status={profile.verificationStatus} size="md" />
                  </div>
                  {/* Score de compatibilité */}
                  {suggestions[index] && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary-600/80 backdrop-blur text-white text-xs rounded-full font-bold">
                      {suggestions[index].score}% match
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{profile.name}, {profile.age}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />{profile.city}, {profile.country}
                  </p>
                  {/* Raisons du matching */}
                  {suggestions[index] && suggestions[index].reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {suggestions[index].reasons.slice(0, 3).map((reason, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}
                  {profile.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{profile.bio}</p>
                  )}
                  {/* Boutons */}
                  <div className="flex gap-2">
                    <button onClick={() => handleLike(profile.id)} disabled={hasLiked(profile.id)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1 ${
                        hasLiked(profile.id) 
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600" 
                          : "bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100"
                      }`}>
                      <Heart className={`w-4 h-4 ${hasLiked(profile.id) ? "fill-red-500" : ""}`} />
                      {hasLiked(profile.id) ? "Aimé" : "J'aime"}
                    </button>
                    {isMatched(profile.id) && (
                      <Link href="/messages/" 
                        className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1">
                        <MessageCircle className="w-4 h-4" />Message
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MATCH MODAL */}
      {showMatch && matchedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center border border-primary-500/30 shadow-2xl animate-scale-in">
            <div className="w-20 h-20 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="w-10 h-10 text-primary-500" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">C'est un Match !</h2>
            <p className="text-gray-400 mb-6">
              Vous et {matchedUser.name} vous aimez mutuellement !
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMatch(false)}
                className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition"
              >
                Continuer
              </button>
              <button
                onClick={() => {
                  setShowMatch(false);
                  router.push("/messages/");
                }}
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition"
              >
                Envoyer un message
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}