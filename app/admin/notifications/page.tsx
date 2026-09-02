"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToastContext } from "@/components/ToastProvider";
import { ArrowLeft, Send, Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { success, error: toastError } = useToastContext();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number } | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push("/discover/");
  }, [loading, user, router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !user) return;
    setSending(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/broadcast-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, url: url || undefined, requesterId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Echec de l'envoi");
      setLastResult({ sent: data.sent || 0, failed: data.failed || 0 });
      success(`Notification envoyee a ${data.sent || 0} appareil(s)`);
      setTitle(""); setBody(""); setUrl("");
    } catch (e: any) {
      toastError(e.message || "Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  if (loading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard/" className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-xl flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-500" />
            Notification push
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-400 text-sm mb-6">
          Envoyee immediatement a tous les utilisateurs ayant active les notifications sur leur appareil.
        </p>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Nouveaux profils compatibles pres de chez vous !"
              maxLength={65}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Ex: Decouvrez qui vient de rejoindre Nawa dans votre ville."
              maxLength={150}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-600 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Lien au clic (optionnel)</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://nawa-mariage.vercel.app/discover/"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !title.trim() || !body.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 rounded-xl font-medium hover:bg-primary-500 transition disabled:opacity-50"
          >
            {sending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" />Envoyer a tous les utilisateurs</>}
          </button>
        </form>

        {lastResult && (
          <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-xl text-sm">
            <p className="text-green-400">✓ {lastResult.sent} notification(s) envoyee(s) avec succes</p>
            {lastResult.failed > 0 && <p className="text-yellow-400 mt-1">⚠ {lastResult.failed} echec(s) (appareils desinscrits, tokens nettoyes automatiquement)</p>}
          </div>
        )}
      </div>
    </div>
  );
}
