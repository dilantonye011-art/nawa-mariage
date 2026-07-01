"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";

export interface LandingStats {
  totalUsers: number;
  totalCouples: number;
  countriesCount: number;
  verifiedRate: number;
  newUserToday: boolean;
}

export function useLandingStats() {
  const [stats, setStats] = useState<LandingStats>({
    totalUsers: 0,
    totalCouples: 0,
    countriesCount: 0,
    verifiedRate: 98,
    newUserToday: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Écoute temps réel des utilisateurs
    const usersUnsub = onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map(d => d.data());
      const countries = new Set(users.map(u => u.country).filter(Boolean));
      const verified = users.filter(u => u.verificationStatus === "verified").length;
      const verifiedRate = users.length > 0 ? Math.round((verified / users.length) * 100) : 0;
      
      setStats(prev => ({
        ...prev,
        totalUsers: users.length,
        countriesCount: countries.size,
        verifiedRate,
      }));
      setLoading(false);
    });

    // Écoute temps réel des couples
    const couplesUnsub = onSnapshot(collection(db, "couples"), (snap) => {
      setStats(prev => ({ ...prev, totalCouples: snap.docs.length }));
    });

    return () => {
      usersUnsub();
      couplesUnsub();
    };
  }, []);

  return { stats, loading };
}
