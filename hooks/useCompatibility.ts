"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface CompatibilityResult {
  overallScore: number;
  categoryScores: Record<string, number>;
  details: string[];
}

export function useCompatibility(userId?: string) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "userAnswers", userId));
        if (snap.exists()) {
          setAnswers(snap.data().answers || {});
          setHasCompleted(true);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [userId]);

  const saveAnswers = useCallback(async (newAnswers: Record<string, number>) => {
    if (!userId) return;
    await setDoc(doc(db, "userAnswers", userId), {
      userId, answers: newAnswers, completedAt: new Date().toISOString(),
    });
    setAnswers(newAnswers);
    setHasCompleted(true);
  }, [userId]);

  return { answers, hasCompleted, loading, saveAnswers };
}
