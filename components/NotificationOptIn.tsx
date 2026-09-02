"use client";
import { Bell, BellRing, BellOff } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToastContext } from "@/components/ToastProvider";

export function NotificationOptIn({ userId }: { userId: string }) {
  const { permission, enableNotifications } = usePushNotifications(userId);
  const { success, error: toastError } = useToastContext();

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
        <BellRing className="w-5 h-5 text-primary-600" />
        Notifications activees
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-sm text-gray-500">
        <BellOff className="w-5 h-5" />
        Notifications bloquees dans les parametres du navigateur
      </div>
    );
  }

  return (
    <button
      onClick={async () => {
        const ok = await enableNotifications();
        if (ok) success("Notifications activees !");
        else toastError("Impossible d'activer les notifications");
      }}
      className="w-full flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition text-left"
    >
      <Bell className="w-5 h-5 text-primary-600 flex-shrink-0" />
      <div>
        <p className="font-medium text-gray-900 dark:text-white text-sm">Activer les notifications</p>
        <p className="text-xs text-gray-500">Soyez alerte des nouveaux matchs et messages</p>
      </div>
    </button>
  );
}
