"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, getDocs, doc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

interface Like {
  id: string;
  senderId: string;
  receiverId: string;
  createdAt: any;
}

interface MatchResult {
  isMatch: boolean;
  matchId?: string;
}

export function useLikes(userId?: string) {
  const [likes, setLikes] = useState<Like[]>([]);
  const [matches, setMatches] = useState<string[]>([]);

  // Écouter les likes reçus
  useEffect(() => {
    if (!userId) return;
    
    const q = query(
      collection(db, "likes"),
      where("receiverId", "==", userId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLikes: Like[] = [];
      snapshot.forEach((doc) => {
        newLikes.push({ id: doc.id, ...doc.data() } as Like);
      });
      setLikes(newLikes);
    });
    
    return () => unsubscribe();
  }, [userId]);

  // Écouter les matches
  useEffect(() => {
    if (!userId) return;
    
    const q = query(
      collection(db, "matches"),
      where("participants", "array-contains", userId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMatches: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const otherId = data.participants.find((p: string) => p !== userId);
        if (otherId) newMatches.push(otherId);
      });
      setMatches(newMatches);
    });
    
    return () => unsubscribe();
  }, [userId]);

  const hasLiked = useCallback((profileId: string): boolean => {
    return likes.some((like) => like.receiverId === profileId);
  }, [likes]);

  const isMatched = useCallback((profileId: string): boolean => {
    return matches.includes(profileId);
  }, [matches]);

  // ⭐ LIKE + NOTIFICATION
  const likeUser = useCallback(async (profileId: string): Promise<MatchResult | null> => {
    if (!userId) return null;
    
    try {
      // Vérifier si déjà liké
      const q = query(
        collection(db, "likes"),
        where("senderId", "==", userId),
        where("receiverId", "==", profileId)
      );
      const existing = await getDocs(q);
      if (!existing.empty) return null;

      // Ajouter le like
      await addDoc(collection(db, "likes"), {
        senderId: userId,
        receiverId: profileId,
        createdAt: serverTimestamp(),
      });

      // ⭐ Vérifier si c'est un match (l'autre m'a déjà liké)
      const reverseQ = query(
        collection(db, "likes"),
        where("senderId", "==", profileId),
        where("receiverId", "==", userId)
      );
      const reverseLikes = await getDocs(reverseQ);

      if (!reverseLikes.empty) {
        // C'est un match !
        const matchDoc = await addDoc(collection(db, "matches"), {
          participants: [userId, profileId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // ⭐ Créer la conversation
        await addDoc(collection(db, "conversations"), {
          participants: [userId, profileId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessage: null,
        });

        // ⭐ NOTIFICATION : Match !
        await sendMatchNotification(profileId, userId);

        return { isMatch: true, matchId: matchDoc.id };
      }

      // ⭐ NOTIFICATION : Like reçu
      await sendLikeNotification(profileId, userId);

      return { isMatch: false };
    } catch (e) {
      console.error("Like error:", e);
      return null;
    }
  }, [userId]);

  return { likes, matches, likeUser, hasLiked, isMatched };
}

// ⭐ ENVOYER NOTIFICATION DE MATCH
async function sendMatchNotification(targetUserId: string, fromUserId: string) {
  try {
    // Récupérer le nom de l'expéditeur
    const userDoc = await getDoc(doc(db, "users", fromUserId));
    const userName = userDoc.exists() ? userDoc.data().name : "Quelqu'un";

    // Afficher un toast (notification en app)
    showInAppNotification({
      title: "💝 C'est un Match !",
      body: `${userName} et vous vous aimez mutuellement !`,
      type: "match",
    });

    // TODO: Envoyer notification push FCM (quand configuré)
    // await sendPushNotification(targetUserId, ...);
  } catch (e) {
    console.error("Match notification error:", e);
  }
}

// ⭐ ENVOYER NOTIFICATION DE LIKE
async function sendLikeNotification(targetUserId: string, fromUserId: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", fromUserId));
    const userName = userDoc.exists() ? userDoc.data().name : "Quelqu'un";

    showInAppNotification({
      title: "❤️ Nouveau Like",
      body: `${userName} a aimé votre profil !`,
      type: "like",
    });
  } catch (e) {
    console.error("Like notification error:", e);
  }
}

// ⭐ AFFICHER NOTIFICATION DANS L'APP (Toast)
function showInAppNotification({ title, body, type }: { title: string; body: string; type: string }) {
  if (typeof window === "undefined") return;

  // Créer le toast
  const toast = document.createElement("div");
  toast.className = "fixed top-4 right-4 z-[9999] max-w-sm animate-slide-in";
  toast.innerHTML = `
    <div class="bg-gray-900 border ${type === 'match' ? 'border-primary-500' : 'border-pink-500'} rounded-2xl p-4 shadow-2xl flex items-start gap-3">
      <div class="w-10 h-10 ${type === 'match' ? 'bg-primary-600' : 'bg-pink-600'} rounded-full flex items-center justify-center flex-shrink-0">
        ${type === 'match' ? '💝' : '❤️'}
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-white text-sm">${title}</h4>
        <p class="text-xs text-gray-400 mt-0.5">${body}</p>
      </div>
      <button class="text-gray-500 hover:text-white text-lg leading-none" onclick="this.closest('.animate-slide-in').remove()">×</button>
    </div>
  `;

  document.body.appendChild(toast);

  // Animation d'entrée
  toast.animate([
    { transform: 'translateX(100%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ], { duration: 300, easing: 'ease-out' });

  // Auto-remove après 5 secondes
  setTimeout(() => {
    toast.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100%)', opacity: 0 }
    ], { duration: 300, easing: 'ease-in' }).onfinish = () => toast.remove();
  }, 5000);
}