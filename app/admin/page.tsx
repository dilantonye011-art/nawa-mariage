"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import type { User } from "@/types";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    
    const stored = localStorage.getItem("nawa_current_user");
    const allUsers = JSON.parse(localStorage.getItem("nawa_users") || "[]");
    setUsers(allUsers);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentAdmin(parsed);
    }
  }, []);

  // Rediriger si pas admin
  if (mounted && (!currentAdmin || !currentAdmin.isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Accès interdit</h1>
          <p className="text-gray-500 mb-6">Vous devez être administrateur pour accéder à cette page.</p>
          <Link href="/" className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const verifyUser = (userId: string) => {
    const updated = users.map(u => 
      u.id === userId ? { ...u, verificationStatus: "verified" as const } : u
    );
    setUsers(updated);
    localStorage.setItem("nawa_users", JSON.stringify(updated));
  };

  const rejectUser = (userId: string) => {
    const updated = users.map(u => 
      u.id === userId ? { ...u, verificationStatus: "rejected" as const } : u
    );
    setUsers(updated);
    localStorage.setItem("nawa_users", JSON.stringify(updated));
  };

  const stats = {
    total: users.length,
    verified: users.filter(u => u.verificationStatus === "verified").length,
    pending: users.filter(u => u.verificationStatus === "pending").length,
    none: users.filter(u => u.verificationStatus === "none").length,
  };

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><p>Chargement...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="font-bold text-xl text-gray-900 dark:text-white">Tableau de bord Admin</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{stats.total} utilisateurs</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-500">Total inscrits</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-green-100 dark:border-green-900">
            <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
            <p className="text-sm text-gray-500">Vérifiés</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-yellow-100 dark:border-yellow-900">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">En attente</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-600">{stats.none}</p>
            <p className="text-sm text-gray-500">Non vérifiés</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white">Liste des utilisateurs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <span className="font-bold text-primary-600">{user.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.age} ans</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.city}, {user.country}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      {user.verificationStatus === "verified" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs">
                          <CheckCircle className="w-3 h-3" /> Vérifié
                        </span>
                      )}
                      {user.verificationStatus === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      )}
                      {user.verificationStatus === "none" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                          Non vérifié
                        </span>
                      )}
                      {user.verificationStatus === "rejected" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs">
                          <XCircle className="w-3 h-3" /> Refusé
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.verificationStatus !== "verified" && (
                          <button
                            onClick={() => verifyUser(user.id)}
                            className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg hover:bg-green-200 transition"
                            title="Vérifier"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {user.verificationStatus !== "rejected" && (
                          <button
                            onClick={() => rejectUser(user.id)}
                            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg hover:bg-red-200 transition"
                            title="Refuser"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun utilisateur inscrit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}