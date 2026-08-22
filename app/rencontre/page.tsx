import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { cities } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Nawa dans votre pays | Rencontre sérieuse en Afrique francophone",
  description: "Retrouvez Nawa dans votre ville, en Afrique francophone comme dans la diaspora. Rencontre sérieuse et compatibilité de valeurs, partout où vous êtes.",
};

export default function RencontreIndexPage() {
  const afrique = cities.filter((c) => c.type === "afrique");
  const diaspora = cities.filter((c) => c.type === "diaspora");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-6">
          <ArrowLeft className="w-4 h-4" />Accueil
        </Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">Trouvez Nawa dans votre ville</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10">
          L&apos;application est disponible partout en Afrique francophone et dans la diaspora. Rejoignez les célibataires sérieux près de chez vous.
        </p>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-600" />Afrique francophone
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {afrique.map((city) => (
            <Link key={city.slug} href={`/rencontre/${city.slug}/`} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-5 py-4 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{city.name}</p>
                <p className="text-sm text-gray-500">{city.country}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-600" />Diaspora
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {diaspora.map((city) => (
            <Link key={city.slug} href={`/rencontre/${city.slug}/`} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-5 py-4 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{city.name}</p>
                <p className="text-sm text-gray-500">{city.country}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
