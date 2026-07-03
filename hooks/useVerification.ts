"use client";
import { useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToastContext } from "@/components/ToastProvider";

export interface VerificationRequest {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  documentType: "cni" | "passport" | "permis" | "autre";
  documentUrl: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export function useVerification(userId: string | undefined) {
  const { success, error: toastError } = useToastContext();
  const [submitting, setSubmitting] = useState(false);

  const submitVerification = useCallback(async (
    documentType: "cni" | "passport" | "permis" | "autre",
    documentUrl: string
  ): Promise<boolean> => {
    if (!userId) {
      toastError("Vous devez être connecté.");
      return false;
    }

    setSubmitting(true);

    try {
      // Créer la demande de vérification
      const requestId = `verif_${userId}_${Date.now()}`;
      const request: VerificationRequest = {
        id: requestId,
        userId,
        status: "pending",
        documentType,
        documentUrl,
        submittedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "verificationRequests", requestId), request);

      // Mettre à jour le statut de l'utilisateur
      await updateDoc(doc(db, "users", userId), {
        verificationStatus: "pending",
        verificationRequestId: requestId,
      });

      success("Demande de vérification envoyée ! Examen sous 24-48h.");
      return true;
    } catch (err: any) {
      toastError(err.message || "Erreur lors de l'envoi.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [userId]);

  const getVerificationStatus = useCallback(async (): Promise<string> => {
    if (!userId) return "none";

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.data()?.verificationStatus || "none";
    } catch {
      return "none";
    }
  }, [userId]);

  return { submitVerification, getVerificationStatus, submitting };
}
