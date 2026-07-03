"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Heart, MessageCircle, MapPin, Calendar, ClipboardList, Check, ChevronRight, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { VerificationBadge } from "@/components/VerificationBadge";
import { VerificationModal } from "@/components/VerificationModal";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Photo } from "@/hooks/useProfilePhotos";
import { useCompatibility } from "@/hooks/useCompatibility";

export default function ProfilePage() {
  const { user, loading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { hasCompleted } = useCompatibility(user?.id);

  useEffect(() => {
    if (mounted && !loading && !user) router.push("/login/");
  }, [mounted, loading, user, router]);

  if (!mounted || loading) {
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

  const handleLogout = () => { logout(); router.push("/"); };
  const refreshPhotos = () => setRefreshKey(k => k + 1);

  const normalizedPhotos: Photo[] = user.photos?.map((p: any, i: number) => 
    typeof p === "string" 
      ? { url: p, deleteUrl: "", isMain: i === 0, uploadedAt: new Date().toISOString() }
      : p
  ) || [];

  const getVerificationAction = () => {
    switch (user.verificationStatus) {
      case "verified":
        return { text: "Profil vérifié", disabled: true, color: "text-emerald-600" };
      case "pending":
        return { text: "En cours d'examen", disabled: true, color: "text-amber-600" };
      default:
        return { text: "Vérifier mon identité", disabled: false, color: "text-primary-600" };
    }
  };

  const verificationAction = getVerificationAction();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/discover/" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition">
            <ArrowLeft className="w-5 h-5" /><span className="text-sm font-medium">Retour</span>
          </Link>
          <h1 className="font-bold text-gray-900 dark:text-white">Mon profil</h1>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* GALERIE PHOTOS */}
        <PhotoGallery 
          key={refreshKey}
          userId={user.id} 
          photos={normalizedPhotos} 
          onPhotosChange={refreshPhotos} 
        />

        {/* INFORMATIONS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Informations</h2>
            <VerificationBadge status={user.verificationStatus} size="md" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Heart className="w-4 h-4 text-primary-500" />
              <span>{user.name}, {user.age} ans</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span>{user.city}, {user.country}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
            {user.bio && (
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 text-sm">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* QUESTIONNAIRE */}
        <Link href="/questionnaire/" className={`flex items-center gap-3 p-4 rounded-xl border transition ${hasCompleted ? "border-green-500/30 bg-green-500/10" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasCompleted ? "bg-green-500/20" : "bg-primary-600/20"}`}>
            {hasCompleted ? <Check className="w-5 h-5 text-green-500" /> : <ClipboardList className="w-5 h-5 text-primary-500" />}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">{hasCompleted ? "Questionnaire complété" : "Questionnaire de compatibilité"}</h3>
            <p className="text-sm text-gray-400">{hasCompleted ? "Vos réponses améliorent vos matchs" : "20 questions pour trouver votre âme sœur"}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Link>

        {/* VÉRIFICATION D'IDENTITÉ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                user.verificationStatus === "verified" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                user.verificationStatus === "pending" ? "bg-amber-100 dark:bg-amber-900/30" :
                "bg-gray-100 dark:bg-gray-700"
              }`}>
                <Shield className={`w-5 h-5 ${
                  user.verificationStatus === "verified" ? "text-emerald-600" :
                  user.verificationStatus === "pending" ? "text-amber-600" :
                  "text-gray-500"
                }`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Vérification d'identité</h3>
                <p className={`text-sm ${verificationAction.color}`}>
                  {user.verificationStatus === "verified" ? "Votre identité est vérifiée" :
                   user.verificationStatus === "pending" ? "Votre demande est en cours d'examen (24-48h)" :
                   "Vérifiez votre identité pour plus de confiance"}
                </p>
              </div>
            </div>
            {!verificationAction.disabled && (
              <button 
                onClick={() => setShowVerificationModal(true)} 
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition"
              >
                {verificationAction.text}
              </button>
            )}
          </div>
          
          {user.verificationStatus === "verified" && (
            <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Votre badge vérifié est visible sur votre profil et vos matchs.
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/discover/" className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-primary-300 transition">
            <Heart className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">Découvrir</span>
          </Link>
          <Link href="/messages/" className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-primary-300 transition">
            <MessageCircle className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">Messages</span>
          </Link>
        </div>
      </div>

      {/* MODAL VÉRIFICATION */}
      <VerificationModal
        userId={user.id}
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        currentStatus={user.verificationStatus}
      />
    </div>
  );
}
