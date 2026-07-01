"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import type { User } from "@/types";

interface MatchScore {
  user: User;
  score: number;
  reasons: string[];
}

export function useMatching(userId?: string) {
  const [suggestions, setSuggestions] = useState<MatchScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    loadSuggestions();
  }, [userId]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", userId!));
      if (!userDoc.exists()) { setLoading(false); return; }
      const currentUser = userDoc.data() as User;
      const snapshot = await getDocs(collection(db, "users"));
      
      const promises = snapshot.docs
        .filter(d => d.id !== userId)
        .map(async (docSnap) => {
          const profile = { ...docSnap.data(), id: docSnap.id } as User;
          if (profile.gender === currentUser.gender || profile.isAdmin) return null;
          return await calculateScore(currentUser, profile, userId!);
        });
      
      const results = (await Promise.all(promises)).filter((s): s is MatchScore => s !== null);
      results.sort((a, b) => b.score - a.score);
      setSuggestions(results);
    } catch (e) { console.error("Matching error:", e); }
    setLoading(false);
  };

  return { suggestions, loading, refresh: loadSuggestions };
}

async function calculateScore(currentUser: User, profile: User, currentUserId: string): Promise<MatchScore> {
  let score = 0;
  const reasons: string[] = [];

  if (currentUser.city === profile.city) { score += 30; reasons.push("Même ville"); }
  else if (currentUser.country === profile.country) { score += 15; reasons.push("Même pays"); }

  const ageDiff = Math.abs(currentUser.age - profile.age);
  if (ageDiff <= 3) { score += 20; reasons.push("Âge similaire"); }
  else if (ageDiff <= 7) { score += 10; reasons.push("Âge proche"); }

  if (profile.photos && profile.photos.length >= 3) { score += 10; reasons.push("Photos complètes"); }
  if (profile.bio && profile.bio.length > 50) { score += 10; reasons.push("Bio détaillée"); }
  if (profile.verificationStatus === "verified") { score += 20; reasons.push("Profil vérifié"); }

  if (profile.lastActive) {
    const daysSince = (Date.now() - new Date(profile.lastActive).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) { score += 10; reasons.push("Actif récemment"); }
  }

  const compatScore = await calculateCompatibilityScore(currentUserId, profile.id);
  if (compatScore > 0) {
    score += Math.round(compatScore * 0.3);
    if (compatScore >= 80) reasons.push("💞 Compatibilité exceptionnelle");
    else if (compatScore >= 60) reasons.push("💕 Bonne compatibilité");
    else if (compatScore >= 40) reasons.push("💓 Compatibilité moyenne");
  }

  return { user: profile, score, reasons };
}

async function calculateCompatibilityScore(userId: string, profileId: string): Promise<number> {
  try {
    const [userDoc, profileDoc] = await Promise.all([
      getDoc(doc(db, "userAnswers", userId)),
      getDoc(doc(db, "userAnswers", profileId)),
    ]);
    if (!userDoc.exists() || !profileDoc.exists()) return 0;
    const userAns = userDoc.data().answers as Record<string, number>;
    const profileAns = profileDoc.data().answers as Record<string, number>;
    
    let total = 0, count = 0;
    Object.keys(userAns).forEach(qId => {
      if (profileAns[qId] !== undefined) {
        total += Math.max(0, 100 - Math.abs(userAns[qId] - profileAns[qId]) * 25);
        count++;
      }
    });
    return count > 0 ? Math.round(total / count) : 0;
  } catch { return 0; }
}
