"use client";
import { useState, useEffect, useCallback } from "react";

export function useNotifications(userId?: string) {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined") return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (e) {
      console.error("Notification permission error:", e);
      return false;
    }
  }, []);

  return {
    permission,
    unreadCount,
    setUnreadCount,
    requestPermission,
  };
}