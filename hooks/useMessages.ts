"use client";
import { useState, useEffect, useCallback } from "react";
import type { Message, Conversation } from "@/types";

export function useMessages(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    if (typeof window === "undefined" || !userId) return;
    const convos = JSON.parse(localStorage.getItem("nawa_conversations") || "[]");
    const userConvos = convos.filter((c: Conversation) => c.participants.includes(userId));
    setConversations(userConvos);
    const msgs = JSON.parse(localStorage.getItem("nawa_messages") || "[]");
    const msgsByConvo: Record<string, Message[]> = {};
    userConvos.forEach((c: Conversation) => {
      msgsByConvo[c.id] = msgs.filter((m: Message) => m.conversationId === c.id).sort((a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });
    setMessages(msgsByConvo);
  }, [userId]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (!userId || !content.trim()) return;
    const newMsg: Message = {
      id: "msg_" + Date.now(), conversationId, senderId: userId,
      content: content.trim(), createdAt: new Date().toISOString(), read: false,
    };
    const allMsgs = JSON.parse(localStorage.getItem("nawa_messages") || "[]");
    allMsgs.push(newMsg);
    localStorage.setItem("nawa_messages", JSON.stringify(allMsgs));
    setMessages((prev) => ({ ...prev, [conversationId]: [...(prev[conversationId] || []), newMsg] }));

    const convos = JSON.parse(localStorage.getItem("nawa_conversations") || "[]");
    const idx = convos.findIndex((c: Conversation) => c.id === conversationId);
    if (idx >= 0) {
      convos[idx].lastMessage = newMsg;
      convos[idx].updatedAt = newMsg.createdAt;
      localStorage.setItem("nawa_conversations", JSON.stringify(convos));
      setConversations((prev) => prev.map((c) => c.id === conversationId ? { ...c, lastMessage: newMsg, updatedAt: newMsg.createdAt } : c));
    }
  }, [userId]);

  const createConversation = useCallback((participantIds: string[]) => {
    if (!userId) return null;
    const allParticipants = [...new Set([userId, ...participantIds])];
    const convos = JSON.parse(localStorage.getItem("nawa_conversations") || "[]");
    const existing = convos.find((c: Conversation) => c.participants.length === allParticipants.length && c.participants.every((p: string) => allParticipants.includes(p)));
    if (existing) return existing.id;
    const newConvo: Conversation = {
      id: "convo_" + Date.now(), participants: allParticipants,
      updatedAt: new Date().toISOString(), unreadCount: 0,
    };
    convos.push(newConvo);
    localStorage.setItem("nawa_conversations", JSON.stringify(convos));
    setConversations((prev) => [...prev, newConvo]);
    return newConvo.id;
  }, [userId]);

  return { conversations, messages, sendMessage, createConversation };
}
