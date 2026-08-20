import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { posts, getPostBySlug } from "@/lib/posts";
import { profiles } from "@/lib/profiles";
import { TrackedCta } from "@/components/TrackedCta";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Nawa Mariage`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();
  const profile = post.relatedProfile ? profiles[post.relatedProfile] : null;
  const pair = post.relatedProfiles ? post.relatedProfiles.map((id) => profiles[id]) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <article className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/blog/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-6">
          <ArrowLeft className="w-4 h-4" />Blog
        </Link>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <BookOpen className="w-4 h-4" />
          {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </div>
        {profile && <div className="text-5xl mb-4">{profile.emoji}</div>}
        {pair && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{pair[0].emoji}</span>
            <span className="text-2xl text-gray-400">×</span>
            <span className="text-5xl">{pair[1].emoji}</span>
            {post.matchType && (
              <span className={`ml-2 text-xs font-bold px-3 py-1 rounded-full ${post.matchType === "ideal" ? "bg-primary-600/20 text-primary-400" : "bg-yellow-500/20 text-yellow-500"}`}>
                {post.matchType === "ideal" ? "Match idéal 💫" : "Match complémentaire ⚖️"}
              </span>
            )}
          </div>
        )}
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
        <div className="prose dark:prose-invert max-w-none space-y-4">
          {post.content.map((block, i) => {
            const isHeading = block.length < 70 && !block.endsWith(".") && !block.endsWith(":");
            return isHeading ? (
              <h2 key={i} className="text-xl font-bold text-gray-900 dark:text-white pt-2">{block}</h2>
            ) : (
              <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">{block}</p>
            );
          })}
        </div>
        <div className="mt-10 p-6 bg-primary-600 rounded-2xl text-center">
          <p className="text-white font-medium mb-4">Découvrez votre propre profil de compatibilité</p>
          <TrackedCta href="/register/" location={`blog_${post.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-100 transition">
            <Sparkles className="w-4 h-4" />Faire le test gratuitement
          </TrackedCta>
        </div>
      </article>
    </div>
  );
}
