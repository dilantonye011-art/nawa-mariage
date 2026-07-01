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
      
      // Charger toutes les réponses en une fois pour optimiser
      const userAnswersPromises = snapshot.docs
        .filter(d => d.id !== userId)
        .map(async (docSnap) => {
          const profile = { ...docSnap.data(), id: docSnap.id } as User;
          if (profile.id === userId) return null;
          if (profile.gender === currentUser.gender) return null;
          if (profile.isAdmin) return null;
          
          const result = await calculateScore(currentUser, profile, userId!);
          return result;
        });
      
      const results = await Promise.all(userAnswersPromises);
      const validScores = results.filter((s): s is MatchScore => s !== null);
      
      validScores.sort((a, b) => b.score - a.score);
      setSuggestions(validScores);
    } catch (e) {
      console.error("Matching error:", e);
    }
    setLoading(false);
  };

  return { suggestions, loading, refresh: loadSuggestions };
}

// ⭐ Fonction async qui calcule le score avec compatibilité questionnaire
async function calculateScore(currentUser: User, profile: User, currentUserId: string): Promise<MatchScore> {
  let score = 0;
  const reasons: string[] = [];

  // Distance/Localisation (30 points)
  if (currentUser.city === profile.city) {
    score += 30;
    reasons.push("Même ville");
  } else if (currentUser.country === profile.country) {
    score += 15;
    reasons.push("Même pays");
  }

  // Âge (20 points)
  const ageDiff = Math.abs(currentUser.age - profile.age);
  if (ageDiff <= 3) {
    score += 20;
    reasons.push("Âge similaire");
  } else if (ageDiff <= 7) {
    score += 10;
    reasons.push("Âge proche");
  }

  // Profil complet (20 points)
  if (profile.photos && profile.photos.length >= 3) {
    score += 10;
    reasons.push("Photos complètes");
  }
  if (profile.bio && profile.bio.length > 50) {
    score += 10;
    reasons.push("Bio détaillée");
  }

  // Vérification (20 points)
  if (profile.verificationStatus === "verified") {
    score += 20;
    reasons.push("Profil vérifié");
  }

  // Activité (10 points)
  if (profile.lastActive) {
    const lastActive = new Date(profile.lastActive);
    const daysSince = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) {
      score += 10;
      reasons.push("Actif récemment");
    }
  }

  // ⭐ NOUVEAU : Score de compatibilité questionnaire (jusqu'à 30 points bonus)
  const compatScore = await calculateCompatibilityScore(currentUserId, profile.id);
  if (compatScore > 0) {
    const bonusPoints = Math.round(compatScore * 0.3);
    score += bonusPoints;
    if (compatScore >= 80) reasons.push("💞 Compatibilité exceptionnelle");
    else if (compatScore >= 60) reasons.push("💕 Bonne compatibilité");
    else if (compatScore >= 40) reasons.push("💓 Compatibilité moyenne");
  }

  return { user: profile, score, reasons };
}

// ⭐ Fonction qui calcule le score questionnaire entre deux utilisateurs
async function calculateCompatibilityScore(userId: string, profileId: string): Promise<number> {
  try {
    const [userAnswersDoc, profileAnswersDoc] = await Promise.all([
      getDoc(doc(db, "userAnswers", userId)),
      getDoc(doc(db, "userAnswers", profileId)),
    ]);

    if (!userAnswersDoc.exists() || !profileAnswersDoc.exists()) return 0;

    const userAnswers = userAnswersDoc.data().answers as Record<string, number>;
    const profileAnswers = profileAnswersDoc.data().answers as Record<string, number>;

    let totalScore = 0;
    let totalQuestions = 0;

    Object.keys(userAnswers).forEach((qId) => {
      if (profileAnswers[qId] !== undefined) {
        const diff = Math.abs(userAnswers[qId] - profileAnswers[qId]);
        totalScore += Math.max(0, 100 - diff * 25);
        totalQuestions++;
      }
    });

    return totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;
  } catch {
    return 0;
  }
}