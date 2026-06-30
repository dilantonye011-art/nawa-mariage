"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Shield, LogOut, Heart, MessageCircle, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { VerificationBadge } from "@/components/VerificationBadge";

export default function ProfilePage() {
  const { user, loading, updateUser, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⭐ Redirection SEULEMENT après que le chargement soit terminé
  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/login/");
    }
  }, [mounted, loading, user, router]);

  // ⭐ Afficher un loader pendant le chargement de l'authentification
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

  // ⭐ Si pas connecté après le chargement, ne rien afficher (la redirection gère ça)
  if (!user) {
    return null;
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || user.photos.length >= 6) return;
    
    if (file.size > 500 * 1024) {
      alert("L'image est trop grande. Maximum 500KB.");
      return;
    }
    
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => { 
      updateUser({ photos: [...user.photos, reader.result as string] }); 
      setUploading(false); 
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => updateUser({ photos: user.photos.filter((_, i) => i !== index) });
  
  const requestVerification = () => { 
    updateUser({ verificationStatus: "pending" }); 
    setShowVerificationModal(false); 
  };
  
  const handleLogout = () => { 
    logout(); 
    router.push("/"); 
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/discover/" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <h1 className="font-bold text-gray-900 dark:text-white">Mon profil</h1>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Photos ({user.photos.length}/6)</h2>
          <div className="grid grid-cols-3 gap-3">
            {user.photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(i)} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {user.photos.length < 6 && (
              <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 hover:border-primary-400 transition">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400">{uploading ? "..." : "Ajouter"}</span>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Verification</h3>
                <p className="text-sm text-gray-500">
                  {user.verificationStatus === "verified" ? "Profil verifie" : user.verificationStatus === "pending" ? "En cours" : "Non verifie"}
                </p>
              </div>
            </div>
            {user.verificationStatus === "none" && (
              <button onClick={() => setShowVerificationModal(true)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition">
                Verifier
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/discover/" className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-primary-300 transition">
            <Heart className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">Decouvrir</span>
          </Link>
          <Link href="/messages/" className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 hover:border-primary-300 transition">
            <MessageCircle className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">Messages</span>
          </Link>
        </div>
      </div>
      {showVerificationModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
      <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="font-bold text-white text-xl mb-2 text-center">Demande de vérification</h3>
      <p className="text-gray-400 text-center mb-6">
        Votre demande sera examinée par notre équipe. Cela peut prendre 24 à 48 heures.
      </p>
      <div className="flex gap-3">
        <button 
          onClick={() => setShowVerificationModal(false)} 
          className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition"
        >
          Annuler
        </button>
        <button 
          onClick={requestVerification}
          className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}