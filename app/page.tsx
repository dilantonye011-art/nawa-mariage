"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Shield, MessageCircle, Users, Star, MapPin, CheckCircle, ArrowRight, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { VerificationBadge } from "@/components/VerificationBadge";

export default function HomePage() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [verifiedProfiles, setVerifiedProfiles] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, couples: 0, countries: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("nawa_dark_mode");
    if (saved) setDarkMode(saved === "true");
    const users = JSON.parse(localStorage.getItem("nawa_users") || "[]");
    const verified = users.filter((u: any) => u.verificationStatus === "verified").slice(0, 4);
    setVerifiedProfiles(verified);
    setStats({ users: users.length + 1247, couples: Math.floor(users.length / 3) + 89, countries: 12 });
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    if (typeof window !== "undefined") localStorage.setItem("nawa_dark_mode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><Heart className="w-4 h-4 text-white fill-white" /></div>
            <span className="font-serif font-bold text-xl text-primary-700 dark:text-primary-400">Nawa Mariage</span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            {user ? (
              <Link href="/discover/" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition">Decouvrir</Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login/" className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary-600 transition">Connexion</Link>
                <Link href="/register/" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition">S inscrire</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-950 dark:to-primary-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /><span>Profils verifies - Intentions serieuses uniquement</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Trouvez l amour <span className="text-primary-600">serieux</span> pour le <span className="text-secondary-600">mariage</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Nawa Mariage connecte des celibataires prets pour le mariage. Algorithme de compatibilite, verification d identite et messagerie securisee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register/" className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-medium text-lg hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center gap-2">
              <Heart className="w-5 h-5" />Commencer gratuitement
            </Link>
            <Link href="/discover/" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl font-medium text-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 transition flex items-center gap-2">
              <Users className="w-5 h-5" />Voir les profils
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>Inscription gratuite</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>Profils verifies</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>Matching intelligent</span></div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div><div className="text-3xl md:text-4xl font-bold text-primary-600">{stats.users.toLocaleString()}+</div><div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Celibataires inscrits</div></div>
          <div><div className="text-3xl md:text-4xl font-bold text-secondary-600">{stats.couples.toLocaleString()}+</div><div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Couples formes</div></div>
          <div><div className="text-3xl md:text-4xl font-bold text-primary-600">{stats.countries}</div><div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pays representes</div></div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-white mb-12">Pourquoi choisir Nawa Mariage ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4"><Shield className="w-6 h-6 text-primary-600" /></div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Profils verifies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Chaque profil est verifie manuellement. Pas de faux comptes.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center mb-4"><Star className="w-6 h-6 text-secondary-600" /></div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Matching intelligent</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Algorithme base sur vos valeurs, religion et projets de vie.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4"><MessageCircle className="w-6 h-6 text-primary-600" /></div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Messagerie securisee</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Discutez en toute securite. Appels video integres.</p>
            </div>
          </div>
        </div>
      </section>

      {verifiedProfiles.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-white mb-4">Profils verifies recents</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-12">Ces membres ont verifie leur identite</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {verifiedProfiles.map((profile) => (
                <Link key={profile.id} href="/discover/" className="group">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-primary-300 transition">
                    <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center">
                      {profile.photos?.[0] ? <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" /> : <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{profile.name}</h3>
                        <VerificationBadge status="verified" size="sm" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{profile.city}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Pret a rencontrer l amour de votre vie ?</h2>
          <p className="text-primary-100 mb-8 text-lg">Rejoignez Nawa Mariage aujourd hui. L inscription est gratuite.</p>
          <Link href="/register/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-2xl font-medium text-lg hover:bg-primary-50 transition shadow-lg">
            <Heart className="w-5 h-5" />Creer mon profil<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4"><Heart className="w-5 h-5 text-primary-400 fill-primary-400" /><span className="font-serif font-bold text-white">Nawa Mariage</span></div>
            <p className="text-sm">Le site de rencontre serieux pour le mariage.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Navigation</h4>
            <div className="space-y-2 text-sm">
              <Link href="/discover/" className="block hover:text-primary-400 transition">Decouvrir</Link>
              <Link href="/blog/" className="block hover:text-primary-400 transition">Blog</Link>
              <Link href="/faq/" className="block hover:text-primary-400 transition">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link href="/privacy/" className="block hover:text-primary-400 transition">Confidentialite</Link>
              <Link href="/terms/" className="block hover:text-primary-400 transition">Conditions</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <p className="text-sm">contact@nawamariage.com</p>
            <p className="text-sm">Dakar, Senegal</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">&copy; 2026 Nawa Mariage. Tous droits reserves.</div>
      </footer>
    </div>
  );
}
