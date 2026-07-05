"use client";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Heart, Shield, MessageCircle, Sparkles, Users, Check, ArrowRight, Star, TrendingUp } from "lucide-react";
import { useLandingStats } from "@/hooks/useLandingStats";

export default function LandingPage() {
  

  const { stats, loading } = useLandingStats();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* HERO */}
      <section className="relative overflow-hidden
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div> bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              La première app de rencontre musulmane 100% mariage
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez l&apos;amour pour le <span className="text-yellow-300">mariage</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Nawa Mariage connecte des célibataires musulmans en Afrique grâce à un algorithme de compatibilité avancé.
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

      {/* STATS RÉELLES */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: loading ? "..." : stats.users, label: "Célibataires" },
              { icon: Heart, value: loading ? "..." : stats.couples, label: "Couples formés" },
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

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Créez votre profil", desc: "Inscrivez-vous et complétez votre profil avec photos et préférences." },
              { step: "2", title: "Trouvez des matchs", desc: "Notre algorithme vous suggère des profils compatibles." },
              { step: "3", title: "Discutez et rencontrez", desc: "Messagerie sécurisée pour faire connaissance en toute sérénité." },
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

      {/* FONCTIONNALITÉS */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Pourquoi Nawa Mariage ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Profils vérifiés", desc: "Vérification d'identité pour plus de confiance." },
              { icon: Heart, title: "Compatibilité", desc: "Algorithme basé sur vos valeurs et critères." },
              { icon: MessageCircle, title: "Messagerie sécurisée", desc: "Discutez en toute confidentialité." },
              { icon: Check, title: "100% Mariage", desc: "Des membres sérieux et engagés." },
              { icon: Star, title: "Premium", desc: "Fonctionnalités avancées pour trouver plus vite." },
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Prêt à trouver l&apos;amour ?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Rejoignez des milliers de célibataires musulmans en Afrique.</p>
          <Link href="/register/" className="inline-block px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition shadow-xl">
            Créer mon compte gratuit
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <p>© Nawa Mariage. Trouvez l&apos;amour pour le mariage.</p>
      </footer>
    </div>
  );
}


