import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { posts } from "@/lib/posts";
import { profiles } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Blog | Nawa Mariage",
  description: "Conseils sur la compatibilité de couple, les profils de personnalité amoureuse et le mariage sérieux en Afrique francophone.",
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-6"><ArrowLeft className="w-4 h-4" />Accueil</Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Blog</h1>
        <div className="space-y-4">
          {sorted.map((post) => {
            const profile = post.relatedProfile ? profiles[post.relatedProfile] : null;
            return (
              <Link key={post.slug} href={`/blog/${post.slug}/`} className="block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <BookOpen className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <h2 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  {profile && <span>{profile.emoji}</span>}
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
