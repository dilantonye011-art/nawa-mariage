"use client";
import { useState, useEffect, useCallback } from "react";
import type { Like } from "@/types";

export function useLikes(userId?: string) {
  const [likes, setLikes] = useState<Like[]>([]);
  const [matches, setMatches] = useState<Like[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !userId) return;
    const allLikes = JSON.parse(localStorage.getItem("nawa_likes") || "[]");
    const userLikes = allLikes.filter((l: Like) => l.fromUserId === userId || l.toUserId === userId);
    setLikes(userLikes);
    setMatches(userLikes.filter((l: Like) => l.isMatch));
  }, [userId]);

  const likeUser = useCallback((targetId: string) => {
    if (!userId || userId === targetId) return null;
    const allLikes = JSON.parse(localStorage.getItem("nawa_likes") || "[]");
    const existing = allLikes.find((l: Like) => l.fromUserId === userId && l.toUserId === targetId);
    if (existing) return null;

    const reverseLike = allLikes.find((l: Like) => l.fromUserId === targetId && l.toUserId === userId);
    const isMatch = !!reverseLike;

    const newLike: Like = {
      id: "like_" + Date.now(), fromUserId: userId, toUserId: targetId,
      createdAt: new Date().toISOString(), isMatch,
    };
    allLikes.push(newLike);
    if (isMatch && reverseLike) reverseLike.isMatch = true;
    localStorage.setItem("nawa_likes", JSON.stringify(allLikes));
    setLikes((prev) => [...prev, newLike]);
    if (isMatch) setMatches((prev) => [...prev, newLike]);
    return { isMatch };
  }, [userId]);

  const hasLiked = useCallback((targetId: string) => {
    return likes.some((l) => l.fromUserId === userId && l.toUserId === targetId);
  }, [likes, userId]);

  const isMatched = useCallback((targetId: string) => {
    return matches.some((l) => (l.fromUserId === userId && l.toUserId === targetId) || (l.fromUserId === targetId && l.toUserId === userId));
  }, [matches, userId]);

  return { likes, matches, likeUser, hasLiked, isMatched };
}
