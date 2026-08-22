"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Shield, MessageCircle, Sparkles, Users, Check, ArrowRight, Star, TrendingUp } from "lucide-react";
import { useLandingStats } from "@/hooks/useLandingStats";
import { ThemeToggle } from "@/components/ThemeToggle";
import { analytics } from "@/lib/analytics";

export default function LandingPage() {
  const { stats, loading } = useLandingStats();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nawa Mariage",
    url: "https://nawa-mariage.vercel.app",
    description: "Application de rencontre serieuse pour l'Afrique francophone et sa diaspora, basee sur la compatibilite de valeurs plutot que le swipe, dediee au mariage.",
    areaServed: ["Cameroun", "Cote d'Ivoire", "Senegal", "Republique democratique du Congo", "France", "Belgique", "Canada"],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                La premiere app 100% mariage en Afrique francophone
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Nawa, l&apos;app qui vous rapproche des personnes <span className="text-yellow-300">vraiment compatibles</span> avec vous
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Fini le swipe a l&apos;aveugle. Nawa analyse vos valeurs et votre vision du couple pour vous mettre en relation avec des celibataires serieux, prets pour un engagement durable, partout en Afrique francophone et dans la diaspora.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register/" onClick={() => analytics.ctaClicked("hero")} className="px-8 py-4 bg-white text-primary-700 rounded-2xl font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                  Decouvrir mon profil de compatibilite
                </Link>
                <Link href="#methode" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition border border-white/20">
                  Comment ca marche
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-square">
                <Image src="/images/hero-bouquet.jpg" alt="Bouquet de mariee et alliance, symbole d'un engagement serieux sur Nawa" fill className="object-cover" priority />
              </div>
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

      {/* NOTRE METHODE */}
      <section id="methode" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-800 mb-4">
              <Image src="/images/rings-hands.jpg" alt="Echange d'alliance, symbole d'engagement" fill className="object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">La compatibilite avant tout, pas l&apos;apparence</h2>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Sur Nawa, votre profil ne se limite pas a des photos. Avant de vous mettre en relation avec qui que ce soit, nous cherchons a comprendre ce qui compte vraiment pour vous.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", emoji: "📝", title: "Repondez a notre test de compatibilite", desc: "Quelques questions simples, deux minutes chrono, sur votre vision du couple et vos priorites de vie." },
              { step: "2", emoji: "💫", title: "Decouvrez votre profil et votre match ideal", desc: "Vous obtenez votre profil de compatibilite ainsi que le profil qui vous correspond le mieux." },
              { step: "3", emoji: "✅", title: "Echangez avec des profils compatibles et verifies", desc: "Nous vous mettons en relation avec des celibataires dont le profil rejoint le votre, tous valides par notre equipe." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 italic mt-12 max-w-xl mx-auto">
            Parce qu&apos;un mariage reussi commence avant tout par une vraie compatibilite, pas par un like.
          </p>
          <div className="text-center mt-8">
            <Link href="/register/" onClick={() => analytics.ctaClicked("methode")} className="inline-block px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition shadow-xl">
              Faire le test de compatibilite
            </Link>
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
              { icon: Heart, title: "Compatibilite profonde", desc: "Un profil base sur vos valeurs, pas seulement vos criteres." },
              { icon: MessageCircle, title: "Messagerie securisee", desc: "Discutez en toute confidentialite." },
              { icon: Check, title: "100% Mariage", desc: "Des membres serieux et engages, pas de conversations sans lendemain." },
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
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square order-2 md:order-1">
              <Image src="/images/doves.jpg" alt="Deux colombes et des alliances, symbole d'union durable" fill className="object-cover" />
            </div>
            <div className="text-center md:text-left order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pret a trouver l&apos;amour ?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Rejoignez des milliers de celibataires serieux en Afrique francophone et dans la diaspora.</p>
              <Link href="/register/" onClick={() => analytics.ctaClicked("cta_final")} className="inline-block px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 transition shadow-xl">
                Creer mon compte gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <p> Nawa Mariage. Trouvez l&apos;amour pour le mariage.</p>
        <Link href="/rencontre/" className="text-primary-400 hover:text-primary-300 transition">Nawa dans votre pays</Link>
      </footer>
    </div>
  );
}
