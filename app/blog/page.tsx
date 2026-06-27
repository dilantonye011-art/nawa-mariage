import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conseils et astuces pour trouver l amour serieux",
};

const posts = [
  { title: "Comment trouver l amour au Senegal", date: "2026-06-15", excerpt: "Decouvrez les meilleures pratiques pour rencontrer quelqu un de serieux." },
  { title: "Les 5 signes d une relation saine", date: "2026-06-10", excerpt: "Apprenez a identifier les bases d un mariage reussi." },
  { title: "Pourquoi choisir Nawa Mariage", date: "2026-06-05", excerpt: "La difference entre une rencontre serieuse et une rencontre banale." },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-6"><ArrowLeft className="w-4 h-4" />Accueil</Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Blog</h1>
        <div className="space-y-4">
          {posts.map((post, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2"><BookOpen className="w-4 h-4" />{post.date}</div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
