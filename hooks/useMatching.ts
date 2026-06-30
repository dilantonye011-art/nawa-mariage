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
    if (!userId) {
      setLoading(false);
      return;
    }
    loadSuggestions();
  }, [userId]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", userId!));
      if (!userDoc.exists()) {
        setLoading(false);
        return;
      }
      
      const currentUser = userDoc.data() as User;
      
      const snapshot = await getDocs(collection(db, "users"));
      const scores: MatchScore[] = [];
      
      snapshot.forEach((docSnap) => {
        const profile = { ...docSnap.data(), id: docSnap.id } as User;
        if (profile.id === userId) return;
        if (profile.gender === currentUser.gender) return;
        if (profile.isAdmin) return;
        
        const result = calculateScore(currentUser, profile);
        scores.push(result);
      });
      
      scores.sort((a, b) => b.score - a.score);
      setSuggestions(scores);
    } catch (e) {
      console.error("Matching error:", e);
    }
    setLoading(false);
  };

  return { suggestions, loading, refresh: loadSuggestions };
}

function calculateScore(currentUser: User, profile: User): MatchScore {
  let score = 0;
  const reasons: string[] = [];

  if (currentUser.city === profile.city) {
    score += 30;
    reasons.push("Même ville");
  } else if (currentUser.country === profile.country) {
    score += 15;
    reasons.push("Même pays");
  }

  const ageDiff = Math.abs(currentUser.age - profile.age);
  if (ageDiff <= 3) {
    score += 20;
    reasons.push("Âge similaire");
  } else if (ageDiff <= 7) {
    score += 10;
    reasons.push("Âge proche");
  }

  if (profile.photos && profile.photos.length >= 3) {
    score += 10;
    reasons.push("Photos complètes");
  }
  if (profile.bio && profile.bio.length > 50) {
    score += 10;
    reasons.push("Bio détaillée");
  }

  if (profile.verificationStatus === "verified") {
    score += 20;
    reasons.push("Profil vérifié");
  }

  if (profile.lastActive) {
    const lastActive = new Date(profile.lastActive);
    const daysSince = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) {
      score += 10;
      reasons.push("Actif récemment");
    }
  }

  return { user: profile, score, reasons };
}
