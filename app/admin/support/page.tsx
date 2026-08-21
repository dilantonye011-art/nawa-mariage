"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ArrowLeft, LifeBuoy, Circle } from "lucide-react";

interface SupportConversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: any;
  unreadByAdmin: boolean;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [loadingConvos, setLoadingConvos] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push("/discover/");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    const q = query(collection(db, "supportConversations"), orderBy("lastMessageAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setConversations(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as SupportConversation[]);
      setLoadingConvos(false);
    });
    return () => unsub();
  }, [user]);

  if (loading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = conversations.filter((c) => c.unreadByAdmin).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard/" className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-xl flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-primary-500" />
            Support {unreadCount > 0 && <span className="text-sm bg-primary-600 px-2 py-0.5 rounded-full">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</span>}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loadingConvos ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-gray-400 text-center py-10">Aucune conversation de support pour l&apos;instant.</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((c) => (
              <Link key={c.id} href={`/admin/support/${c.userId}/`} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-primary-700 transition">
                {c.unreadByAdmin && <Circle className="w-2.5 h-2.5 fill-primary-500 text-primary-500 flex-shrink-0" />}
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {c.userName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${c.unreadByAdmin ? "text-white" : "text-gray-300"}`}>{c.userName}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{c.lastMessage}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
