"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

interface LikeData {
  likedBy: string[];
  liked: string[];
  matches: string[];
}

export function useLikes(userId?: string) {
  const [likesData, setLikesData] = useState<Record<string, LikeData>>({});

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = onSnapshot(doc(db, "likes", userId), (docSnap) => {
      if (docSnap.exists()) {
        setLikesData(prev => ({ ...prev, [userId]: docSnap.data() as LikeData }));
      }
    });
    return () => unsubscribe();
  }, [userId]);

  const likeUser = useCallback(async (targetId: string) => {
    if (!userId || userId === targetId) return null;
    try {
      const myRef = doc(db, "likes", userId);
      const mySnap = await getDoc(myRef);
      const myData = mySnap.exists() ? mySnap.data() as LikeData : { likedBy: [], liked: [], matches: [] };
      
      if (!myData.liked.includes(targetId)) myData.liked.push(targetId);

      const theirRef = doc(db, "likes", targetId);
      const theirSnap = await getDoc(theirRef);
      const theirData = theirSnap.exists() ? theirSnap.data() as LikeData : { likedBy: [], liked: [], matches: [] };
      
      const isMatch = theirData.liked.includes(userId);

      if (isMatch && !myData.matches.includes(targetId)) {
        myData.matches.push(targetId);
        theirData.matches.push(userId);
        theirData.likedBy.push(userId);
        await setDoc(myRef, myData);
        await setDoc(theirRef, theirData);
        return { isMatch: true };
      } else {
        theirData.likedBy.push(userId);
        await setDoc(myRef, myData);
        await setDoc(theirRef, theirData);
      }
      return { isMatch: false };
    } catch (e) {
      console.error("Like error:", e);
      return null;
    }
  }, [userId]);

  const hasLiked = useCallback((targetId: string) => {
    if (!userId || !likesData[userId]) return false;
    return likesData[userId].liked.includes(targetId);
  }, [userId, likesData]);

  const isMatched = useCallback((targetId: string) => {
    if (!userId || !likesData[userId]) return false;
    return likesData[userId].matches.includes(targetId);
  }, [userId, likesData]);

  return { likeUser, hasLiked, isMatched };
}