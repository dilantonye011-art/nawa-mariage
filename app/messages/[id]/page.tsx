"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Video } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import type { User, Message } from "@/types";

export default function MessageDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { user } = useAuth();
  const { messages, sendMessage, listenToMessages } = useMessages(user?.id);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const convoMessages = messages[conversationId] || [];

  // Charger l'autre utilisateur depuis Firebase
  useEffect(() => {
    if (!user || !conversationId) return;
    
    const loadOtherUser = async () => {
      const convoDoc = await getDoc(doc(db, "conversations", conversationId));
      if (convoDoc.exists()) {
        const convoData = convoDoc.data();
        const otherId = convoData.participants.find((p: string) => p !== user.id);
        if (otherId) {
          const userDoc = await getDoc(doc(db, "users", otherId));
          if (userDoc.exists()) {
            setOtherUser({ ...userDoc.data(), id: userDoc.id } as User);
          }
        }
      }
    };
    
    loadOtherUser();
  }, [conversationId, user]);

  // Écouter les messages en temps réel
  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = listenToMessages(conversationId);
    return () => unsubscribe();
  }, [conversationId, listenToMessages]);

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [convoMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(conversationId, newMessage);
    setNewMessage("");
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">Se connecter</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/messages/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center overflow-hidden">
            {otherUser?.photos?.[0] ? (
              <img src={otherUser.photos[0]} alt={otherUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-primary-600">{otherUser?.name?.[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">{otherUser?.name}</h2>
            <p className="text-xs text-green-500">En ligne</p>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {convoMessages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">Commencez la conversation</p>
            </div>
          )}
          {convoMessages.map((msg: Message) => {
            const isMine = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  isMine 
                    ? "bg-primary-600 text-white rounded-br-md" 
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-md"
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? "text-primary-200" : "text-gray-400"}`}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-3">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Ecrivez un message..." 
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition" 
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()} 
            className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}