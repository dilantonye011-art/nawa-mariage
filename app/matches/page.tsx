"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, MapPin, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { VerificationBadge } from "@/components/VerificationBadge";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User } from "@/types";

export default function MatchesPage() {
  const { user } = useAuth();
  const { matches: getMatches } = useLikes(user?.id);
  const [matchProfiles, setMatchProfiles] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const loadMatches = async () => {
      const matchIds = getMatches();
      if (matchIds.length === 0) {
        setMatchProfiles([]);
        return;
      }
      
      const profiles: User[] = [];
      for (const matchId of matchIds) {
        const userDoc = await getDoc(doc(db, "users", matchId));
        if (userDoc.exists()) {
          profiles.push({ ...userDoc.data(), id: userDoc.id } as User);
        }
      }
      setMatchProfiles(profiles);
    };
    
    loadMatches();
  }, [user, getMatches]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">Se connecter</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/discover/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="font-bold text-gray-900 dark:text-white">Mes matches</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {matchProfiles.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun match encore</p>
            <p className="text-sm text-gray-400 mt-1">Aimez des profils pour creer des matches</p>
            <Link href="/discover/" className="inline-block mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-medium">
              Decouvrir
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matchProfiles.map((profile) => (
              <div key={profile.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {profile.photos?.[0] ? (
                    <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{profile.name}</h3>
                    <VerificationBadge status={profile.verificationStatus} size="sm" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{profile.city}, {profile.age} ans
                  </p>
                </div>
                <Link href={`/messages/${profile.id}`} className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl hover:bg-primary-100 transition">
                  <MessageCircle className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}