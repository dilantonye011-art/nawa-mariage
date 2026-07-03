"use client";
import { useState, useRef } from "react";
import { X, Upload, Shield, Camera, FileText, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVerification } from "@/hooks/useVerification";
import { useProfilePhotos } from "@/hooks/useProfilePhotos";

interface VerificationModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
}

const documentTypes = [
  { id: "cni" as const, label: "Carte Nationale d'Identité", icon: CreditCard },
  { id: "passport" as const, label: "Passeport", icon: FileText },
  { id: "permis" as const, label: "Permis de conduire", icon: Camera },
  { id: "autre" as const, label: "Autre document officiel", icon: FileText },
];

export function VerificationModal({ userId, isOpen, onClose, currentStatus }: VerificationModalProps) {
  const { submitVerification, submitting } = useVerification(userId);
  const { uploadPhoto } = useProfilePhotos(userId);
  const [selectedType, setSelectedType] = useState<"cni" | "passport" | "permis" | "autre">("cni");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    // Upload via le hook photos (on réutilise le même système)
    const photo = await uploadPhoto(file, false);
    if (photo) {
      setDocumentUrl(photo.url);
    }
    setUploadingDoc(false);
  };

  const handleSubmit = async () => {
    if (!documentUrl) {
      return;
    }
    const success = await submitVerification(selectedType, documentUrl);
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Vérification d'identité</h3>
                  <p className="text-sm text-gray-500">Statut actuel : {currentStatus}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type de document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de document
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {documentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${
                        selectedType === type.id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <type.icon className={`w-4 h-4 ${selectedType === type.id ? "text-primary-600" : "text-gray-400"}`} />
                      <span className={`text-xs font-medium ${selectedType === type.id ? "text-primary-700" : "text-gray-600"}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload du document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Photo du document
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {documentUrl ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-primary-500">
                    <img src={documentUrl} alt="Document" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => setDocumentUrl("")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingDoc}
                    className="w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center gap-2 hover:border-primary-400 transition"
                  >
                    <Upload className={`w-8 h-8 ${uploadingDoc ? "text-primary-500 animate-bounce" : "text-gray-400"}`} />
                    <span className="text-sm text-gray-500">
                      {uploadingDoc ? "Upload en cours..." : "Cliquer pour ajouter le document"}
                    </span>
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  📋 Votre document sera examiné sous 24-48h. Les informations sont chiffrées et confidentielles.
                </p>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!documentUrl || submitting}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Envoi..." : "Envoyer la demande"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
