"use client";
import Link from "next/link";
import { Heart, Shield, MessageCircle, Sparkles, Users, Check, ArrowRight, Star, TrendingUp } from "lucide-react";
import { useLandingStats } from "@/hooks/useLandingStats";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const { stats, loading } = useLandingStats();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              La premiere app de rencontre musulmane 100% mariage
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez l&apos;amour pour le <span className="text-yellow-300">mariage</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Nawa Mariage connecte des celibataires musulmans en Afrique grace a un algorithme de compatibilite avance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/" className="px-8 py-4 bg-white text-primary-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                Commencer gratuitement
              </Link>
              <Link href="/login/" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition border border-white/20">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: loading ? "..." : stats.users, label: "Celibataires" },
              { icon: Heart, value: loading ? "..." : stats.couples, label: "Couples formes" },
              { icon: Star, value: loading ? "..." : stats.matches, label: "Matchs par jour" },
              { icon: TrendingUp, value: "94%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Comment ca marche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Creez votre profil", desc: "Inscrivez-vous et completez votre profil avec photos et preferences." },
              { step: "2", title: "Trouvez des matchs", desc: "Notre algorithme vous suggere des profils compatibles." },
              { step: "3", title: "Discutez et rencontrez", desc: "Messagerie securisee pour faire connaissance en toute serenite." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FONCTIONNALITES */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Pourquoi Nawa Mariage ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Profils verifies", desc: "Verification d'identite pour plus de confiance." },
              { icon: Heart, title: "Compatibilite", desc: "Algorithme base sur vos valeurs et criteres." },
              { icon: MessageCircle, title: "Messagerie securisee", desc: "Discutez en toute confidentialite." },
              { icon: Check, title: "100% Mariage", desc: "Des membres serieux et engages." },
              { icon: Star, title: "Premium", desc: "Fonctionnalites avancees pour trouver plus vite." },
              { icon: ArrowRight, title: "Simple", desc: "Interface intuitive et moderne." },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                <feature.icon className="w-8 h-8 text-primary-600 mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pret a trouver l&apos;amour ?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Rejoignez des milliers de celibataires musulmans en Afrique.</p>
          <Link href="/register/" className="inline-block px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition shadow-xl">
            Creer mon compte gratuit
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <p> Nawa Mariage. Trouvez l&apos;amour pour le mariage.</p>
      </footer>
    </div>
  );
}