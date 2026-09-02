"use client";
import { useEffect, useCallback, useState } from "react";
import { getToken } from "firebase/messaging";
import { db, getMessagingIfSupported } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

// Cle VAPID generee dans Firebase Console > Parametres du projet >
// Cloud Messaging > Certificats Web Push > "Generer une paire de cles".
// A definir dans les variables d'environnement Vercel sous ce nom exact.
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function usePushNotifications(userId?: string) {
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const enableNotifications = useCallback(async () => {
    if (!userId || typeof window === "undefined" || !("Notification" in window)) return false;
    if (!VAPID_KEY) {
      console.error("NEXT_PUBLIC_FIREBASE_VAPID_KEY manquante - impossible d'activer les notifications push.");
      return false;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;

      const messaging = await getMessagingIfSupported();
      if (!messaging) return false;

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (!token) return false;

      await updateDoc(doc(db, "users", userId), {
        fcmTokens: arrayUnion(token),
      });
      return true;
    } catch (e) {
      console.error("Erreur activation notifications push:", e);
      return false;
    }
  }, [userId]);

  return { permission, enableNotifications };
}
