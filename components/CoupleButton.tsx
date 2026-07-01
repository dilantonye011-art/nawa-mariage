"use client";
import { useState } from "react";
import { Heart, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface CoupleButtonProps {
  otherUserId: string;
  otherUserName: string;
}

export function CoupleButton({ otherUserId, otherUserName }: CoupleButtonProps) {
  const { user } = useAuth();
  const [confirmed, setConfirmed] = useState(false);

  const declareCouple = async () => {
    if (!user) return;
    if (!confirm(`Confirmez-vous que vous et ${otherUserName} formez un couple ? Cette action est définitive.`)) return;

    const coupleId = [user.id, otherUserId].sort().join("_");
    
    await setDoc(doc(db, "couples", coupleId), {
      user1Id: user.id,
      user1Name: user.name,
      user2Id: otherUserId,
      user2Name: otherUserName,
      createdAt: serverTimestamp(),
      declaredBy: user.id,
    });

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-sm font-medium">
        <Check className="w-4 h-4" />
        Couple officiel !
      </div>
    );
  }

  return (
    <button
      onClick={declareCouple}
      className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-700 transition"
    >
      <Heart className="w-4 h-4" fill="currentColor" />
      Nous sommes un couple
    </button>
  );
}
