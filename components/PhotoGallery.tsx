"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Star, Upload, Loader2, AlertCircle } from "lucide-react";
import { Photo, useProfilePhotos } from "@/hooks/useProfilePhotos"
import { useToastContext } from "@/components/ToastProvider";;
import { motion, AnimatePresence } from "framer-motion";

interface PhotoGalleryProps {
  userId: string;
  photos: Photo[];
  onPhotosChange: () => void;
}

export function PhotoGallery({ userId, photos, onPhotosChange }: PhotoGalleryProps) {
  const { info } = useToastContext();
  const { uploadPhoto, deletePhoto, setMainPhoto, uploading, progress, error, setError } = useProfilePhotos(userId);
  const [dragOver, setDragOver] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).slice(0, 6 - photos.length);
    for (const file of fileArray) {
      await uploadPhoto(file);
    }
    onPhotosChange();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [photos.length]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm("Supprimer cette photo ?")) return;
    setDeleting(photo.url);
    await deletePhoto(photo, photos);
    setDeleting(null);
    onPhotosChange();
  };

  const handleSetMain = async (photo: Photo) => {
    if (photo.isMain) return;
    await setMainPhoto(photo.url, photos);
    info("Photo principale mise à jour");
    onPhotosChange();
  };

  const sortedPhotos = [...photos].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 dark:text-white">Photos ({photos.length}/6)</h2>
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-primary-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{progress}%</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div
        className={`grid grid-cols-3 gap-3 ${dragOver ? "ring-2 ring-primary-400 ring-offset-2 rounded-2xl" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
      >
        <AnimatePresence>
          {sortedPhotos.map((photo, index) => (
            <motion.div
              key={photo.url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`aspect-square rounded-xl overflow-hidden relative group ${photo.isMain ? "ring-2 ring-primary-500 ring-offset-2" : ""}`}
            >
              <Image
                src={photo.url}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 200px"
              />
              
              {photo.isMain && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" /> Principale
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!photo.isMain && (
                  <button
                    onClick={() => handleSetMain(photo)}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition"
                    title="Définir comme principale"
                  >
                    <Star className="w-4 h-4 text-primary-600" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deleting === photo.url}
                  className="p-2 bg-white/90 rounded-lg hover:bg-red-50 transition"
                  title="Supprimer"
                >
                  {deleting === photo.url ? (
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </button>
              </div>

              <div className="absolute bottom-2 right-2 w-6 h-6 bg-black/50 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {photos.length < 6 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition ${
              dragOver 
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
            }`}
          >
            <Upload className={`w-6 h-6 ${dragOver ? "text-primary-500" : "text-gray-400"}`} />
            <span className="text-xs text-gray-400">
              {uploading ? `${progress}%` : "Glisser ou cliquer"}
            </span>
          </motion.button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <p className="mt-3 text-xs text-gray-400 text-center">
        JPG, PNG, WebP, GIF • Max 10 Mo • Max 6 photos • Glisser-déposer supporté
      </p>
    </div>
  );
}

