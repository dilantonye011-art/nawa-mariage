import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions frequentes sur Nawa Mariage",
};

const faqs = [
  { q: "Est-ce que Nawa Mariage est gratuit ?", a: "L inscription et la decouverte des profils sont gratuites. Des fonctionnalites premium seront disponibles prochainement." },
  { q: "Comment fonctionne la verification ?", a: "Notre equipe verifie manuellement chaque profil pour garantir l authenticite des membres." },
  { q: "Puis-je discuter sans match ?", a: "Non, la messagerie est reservee aux matches mutuels pour proteger la securite de tous." },
  { q: "Comment supprimer mon compte ?", a: "Rendez-vous dans votre profil et cliquez sur le bouton de deconnexion. La suppression complete sera disponible bientot." },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-6"><ArrowLeft className="w-4 h-4" />Accueil</Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">FAQ</h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3"><HelpCircle className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-gray-900 dark:text-white">{faq.q}</h2></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
