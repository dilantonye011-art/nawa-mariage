"use client";

function getImageUrl(photo: string | { url?: string } | null | undefined): string {
  if (!photo) return "/default-avatar.svg";
  const url = typeof photo === "string" ? photo : photo?.url;
  if (!url) return "/default-avatar.svg";
  if (url.startsWith("data:")) return "/default-avatar.svg";
  if (url.startsWith("https://ibb.co/")) return url.replace("https://ibb.co/", "https://i.ibb.co/");
  return url;
}
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, X, MapPin, Star, SlidersHorizontal, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useDiscover } from "@/hooks/useDiscover";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { SearchFilters } from "@/components/SearchFilters";
import { VerificationBadge } from "@/components/VerificationBadge";
import { useToastContext } from "@/components/ToastProvider";

export default function DiscoverPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { success, error: toastError } = useToastContext();
  const [mounted, setMounted] = useState(false);
  
  const { filters, updateFilter, resetFilters, isOpen, togglePanel } = useSearchFilters();
  const { profiles, loading, error, refetch } = useDiscover(user?.id, filters);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) router.push("/login/");
  }, [mounted, authLoading, user, router]);

  // Réinitialiser l'index quand les filtres changent
  useEffect(() => {
    setCurrentIndex(0);
  }, [filters]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const currentProfile = profiles[currentIndex];
  const hasMore = currentIndex < profiles.length - 1;

  const handleLike = () => {
    if (!currentProfile) return;
    setDirection(1);
    setLikedProfiles((prev) => new Set(prev).add(currentProfile.id));
    success(`Vous avez aimé ${currentProfile.name} !`);
    setTimeout(() => {
      if (hasMore) setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handlePass = () => {
    setDirection(-1);
    setTimeout(() => {
      if (hasMore) setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;
    setDirection(1);
    success(`Super Like envoyé à ${currentProfile.name} ! ⭐`);
    setTimeout(() => {
      if (hasMore) setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handleRefresh = () => {
    setCurrentIndex(0);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/profile/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user.name?.[0]}</span>
            </div>
          </Link>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Découvrir</h1>
          <div className="flex items-center gap-2">
            <SearchFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              isOpen={isOpen}
              togglePanel={togglePanel}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-500">Recherche de profils...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={handleRefresh} className="px-6 py-3 bg-primary-600 text-white rounded-xl">
              Réessayer
            </button>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Aucun profil trouvé</h3>
            <p className="text-gray-500 mb-6">Essayez de modifier vos filtres de recherche</p>
            <button onClick={resetFilters} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium">
              Réinitialiser les filtres
            </button>
          </div>
        ) : !currentProfile ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Plus de profils !</h3>
            <p className="text-gray-500 mb-6">Vous avez vu tous les profils correspondant à vos critères</p>
            <button onClick={handleRefresh} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium">
              Recommencer
            </button>
          </div>
        ) : (
          <>
            {/* Carte profil */}
            <div className="relative h-[500px] mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProfile.id}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700"
                >
                  {/* Photo */}
                  <div className="relative h-3/5">
                    <Image
                      src={currentProfile.photos?.find(p => p.isMain)?.url || currentProfile.photos?.[0]?.url || "/default-avatar.png"}
                      alt={currentProfile.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge vérifié */}
                    {currentProfile.verificationStatus === "verified" && (
                      <div className="absolute top-4 right-4">
                        <VerificationBadge status="verified" size="sm" showLabel />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold text-white">{currentProfile.name}, {currentProfile.age}</h2>
                      {currentProfile.verificationStatus === "verified" && (
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-white/80 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{currentProfile.city}, {currentProfile.country}</span>
                    </div>
                    {currentProfile.bio && (
                      <p className="text-white/70 text-sm line-clamp-2">{currentProfile.bio}</p>
                    )}
                    
                    {/* Tags */}
                    <div className="flex gap-2 mt-3">
                      {currentProfile.religion && (
                        <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-lg backdrop-blur-sm">
                          {currentProfile.religion}
                        </span>
                      )}
                      {currentProfile.maritalStatus && (
                        <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-lg backdrop-blur-sm">
                          {currentProfile.maritalStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePass}
                className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
              
              <button
                onClick={handleSuperLike}
                className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition text-blue-500"
              >
                <Star className="w-5 h-5" fill="currentColor" />
              </button>
              
              <button
                onClick={handleLike}
                className="w-14 h-14 bg-primary-600 rounded-full shadow-lg shadow-primary-600/30 flex items-center justify-center hover:scale-110 transition text-white"
              >
                <Heart className="w-6 h-6" fill="currentColor" />
              </button>
            </div>

            {/* Compteur */}
            <p className="text-center text-sm text-gray-500 mt-4">
              {currentIndex + 1} / {profiles.length} profils
            </p>
          </>
        )}
      </div>
    </div>
  );
}




