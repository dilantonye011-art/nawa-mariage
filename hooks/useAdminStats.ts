"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface AdminStats {
  totalUsers: number;
  totalMatches: number;
  totalMessages: number;
  totalLikes: number;
  verifiedUsers: number;
  pendingVerifications: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  activeUsersToday: number;
  genderDistribution: { male: number; female: number };
  ageDistribution: Record<string, number>;
  topCities: { city: string; count: number }[];
  dailySignups: { date: string; count: number }[];
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalUsers = users.length;
      const verifiedUsers = users.filter((u: any) => u.verificationStatus === "verified").length;
      const pendingVerifications = users.filter((u: any) => u.verificationStatus === "pending").length;
      const maleCount = users.filter((u: any) => u.gender === "male").length;
      const femaleCount = users.filter((u: any) => u.gender === "female").length;

      const newUsersToday = users.filter((u: any) => new Date(u.createdAt) >= today).length;
      const newUsersThisWeek = users.filter((u: any) => new Date(u.createdAt) >= weekAgo).length;
      const activeUsersToday = users.filter((u: any) => u.lastActive && new Date(u.lastActive) >= today).length;

      const ageDistribution: Record<string, number> = {};
      users.forEach((u: any) => {
        const decade = Math.floor(u.age / 10) * 10;
        const key = `${decade}-${decade + 9}`;
        ageDistribution[key] = (ageDistribution[key] || 0) + 1;
      });

      const cityCounts: Record<string, number> = {};
      users.forEach((u: any) => { cityCounts[u.city] = (cityCounts[u.city] || 0) + 1; });
      const topCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const dailySignups: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
        const count = users.filter((u: any) => {
          const d = new Date(u.createdAt);
          return d.getDate() === date.getDate() && d.getMonth() === date.getMonth();
        }).length;
        dailySignups.push({ date: dateStr, count });
      }

      const likesSnap = await getDocs(collection(db, "likes"));
      const totalLikes = likesSnap.docs.length;
      const matches = likesSnap.docs.filter(d => d.data().isMatch).length;

      const messagesSnap = await getDocs(collection(db, "messages"));
      const totalMessages = messagesSnap.docs.length;

      setStats({
        totalUsers,
        totalMatches: matches,
        totalMessages,
        totalLikes,
        verifiedUsers,
        pendingVerifications,
        newUsersToday,
        newUsersThisWeek,
        activeUsersToday,
        genderDistribution: { male: maleCount, female: femaleCount },
        ageDistribution,
        topCities,
        dailySignups,
      });
    } catch (e) {
      console.error("Admin stats error:", e);
    }
    setLoading(false);
  };

  return { stats, loading, refresh: loadStats };
}
