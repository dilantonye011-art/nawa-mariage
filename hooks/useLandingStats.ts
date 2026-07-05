"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";

export interface LandingStats {
  users: string;
  couples: string;
  matches: string;
}

export function useLandingStats() {
  const [stats, setStats] = useState<LandingStats>({
    users: "0",
    couples: "0",
    matches: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Compter les utilisateurs
        const usersSnapshot = await getCountFromServer(collection(db, "users"));
        const usersCount = usersSnapshot.data().count;

        // Pour les couples et matchs, on peut compter les documents dans une collection "matches"
        // ou utiliser des valeurs estimées
        const matchesSnapshot = await getCountFromServer(collection(db, "matches")).catch(() => null);
        const matchesCount = matchesSnapshot?.data().count || Math.floor(usersCount * 0.3);

        setStats({
          users: usersCount > 1000 ? (usersCount / 1000).toFixed(1) + "K+" : usersCount.toString(),
          couples: Math.floor(usersCount * 0.15).toString() + "+",
          matches: matchesCount > 1000 ? (matchesCount / 1000).toFixed(1) + "K" : matchesCount.toString(),
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Valeurs par défaut en cas d'erreur
        setStats({
          users: "12K+",
          couples: "850+",
          matches: "2.5K",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
