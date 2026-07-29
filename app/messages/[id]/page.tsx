"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

interface ChatUser {
  id: string;
  name: string;
  photos?: string[];
  verificationStatus?: string;
}

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(msgs);
      setLoading(false);

      try {
        const convoDoc = await getDoc(doc(db, "conversations", conversationId));
        if (convoDoc.exists()) {
          const data = convoDoc.data();
          const unread = data.unreadCount || {};
          if (unread[user.uid] > 0) {
            unread[user.uid] = 0;
            await updateDoc(doc(db, "conversations", conversationId), { unreadCount: unread });
          }
        }
      } catch (e) {
        console.error("Erreur marquage lu:", e);
      }
    });

    return () => unsub();
  }, [user, conversationId]);

  useEffect(() => {
    if (!user || !conversationId) return;
    
    getDoc(doc(db, "conversations", conversationId)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const otherId = data.participantsIds?.find((id: string) => id !== user.uid);
      if (otherId) {
        getDoc(doc(db, "users", otherId)).then((userSnap) => {
          if (userSnap.exists()) {
            setOtherUser({ id: otherId, ...userSnap.data() } as ChatUser);
          }
        });
      }
    });
  }, [user, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      const messagesRef = collection(db, "conversations", conversationId, "messages");
      await addDoc(messagesRef, {
        senderId: user.uid,
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
      });

      const convoRef = doc(db, "conversations", conversationId);
      const convoSnap = await getDoc(convoRef);
      if (convoSnap.exists()) {
        const data = convoSnap.data();
        const unread = data.unreadCount || {};
        const otherId = data.participantsIds?.find((id: string) => id !== user.uid);
        if (otherId) {
          unread[otherId] = (unread[otherId] || 0) + 1;
          await updateDoc(convoRef, {
            lastMessage: newMessage.trim(),
            lastMessageAt: serverTimestamp(),
            unreadCount: unread,
          });
        }
      }

      setNewMessage("");
    } catch (err) {
      console.error("Erreur envoi message:", err);
      alert("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/messages" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Link>
        
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
            {otherUser?.name?.[0] || "?"}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              {otherUser?.name || "Utilisateur"}
              {otherUser?.verificationStatus === "verified" && (
                <Shield className="w-4 h-4 text-green-500 fill-green-500" />
              )}
            </h2>
            <p className="text-xs text-gray-500">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>Commencez la conversation !</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.uid;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-primary-600 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md shadow-sm"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-200" : "text-gray-400"}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ecrivez un message..."
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
