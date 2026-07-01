"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAdminStats } from "@/hooks/useAdminStats";
import { DailySignupsChart, GenderChart, AgeChart } from "@/components/AdminCharts";
import { Users, Heart, MessageCircle, Shield, UserPlus, Activity, MapPin, RefreshCw } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { stats, loading: statsLoading, refresh } = useAdminStats();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/discover/");
    }
  }, [loading, user, router]);

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  const statCards = [
    { label: "Utilisateurs", value: stats?.totalUsers || 0, icon: Users, color: "bg-blue-500" },
    { label: "Matches", value: stats?.totalMatches || 0, icon: Heart, color: "bg-rose-500" },
    { label: "Messages", value: stats?.totalMessages || 0, icon: MessageCircle, color: "bg-green-500" },
    { label: "Likes", value: stats?.totalLikes || 0, icon: Heart, color: "bg-purple-500" },
    { label: "Verifies", value: stats?.verifiedUsers || 0, icon: Shield, color: "bg-emerald-500" },
    { label: "En attente", value: stats?.pendingVerifications || 0, icon: Shield, color: "bg-amber-500" },
    { label: "Nouv. auj.", value: stats?.newUsersToday || 0, icon: UserPlus, color: "bg-cyan-500" },
    { label: "Actifs auj.", value: stats?.activeUsersToday || 0, icon: Activity, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/discover/" className="text-gray-400 hover:text-white transition">Retour</Link>
            <h1 className="font-bold text-xl">Dashboard Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/users/" className="px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition text-sm">Moderation</Link>
            <button onClick={refresh} className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 ${card.color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color.replace("bg-", "text-")}`} />
                </div>
                <span className="text-2xl font-bold">{card.value}</span>
              </div>
              <p className="text-sm text-gray-400">{card.label}</p>
            </div>
          ))}
        </div>

        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <DailySignupsChart data={stats.dailySignups} />
            <GenderChart data={stats.genderDistribution} />
            <AgeChart data={stats.ageDistribution} />
          </div>
        )}

        {stats && stats.topCities.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              Top Villes
            </h3>
            <div className="space-y-3">
              {stats.topCities.map((city, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{city.city}</span>
                      <span className="text-sm text-gray-400">{city.count} utilisateurs</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${(city.count / stats.totalUsers) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
