"use client";
import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("nawa_current_user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
    const found = users.find((u: User) => u.email === email);
    if (found) { setUser(found); localStorage.setItem("nawa_current_user", JSON.stringify(found)); return true; }
    return false;
  }, []);

  const register = useCallback(async (data: Partial<User> & { password: string }): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
    if (users.find((u: User) => u.email === data.email)) return false;
    const newUser: User = {
      id: "user_" + Date.now(), email: data.email!, name: data.name || "",
      age: data.age || 25, gender: data.gender || "male", city: data.city || "",
      country: data.country || "", bio: data.bio || "", photos: [],
      verificationStatus: "none", isAdmin: false,
      createdAt: new Date().toISOString(), lastActive: new Date().toISOString(),
      ...data,
    };
    users.push(newUser);
    localStorage.setItem("nawa_users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("nawa_current_user", JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("nawa_current_user");
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates, lastActive: new Date().toISOString() };
      if (typeof window !== "undefined") {
        localStorage.setItem("nawa_current_user", JSON.stringify(updated));
        const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
        const idx = users.findIndex((u: User) => u.id === updated.id);
        if (idx >= 0) users[idx] = updated;
        localStorage.setItem("nawa_users", JSON.stringify(users));
      }
      return updated;
    });
  }, []);

  return { user, loading, login, register, logout, updateUser, isAuthenticated: !!user };
}
