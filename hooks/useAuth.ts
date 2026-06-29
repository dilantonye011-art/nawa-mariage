"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Activer la persistance locale pour connexion instantanée
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...userData, id: fbUser.uid, email: fbUser.email || userData.email });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = useCallback(async (data: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email!, data.password);
      const fbUser = userCredential.user;
      const newUser: User = {
        id: fbUser.uid,
        email: data.email!,
        name: data.name || "",
        age: data.age || 25,
        gender: data.gender || "male",
        city: data.city || "",
        country: data.country || "",
        bio: data.bio || "",
        photos: [],
        verificationStatus: "none",
        isAdmin: data.email === "admin@nawa.com",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", fbUser.uid), newUser);
      await updateProfile(fbUser, { displayName: data.name });
      setUser(newUser);
      return true;
    } catch (e: any) {
      console.error("Register error:", e);
      alert("Erreur d'inscription: " + e.message);
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", fbUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUser({ ...userData, id: fbUser.uid, email: fbUser.email || userData.email });
        await updateDoc(doc(db, "users", fbUser.uid), { lastActive: new Date().toISOString() });
      }
      return true;
    } catch (e: any) {
      console.error("Login error:", e);
      alert("Erreur de connexion: " + e.message);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.id), updates);
      setUser({ ...user, ...updates, lastActive: new Date().toISOString() });
    } catch (e) {
      console.error("Update user error:", e);
    }
  }, [user]);

  // ⭐ Envoyer l'email de vérification Firebase (AVANT le return !)
  const sendVerificationEmail = useCallback(async () => {
    if (!auth.currentUser) return false;
    try {
      await sendEmailVerification(auth.currentUser, {
        url: "https://nawa-mariage.vercel.app/verify-email",
        handleCodeInApp: true,
      });
      return true;
    } catch (e) {
      console.error("Email verification error:", e);
      return false;
    }
  }, []);

  // ⭐ UN SEUL return à la fin
  return { user, loading, login, register, logout, updateUser, sendVerificationEmail, isAuthenticated: !!user };
}