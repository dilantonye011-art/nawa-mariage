"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Video } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "@/types";
import { VideoCall } from "@/components/VideoCall";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: any;
  type: "text" | "image";
}

export default function ConversationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Charger l'autre utilisateur
  useEffect(() => {
    if (!id || !user) return;
    
    const loadOtherUser = async () => {
      const convoDoc = await getDoc(doc(db, "conversations", id as string));
      if (!convoDoc.exists()) return;
      
      const participants = convoDoc.data().participants as string[];
      const otherId = participants.find(p => p !== user.id);
      
      if (otherId) {
        const userDoc = await getDoc(doc(db, "users", otherId));
        if (userDoc.exists()) {
          setOtherUser({ ...userDoc.data(), id: otherId } as User);
        }
      }
    };
    
    loadOtherUser();
  }, [id, user]);

  // Écouter les messages en temps réel
  useEffect(() => {
    if (!id) return;
    
    const q = query(
      collection(db, "conversations", id as string, "messages"),
      orderBy("createdAt", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [id]);

  // Scroll automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;

    try {
      // Ajouter le message
      await addDoc(collection(db, "conversations", id as string, "messages"), {
        senderId: user.id,
        content: newMessage.trim(),
        createdAt: serverTimestamp(),
        type: "text",
      });

      // Mettre à jour la conversation
      await updateDoc(doc(db, "conversations", id as string), {
        lastMessage: {
          content: newMessage.trim(),
          senderId: user.id,
          createdAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      });

      setNewMessage("");
    } catch (e) {
      console.error("Send error:", e);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/messages/")} className="p-2 hover:bg-gray-800 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center overflow-hidden">
            {otherUser?.photos?.[0] ? (
              <img src={otherUser.photos[0]} alt={otherUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold">{otherUser?.name?.[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-bold">{otherUser?.name || "Chargement..."}</h1>
            <p className="text-xs text-gray-400">
              {otherUser?.verificationStatus === "verified" ? "✓ Vérifié" : "En ligne"}
            </p>
          </div>
          {/* Bouton Appel Vidéo */}
          <button
            onClick={() => setShowVideoCall(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <Video className="w-5 h-5 text-primary-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>Envoyez un message pour commencer la conversation !</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  isMe 
                    ? "bg-primary-600 text-white rounded-br-md" 
                    : "bg-gray-800 text-gray-200 rounded-bl-md"
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-primary-200" : "text-gray-500"}`}>
                    {msg.createdAt?.toDate?.() 
                      ? msg.createdAt.toDate().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                      : "..."
                    }
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-primary-600 rounded-xl hover:bg-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Appel Vidéo */}
      {showVideoCall && otherUser && (
        <VideoCall
          userId={user.id}
          otherUserId={otherUser.id}
          otherUserName={otherUser.name}
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
}
