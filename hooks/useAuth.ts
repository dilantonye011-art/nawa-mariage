"use client";
import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

// Fonction utilitaire pour nettoyer le localStorage
function cleanupStorage() {
  try {
    const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
    // Limiter à 50 utilisateurs max
    if (users.length > 50) {
      users.splice(0, users.length - 50);
      localStorage.setItem("nawa_users", JSON.stringify(users));
    }
    
    // Nettoyer les messages anciens (plus de 30 jours)
    const messages = JSON.parse(localStorage.getItem("nawa_messages") || "[]");
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentMessages = messages.filter((m: any) => 
      new Date(m.createdAt).getTime() > thirtyDaysAgo
    );
    if (recentMessages.length !== messages.length) {
      localStorage.setItem("nawa_messages", JSON.stringify(recentMessages));
    }
  } catch (e) {
    console.error("Cleanup error:", e);
  }
}

// Fonction pour créer un compte admin par défaut
export function createDefaultAdmin() {
  if (typeof window === "undefined") return;
  
  const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
  
  // Vérifier si l'admin existe déjà
  const adminExists = users.find((u: User) => u.email === "admin@nawa.com");
  
  if (!adminExists) {
    const admin: User = {
      id: "admin_default",
      email: "admin@nawa.com",
      name: "Admin Nawa",
      age: 30,
      gender: "male",
      city: "Douala",
      country: "Cameroun",
      bio: "Administrateur du site",
      photos: [],
      verificationStatus: "verified",
      isAdmin: true,  // ⭐ C'est ça qui donne les droits admin
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    users.push(admin);
    localStorage.setItem("nawa_users", JSON.stringify(users));
    console.log("Compte admin créé : admin@nawa.com / n'importe quel mot de passe");
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

createDefaultAdmin(); // ⭐ Ajoute cette ligne

    cleanupStorage();
    try {
      const stored = localStorage.getItem("nawa_current_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.photos) parsed.photos = [];
        setUser(parsed);
      }
    } catch (e) {
      console.error("Error loading user:", e);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    try {
      const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
      const found = users.find((u: User) => u.email === email);
      if (found) {
        if (!found.photos) found.photos = [];
        setUser(found);
        localStorage.setItem("nawa_current_user", JSON.stringify(found));
        return true;
      }
    } catch (e) {
      console.error("Login error:", e);
    }
    return false;
  }, []);

  const register = useCallback(async (data: Partial<User> & { password: string }): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    try {
      const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
      if (users.find((u: User) => u.email === data.email)) return false;
      
      const newUser: User = {
        id: "user_" + Date.now(),
        email: data.email!,
        name: data.name || "",
        age: data.age || 25,
        gender: data.gender || "male",
        city: data.city || "",
        country: data.country || "",
        bio: data.bio || "",
        photos: [],
        verificationStatus: "none",
        isAdmin: false,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        ...data,
      };
      
      users.push(newUser);
      cleanupStorage(); // Nettoyer avant de sauvegarder
      localStorage.setItem("nawa_users", JSON.stringify(users));
      setUser(newUser);
      localStorage.setItem("nawa_current_user", JSON.stringify(newUser));
      return true;
    } catch (e) {
      console.error("Register error:", e);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("nawa_current_user");
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      
      const updated = { ...prev, ...updates, lastActive: new Date().toISOString() };
      if (!updated.photos) updated.photos = [];
      
      if (typeof window !== "undefined") {
        try {
          cleanupStorage(); // Nettoyer avant de sauvegarder
          localStorage.setItem("nawa_current_user", JSON.stringify(updated));
          const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
          const idx = users.findIndex((u: User) => u.id === updated.id);
          if (idx >= 0) {
            users[idx] = updated;
            localStorage.setItem("nawa_users", JSON.stringify(users));
          }
        } catch (e) {
          console.error("Update user error:", e);
          // Si quota dépassé, supprimer les photos des autres utilisateurs
          if (e instanceof DOMException && e.name === "QuotaExceededError") {
            alert("Stockage plein ! Supprimez des photos ou nettoyez les données.");
          }
        }
      }
      
      return updated;
    });
  }, []);

  return { user, loading, login, register, logout, updateUser, isAuthenticated: !!user };
}