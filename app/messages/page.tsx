"use client";

function getImageUrl(photo: string | { url?: string } | null | undefined): string {
  if (!photo) return "/default-avatar.svg";
  const url = typeof photo === "string" ? photo : photo?.url;
  if (!url) return "/default-avatar.svg";
  if (url.startsWith("data:")) return "/default-avatar.svg";
  if (url.startsWith("https://ibb.co/")) return url.replace("https://ibb.co/", "https://i.ibb.co/");
  return url;
}
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Users, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import type { User } from "@/types";

export default function MessagesPage() {
  const { user } = useAuth();
  const { conversations } = useMessages(user?.id);
  const [conversationUsers, setConversationUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
    const map: Record<string, User> = {};
    conversations.forEach((c) => { const otherId = c.participants.find((p) => p !== user.id); if (otherId) { const other = users.find((u: User) => u.id === otherId); if (other) map[c.id] = other; } });
    setConversationUsers(map);
  }, [conversations, user]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">Se connecter</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/discover/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"><ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" /></Link>
          <h1 className="font-bold text-gray-900 dark:text-white">Messages</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {conversations.length === 0 ? (
          <div className="text-center py-20"><MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400 font-medium">Aucune conversation</p><p className="text-sm text-gray-400 mt-1">Creez un match pour discuter</p></div>
        ) : (
          <div className="space-y-2">
            {conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((convo) => {
              const otherUser = conversationUsers[convo.id];
              if (!otherUser) return null;
              return (
                <Link key={convo.id} href={`/messages/${convo.id}/`} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:border-primary-300 dark:hover:border-primary-700 transition">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {getImageUrl(otherUser.photos?.[0]) ? <img src={typeof getImageUrl(otherUser.photos?.[0]) === "string" ? (otherUser.photos[0].startsWith("data:") ? "/default-avatar.svg" : otherUser.photos[0]) : "/default-avatar.svg"} alt={otherUser.name} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white">{otherUser.name}</h3>
                    {convo.lastMessage ? <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{convo.lastMessage.senderId === user.id ? "Vous: " : ""}{convo.lastMessage.content}</p> : <p className="text-sm text-gray-400">Nouvelle conversation</p>}
                  </div>
                  {convo.lastMessage && <div className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(convo.lastMessage.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}



