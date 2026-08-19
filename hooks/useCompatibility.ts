"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { computeProfile, ProfileId, CompatibilityProfileResult } from "@/lib/profiles";

export function useCompatibility(userId?: string) {
  const [answers, setAnswers] = useState<Record<string, ProfileId>>({});
  const [result, setResult] = useState<CompatibilityProfileResult | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "userAnswers", userId));
        if (snap.exists()) {
          const data = snap.data();
          setAnswers(data.answers || {});
          if (data.primaryProfile) {
            setResult({
              primary: data.primaryProfile,
              secondary: data.secondaryProfile,
              scores: data.scores || {},
            });
          }
          setHasCompleted(true);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [userId]);

  const saveAnswers = useCallback(async (newAnswers: Record<string, ProfileId>) => {
    if (!userId) return null;
    const computed = computeProfile(newAnswers);
    await setDoc(doc(db, "userAnswers", userId), {
      userId,
      answers: newAnswers,
      primaryProfile: computed?.primary || null,
      secondaryProfile: computed?.secondary || null,
      scores: computed?.scores || {},
      completedAt: new Date().toISOString(),
    });
    setAnswers(newAnswers);
    setResult(computed);
    setHasCompleted(true);
    return computed;
  }, [userId]);

  return { answers, result, hasCompleted, loading, saveAnswers };
}
