import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { cities, getCityBySlug } from "@/lib/cities";

export function generateStaticParams() {
  return cities.map((city) => ({ ville: city.slug }));
}

export function generateMetadata({ params }: { params: { ville: string } }): Metadata {
  const city = getCityBySlug(params.ville);
  if (!city) return {};
  const title = `Rencontre sérieuse à ${city.name} : trouvez votre profil de compatibilité | Nawa`;
  const description = `Rencontre sérieuse à ${city.name}, ${city.country} : trouvez un partenaire engagé pour le mariage via un profil de compatibilité.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function CityPage({ params }: { params: { ville: string } }) {
  const city = getCityBySlug(params.ville);
  if (!city) return notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4" />Accueil
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />{city.name}, {city.country}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Rencontre sérieuse à {city.name} : trouvez votre profil de compatibilité</h1>
          <p className="text-white/80 mb-6">{city.intro}</p>
          <Link href="/register/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-100 transition">
            <Sparkles className="w-4 h-4" />Faire le test de compatibilité
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pourquoi Nawa à {city.name} ?</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-10">{city.whyNawa}</p>

        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Questions fréquentes</h2>
        </div>
        <div className="space-y-4 mb-12">
          {city.faq.map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.question}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-primary-600 rounded-2xl text-center">
          <p className="text-white font-medium mb-4">Rejoignez les célibataires sérieux de {city.name} sur Nawa</p>
          <Link href="/register/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-100 transition">
            <Sparkles className="w-4 h-4" />Commencer gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}
