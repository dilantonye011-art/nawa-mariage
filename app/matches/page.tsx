"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User } from "@/types";

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { matches } = useLikes(user?.id); // ← matches est un tableau string[]
  const [matchProfiles, setMatchProfiles] = useState<User[]>([]);
  const [matchLoading, setMatchLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const loadMatchProfiles = async () => {
      if (matches.length === 0) { // ← Utilise matches (le tableau), pas getMatches()
        setMatchProfiles([]);
        setMatchLoading(false);
        return;
      }

      const profiles: User[] = [];
      for (const matchId of matches) {
        const userDoc = await getDoc(doc(db, "users", matchId));
        if (userDoc.exists()) {
          profiles.push({ ...userDoc.data(), id: matchId } as User);
        }
      }
      setMatchProfiles(profiles);
      setMatchLoading(false);
    };

    loadMatchProfiles();
  }, [matches, user]); // ← Dépendance sur matches

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">
          Se connecter
        </Link>
      </div>
    );
  }

  if (loading || matchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/discover/")} className="p-2 hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Mes Matches</h1>
          <span className="ml-auto px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full font-bold">
            {matchProfiles.length}
          </span>
        </div>
      </div>

      {/* Liste des matches */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {matchProfiles.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">Aucun match pour l'instant</p>
            <p className="text-sm text-gray-600 mt-2">
              Like des profils pour trouver ton âme sœur !
            </p>
            <button
              onClick={() => router.push("/discover/")}
              className="mt-6 px-6 py-3 bg-primary-600 rounded-xl font-medium hover:bg-primary-500 transition"
            >
              Découvrir des profils
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {matchProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-900/20 to-secondary-900/20 relative">
                  {profile.photos?.[0] ? (
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-600">
                        {profile.name?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {profile.city}, {profile.country}
                  </p>
                  <Link
                    href={`/messages/`}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-primary-600 rounded-xl font-medium hover:bg-primary-500 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Envoyer un message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}