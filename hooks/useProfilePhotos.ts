"use client";
import { useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { useToastContext } from "@/components/ToastProvider";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

export interface Photo {
  url: string;
  deleteUrl: string;
  isMain: boolean;
  uploadedAt: string;
}

export function useProfilePhotos(userId: string | undefined) {
  const { success, error: toastError } = useToastContext();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) return "Le fichier doit être une image (JPG, PNG, WebP, GIF).";
    if (file.size > 10 * 1024 * 1024) return "L'image est trop grande. Maximum 10 Mo.";
    return null;
  };

  const compressImage = async (file: File, maxWidth = 800, quality = 0.7): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            console.log("Compression: avant", (file.size / 1024 / 1024).toFixed(2), "MB -> après", (blob.size / 1024 / 1024).toFixed(2), "MB");
            resolve(blob);
          } else reject(new Error("Compression échouée"));
        }, "image/jpeg", quality);
      };
      img.onerror = reject;
    });
  };

  const fileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const uploadPhoto = useCallback(async (file: File, isMain = false): Promise<Photo | null> => {
    if (!userId) {
      toastError("Vous devez être connecté pour uploader une photo.");
      return null;
    }
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toastError(validationError);
      return null;
    }

    setUploading(true);
    setProgress(10);
    setError(null);

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      const currentPhotos = userDoc.data()?.photos || [];
      if (currentPhotos.length >= 6) {
        setError("Maximum 6 photos atteint.");
        toastError("Maximum 6 photos atteint.");
        setUploading(false);
        return null;
      }

      setProgress(30);
      const compressed = await compressImage(file);
      
      // Vérifier que la taille compressée est raisonnable
      if (compressed.size > 5 * 1024 * 1024) {
        toastError("L'image reste trop grande après compression. Essayez une image plus petite.");
        setUploading(false);
        return null;
      }

      setProgress(50);
      const base64 = await fileToBase64(compressed);

      setProgress(70);
      const formData = new FormData();
      formData.append("key", IMGBB_API_KEY);
      formData.append("image", base64);
      formData.append("name", `user_${userId}_${Date.now()}`);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Upload échoué");
      }

      setProgress(90);

      const photo: Photo = {
        url: result.data.url,
        deleteUrl: result.data.delete_url || "",
        isMain: isMain || currentPhotos.length === 0,
        uploadedAt: new Date().toISOString(),
      };

      const updates: any = { photos: arrayUnion(photo) };
      if (photo.isMain) {
        const updatedPhotos = currentPhotos.map((p: Photo) => ({ ...p, isMain: false }));
        updates.photos = [...updatedPhotos, photo];
      }

      await updateDoc(doc(db, "users", userId), updates);
      setProgress(100);
      setUploading(false);
      setProgress(0);
      success("Photo ajoutée avec succès !");
      return photo;

    } catch (err: any) {
      console.error("Upload error:", err);
      toastError(err.message || "Erreur lors de l'upload. Vérifiez votre connexion.");
      setError(err.message || "Erreur lors de l'upload.");
      setUploading(false);
      setProgress(0);
      return null;
    }
  }, [userId]);

  const deletePhoto = useCallback(async (photo: Photo, allPhotos: Photo[]): Promise<boolean> => {
    if (!userId) return false;
    setError(null);

    try {
      if (photo.deleteUrl) {
        try { await fetch(photo.deleteUrl); } catch {}
      }

      await updateDoc(doc(db, "users", userId), {
        photos: arrayRemove(photo),
      });

      const remaining = allPhotos.filter(p => p.url !== photo.url);
      if (photo.isMain && remaining.length > 0) {
        const newMain = { ...remaining[0], isMain: true };
        const updatedPhotos = remaining.map((p, i) => i === 0 ? newMain : p);
        await updateDoc(doc(db, "users", userId), { photos: updatedPhotos });
      }

      success("Photo supprimée.");
      return true;
    } catch (err) {
      toastError("Erreur lors de la suppression.");
      setError("Erreur lors de la suppression.");
      return false;
    }
  }, [userId]);

  const setMainPhoto = useCallback(async (photoUrl: string, allPhotos: Photo[]): Promise<boolean> => {
    if (!userId) return false;

    try {
      const updatedPhotos = allPhotos.map(p => ({
        ...p,
        isMain: p.url === photoUrl,
      }));
      await updateDoc(doc(db, "users", userId), { photos: updatedPhotos });
      return true;
    } catch (err) {
      toastError("Erreur lors du changement de photo principale.");
      setError("Erreur lors du changement de photo principale.");
      return false;
    }
  }, [userId]);

  return { uploadPhoto, deletePhoto, setMainPhoto, uploading, progress, error, setError };
}
