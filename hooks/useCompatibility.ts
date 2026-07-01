"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { questions } from "@/lib/questions";
import type { UserAnswers, CompatibilityResult } from "@/types";

export function useCompatibility(userId?: string) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les réponses existantes
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadAnswers = async () => {
      try {
        const docRef = doc(db, "userAnswers", userId);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
          const data = snapshot.data() as UserAnswers;
          setAnswers(data.answers);
          setHasCompleted(true);
        }
      } catch (e) {
        console.error("Load answers error:", e);
      }
      setLoading(false);
    };

    loadAnswers();
  }, [userId]);

  // Sauvegarder les réponses
  const saveAnswers = useCallback(async (newAnswers: Record<string, number>) => {
    if (!userId) return;

    try {
      await setDoc(doc(db, "userAnswers", userId), {
        userId,
        answers: newAnswers,
        completedAt: new Date().toISOString(),
      });
      setAnswers(newAnswers);
      setHasCompleted(true);
    } catch (e) {
      console.error("Save answers error:", e);
    }
  }, [userId]);

  // Calculer la compatibilité avec un autre utilisateur
  const calculateCompatibility = useCallback(async (otherUserId: string): Promise<CompatibilityResult | null> => {
    if (!userId) return null;

    try {
      const otherDoc = await getDoc(doc(db, "userAnswers", otherUserId));
      if (!otherDoc.exists()) return null;

      const otherAnswers = (otherDoc.data() as UserAnswers).answers;
      const myAnswers = answers;

      if (Object.keys(myAnswers).length === 0 || Object.keys(otherAnswers).length === 0) {
        return null;
      }

      const categoryScores: Record<string, { score: number; total: number }> = {};
      let totalScore = 0;
      let totalQuestions = 0;
      const details: string[] = [];

      questions.forEach((q) => {
        const myAnswer = myAnswers[q.id];
        const otherAnswer = otherAnswers[q.id];

        if (myAnswer === undefined || otherAnswer === undefined) return;

        // Score : même réponse = 100%, différence de 1 = 75%, de 2 = 50%, de 3 = 25%
        const diff = Math.abs(myAnswer - otherAnswer);
        const questionScore = Math.max(0, 100 - diff * 25);

        if (!categoryScores[q.category]) {
          categoryScores[q.category] = { score: 0, total: 0 };
        }
        categoryScores[q.category].score += questionScore;
        categoryScores[q.category].total += 1;

        totalScore += questionScore;
        totalQuestions++;

        // Détails pour les questions importantes
        if (questionScore >= 75) {
          details.push(`✅ ${q.question}`);
        }
      });

      // Calculer les scores par catégorie
      const normalizedCategoryScores: Record<string, number> = {};
      Object.entries(categoryScores).forEach(([cat, data]) => {
        normalizedCategoryScores[cat] = Math.round(data.score / data.total);
      });

      const overallScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;

      return {
        overallScore,
        categoryScores: normalizedCategoryScores,
        details: details.slice(0, 5), // Top 5 alignements
      };
    } catch (e) {
      console.error("Calculate compatibility error:", e);
      return null;
    }
  }, [userId, answers]);

  return {
    questions,
    answers,
    hasCompleted,
    loading,
    saveAnswers,
    calculateCompatibility,
  };
}