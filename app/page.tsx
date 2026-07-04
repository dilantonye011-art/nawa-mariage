"use client";
import Link from "next/link";
import { Heart, Shield, MessageCircle, Sparkles, Users, Check, ArrowRight, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLandingStats } from "@/hooks/useLandingStats";

import { useEffect } from "react";

import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    // Forcer le cache bust si pas de paramètre
    if (!window.location.search.includes("v=")) {
      window.location.href = window.location.pathname + "?v=" + Date.now();
    }
  }, []);

  useEffect(() => {
    // Forcer le cache bust si pas de paramètre
    if (!window.location.search.includes("v=")) {
      window.location.href = window.location.pathname + "?v=" + Date.now();
    }
  }, []);

  const { stats, loading } = useLandingStats();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const features = [
    { icon: Sparkles, title: "Matching Intelligent", description: "Notre algorithme analyse vos préférences, votre localisation et votre personnalité pour vous suggérer les profils les plus compatibles.", color: "text-rose-500", bg: "bg-rose-500/10" },
    { icon: Shield, title: "Profils Vérifiés", description: "Chaque profil est vérifié manuellement par notre équipe. Pas de faux comptes, pas de robots — que des personnes sérieuses.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: MessageCircle, title: "Messagerie Sécurisée", description: "Discutez en toute confiance avec vos matchs. Messages chiffrés, appels vidéo intégrés et notifications en temps réel.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Heart, title: "Questionnaire de Compatibilité", description: "20 questions sur vos valeurs, votre mode de vie, votre religion et votre vision du mariage pour des matchs parfaits.", color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const steps = [
    { number: "01", title: "Créez votre profil", description: "Inscrivez-vous en 2 minutes avec vos photos et vos informations." },
    { number: "02", title: "Répondez au questionnaire", description: "20 questions pour affiner vos préférences et trouver l'âme sœur." },
    { number: "03", title: "Découvrez vos matchs", description: "Notre algorithme vous suggère les profils les plus compatibles." },
    { number: "04", title: "Discutez et rencontrez", description: "Envoyez des messages, faites des appels vidéo et rencontrez-vous." },
  ];

  const testimonials = [
    { name: "Amina & Karim", location: "Douala, Cameroun", text: "Nawa Mariage a changé notre vie. Nous nous sommes rencontrés en janvier et nous nous marions en décembre !", rating: 5 },
    { name: "Fatima & Omar", location: "Dakar, Sénégal", text: "Le questionnaire de compatibilité est incroyable. Nous avons 94% de match et c'est vrai, nous sommes faits l'un pour l'autre.", rating: 5 },
    { name: "Aïcha & Moussa", location: "Abidjan, Côte d'Ivoire", text: "Enfin une application sérieuse pour les musulmans qui veulent se marier. Pas de perte de temps, que du sérieux.", rating: 5 },
  ];

  const formatNumber = (n: number) => n.toLocaleString("fr-FR") + "+";

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-xl text-gray-900">Nawa Mariage</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login/" className="hidden sm:block text-gray-600 hover:text-gray-900 transition font-medium">Se connecter</Link>
            <Link href="/register/" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20">Commencer gratuitement</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full blur-3xl opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />L'application #1 pour le mariage en Afrique
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Trouvez l'<span className="text-primary-600">amour</span> pour le <span className="text-primary-600">mariage</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nawa Mariage connecte des célibataires sérieux prêts pour le mariage. Algorithme de compatibilité, vérification d'identité et messagerie sécurisée.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register/" className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition shadow-xl shadow-primary-600/20 flex items-center gap-2">
                  <Heart className="w-5 h-5" />Commencer gratuitement
                </Link>
                <Link href="/discover/" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition flex items-center gap-2">
                  <Users className="w-5 h-5" />Voir les profils
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">{loading ? "..." : formatNumber(stats.totalUsers)}</span> célibataires nous font confiance
                </p>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl transform rotate-3 opacity-20" />
                <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Sarah, 24 ans</h3>
                      <p className="text-sm text-gray-500">Douala, Cameroun</p>
                    </div>
                    <div className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">94% Match</div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-emerald-500" /><span>Profil vérifié</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-emerald-500" /><span>Questionnaire complété</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-emerald-500" /><span>Active aujourd'hui</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium">J'aime</button>
                    <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">Passer</button>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500" fill="currentColor" /><span className="text-sm font-bold">Nouveau match !</span></div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100" style={{ animation: 'bounce 3s infinite 1s' }}>
                  <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /><span className="text-sm font-bold">Profil vérifié</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Stats en temps réel</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{loading ? "..." : formatNumber(stats.totalUsers)}</div>
              <div className="text-gray-400">Célibataires inscrits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{loading ? "..." : formatNumber(stats.totalCouples)}</div>
              <div className="text-gray-400">Couples formés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{loading ? "..." : stats.countriesCount}</div>
              <div className="text-gray-400">Pays représentés</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{loading ? "..." : stats.verifiedRate + "%"}</div>
              <div className="text-gray-400">Profils vérifiés</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">4 étapes simples pour trouver votre âme sœur</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-gray-100 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {i < 3 && <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2"><ArrowRight className="w-6 h-6 text-gray-300" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir Nawa Mariage ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">La première application de rencontre musulmane 100% axée sur le mariage</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ils ont trouvé l'amour</h2>
            <p className="text-xl text-gray-600">Des histoires vraies de couples formés sur Nawa Mariage</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 text-amber-400" fill="currentColor" />)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Prêt à trouver votre âme sœur ?</h2>
          <p className="text-xl text-white/80 mb-10">Rejoignez {loading ? "..." : formatNumber(stats.totalUsers)} célibataires musulmans sérieux et commencez votre histoire dès aujourd'hui.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register/" className="px-10 py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-xl">Créer mon compte gratuit</Link>
            <Link href="/discover/" className="px-10 py-4 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 transition border-2 border-white/20">Voir les profils</Link>
          </div>
          <p className="text-white/60 mt-6 text-sm">Gratuit • Sans engagement • Profils vérifiés</p>
        </div>
      </section>

      <footer className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><Heart className="w-4 h-4 text-white" fill="currentColor" /></div>
                <span className="font-bold text-white">Nawa Mariage</span>
              </div>
              <p className="text-gray-400 text-sm">La première application de rencontre musulmane 100% axée sur le mariage en Afrique.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/discover/" className="hover:text-white transition">Découvrir</Link></li>
                <li><Link href="/login/" className="hover:text-white transition">Se connecter</Link></li>
                <li><Link href="/register/" className="hover:text-white transition">S'inscrire</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy/" className="hover:text-white transition">Confidentialité</Link></li>
                <li><Link href="/terms/" className="hover:text-white transition">Conditions d'utilisation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">contact@nawa-mariage.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">© 2026 Nawa Mariage. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}



