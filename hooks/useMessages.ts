"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, query, where, onSnapshot, addDoc, 
  orderBy, doc, updateDoc 
} from "firebase/firestore";
import type { Message, Conversation } from "@/types";

export function useMessages(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos: Conversation[] = [];
      snapshot.forEach((docSnap) => {
        convos.push({ ...docSnap.data(), id: docSnap.id } as Conversation);
      });
      setConversations(convos);
    });
    return () => unsubscribe();
  }, [userId]);

  const listenToMessages = useCallback((conversationId: string) => {
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((docSnap) => {
        msgs.push({ ...docSnap.data(), id: docSnap.id } as Message);
      });
      setMessages(prev => ({ ...prev, [conversationId]: msgs }));
    });
    return unsubscribe;
  }, []);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!userId || !content.trim()) return;
    try {
      await addDoc(collection(db, "messages"), {
        conversationId, senderId: userId, content: content.trim(),
        createdAt: new Date().toISOString(), read: false,
      });
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: { content: content.trim(), createdAt: new Date().toISOString() },
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Send message error:", e);
    }
  }, [userId]);

  const createConversation = useCallback(async (participantIds: string[]) => {
    if (!userId) return null;
    const allParticipants = Array.from(new Set([userId, ...participantIds]));
    try {
      const newConvo = await addDoc(collection(db, "conversations"), {
        participants: allParticipants,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCount: 0,
      });
      return newConvo.id;
    } catch (e) {
      console.error("Create conversation error:", e);
      return null;
    }
  }, [userId]);

  return { conversations, messages, sendMessage, createConversation, listenToMessages };
}