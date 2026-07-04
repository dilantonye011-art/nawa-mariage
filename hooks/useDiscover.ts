"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { SearchFilters } from "@/hooks/useSearchFilters";

export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  photos: { url: string; isMain: boolean }[];
  bio: string;
  religion?: string;
  maritalStatus?: string;
  verificationStatus: string;
}

export function useDiscover(currentUserId: string | undefined, filters: SearchFilters) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let q = query(
        collection(db, "users"),
        where("id", "!=", currentUserId),
        limit(50)
      );

      const snapshot = await getDocs(q);
      let results: Profile[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Profile;
        results.push({ ...data, id: doc.id });
      });

      // Appliquer les filtres côté client
      results = results.filter((profile) => {
        if (profile.age < filters.ageMin || profile.age > filters.ageMax) return false;
        if (filters.country && profile.country !== filters.country) return false;
        if (filters.city && !profile.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.religion && profile.religion !== filters.religion) return false;
        if (filters.maritalStatus && profile.maritalStatus !== filters.maritalStatus) return false;
        if (filters.verifiedOnly && profile.verificationStatus !== "verified") return false;
        return true;
      });

      setProfiles(results);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, filters]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { profiles, loading, error, refetch: fetchProfiles };
}
