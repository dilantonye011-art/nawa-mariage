export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: "male" | "female";
  city: string;
  country: string;
  bio: string;
  photos: string[];
  verificationStatus: "none" | "pending" | "verified" | "rejected";
  isAdmin: boolean;
  createdAt: string;
  lastActive: string;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
  isMatch: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
}

export type ToastType = "success" | "info" | "like" | "match" | "message" | "error";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// types/index.ts - Ajouter ces interfaces

export interface Question {
  id: string;
  category: "values" | "lifestyle" | "religion" | "family" | "personality";
  question: string;
  options: string[];
}

export interface UserAnswers {
  userId: string;
  answers: Record<string, number>; // questionId -> index de la réponse
  completedAt: string;
}

export interface CompatibilityResult {
  overallScore: number; // 0-100
  categoryScores: Record<string, number>;
  details: string[];
}
