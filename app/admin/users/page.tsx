"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Shield, ShieldCheck, ShieldAlert, ArrowLeft, Search } from "lucide-react";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "none">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push("/discover/");
  }, [loading, user, router]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as User));
    setUsers(data);
  };

  const verifyUser = async (userId: string) => {
    await updateDoc(doc(db, "users", userId), { verificationStatus: "verified" });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: "verified" } : u));
  };

  const rejectUser = async (userId: string) => {
    await updateDoc(doc(db, "users", userId), { verificationStatus: "none" });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: "none" } : u));
  };

  const filteredUsers = users.filter(u => {
    if (filter !== "all" && u.verificationStatus !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard/" className="text-gray-400 hover:text-white transition"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-bold text-xl">Moderation Utilisateurs</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          {(["all", "pending", "verified", "none"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === f ? "bg-primary-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "verified" ? "Verifies" : "Non verifies"}
              <span className="ml-2 bg-gray-700 px-2 py-0.5 rounded-full text-xs">{users.filter(u => f === "all" || u.verificationStatus === f).length}</span>
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Genre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Ville</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-500">{u.name?.[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 capitalize">{u.gender}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{u.age}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{u.city}, {u.country}</td>
                    <td className="px-4 py-3">
                      {u.verificationStatus === "verified" ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-sm"><ShieldCheck className="w-4 h-4" />Verifie</span>
                      ) : u.verificationStatus === "pending" ? (
                        <span className="flex items-center gap-1 text-amber-400 text-sm"><ShieldAlert className="w-4 h-4" />En attente</span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-sm"><Shield className="w-4 h-4" />Non verifie</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {u.verificationStatus === "pending" && (
                          <>
                            <button onClick={() => verifyUser(u.id)} className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-600/30 transition">Verifier</button>
                            <button onClick={() => rejectUser(u.id)} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-600/30 transition">Rejeter</button>
                          </>
                        )}
                        {u.verificationStatus === "none" && (
                          <button onClick={() => verifyUser(u.id)} className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-lg text-xs font-medium hover:bg-primary-600/30 transition">Verifier</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">Aucun utilisateur trouve</div>
          )}
        </div>
      </div>
    </div>
  );
}
