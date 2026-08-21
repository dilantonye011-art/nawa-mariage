"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

interface SupportMessage {
  id: string;
  senderRole: "user" | "admin";
  text: string;
  createdAt: any;
}

export default function SupportPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const messagesRef = collection(db, "supportConversations", user.id, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as SupportMessage[];
      setMessages(msgs);
      setLoadingMessages(false);
      try {
        const convoDoc = await getDoc(doc(db, "supportConversations", user.id));
        if (convoDoc.exists() && convoDoc.data().unreadByUser) {
          await updateDoc(doc(db, "supportConversations", user.id), { unreadByUser: false });
        }
      } catch (e) { console.error("Erreur marquage lu:", e); }
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage("");
    try {
      await setDoc(doc(db, "supportConversations", user.id), {
        userId: user.id,
        userName: user.name || "Utilisateur",
        userEmail: user.email || "",
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadByAdmin: true,
        unreadByUser: false,
      }, { merge: true });
      await addDoc(collection(db, "supportConversations", user.id, "messages"), {
        senderRole: "user",
        text,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Erreur envoi message support:", e);
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/discover/" className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold">Support Nawa</h1>
            <p className="text-xs text-gray-400">On vous repond generalement sous 24h</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-3">
        {loadingMessages ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <LifeBuoy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Une question, un bug a signaler, une idee pour ameliorer Nawa ?</p>
            <p className="text-gray-500 text-sm mt-1">Ecrivez-nous ci-dessous, on vous repond directement ici.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderRole === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${m.senderRole === "user" ? "bg-primary-600 text-white" : "bg-gray-800 text-gray-100"}`}>
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
            placeholder="Ecrivez votre message..."
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
