"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, LifeBuoy } from "lucide-react";
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
  updateDoc,
  getDoc,
} from "firebase/firestore";

interface SupportMessage {
  id: string;
  senderRole: "user" | "admin";
  text: string;
  createdAt: any;
}

export default function AdminSupportChatPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const { user, loading } = useAuth();

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [conversationInfo, setConversationInfo] = useState<{ userName: string; userEmail: string } | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push("/discover/");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user?.isAdmin || !userId) return;
    const messagesRef = collection(db, "supportConversations", userId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as SupportMessage[];
      setMessages(msgs);
      setLoadingMessages(false);
      try {
        const convoDoc = await getDoc(doc(db, "supportConversations", userId));
        if (convoDoc.exists()) {
          const data = convoDoc.data();
          setConversationInfo({ userName: data.userName, userEmail: data.userEmail });
          if (data.unreadByAdmin) await updateDoc(doc(db, "supportConversations", userId), { unreadByAdmin: false });
        }
      } catch (e) { console.error("Erreur marquage lu:", e); }
    });
    return () => unsub();
  }, [user, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage("");
    try {
      await updateDoc(doc(db, "supportConversations", userId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadByUser: true,
      });
      await addDoc(collection(db, "supportConversations", userId, "messages"), {
        senderRole: "admin",
        text,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Erreur envoi reponse support:", e);
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  if (loading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/admin/support/" className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <LifeBuoy className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h1 className="font-bold">{conversationInfo?.userName || "Utilisateur"}</h1>
            <p className="text-xs text-gray-400">{conversationInfo?.userEmail}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-3">
        {loadingMessages ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${m.senderRole === "admin" ? "bg-primary-600 text-white" : "bg-gray-800 text-gray-100"}`}>
                <p className="text-sm">{m.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-800 bg-gray-900/80 backdrop-blur-xl sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Repondre..."
            className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary-600"
          />
          <button type="submit" disabled={sending || !newMessage.trim()} className="p-3 bg-primary-600 rounded-xl hover:bg-primary-500 transition disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
