"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCompatibility } from "@/hooks/useCompatibility";
import { profileQuestions, profiles, ProfileId } from "@/lib/profiles";
import { ChevronRight, ChevronLeft, Check, Heart, Sparkles } from "lucide-react";

export default function QuestionnairePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { saveAnswers, hasCompleted, result } = useCompatibility(user?.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, ProfileId>>({});
  const [saving, setSaving] = useState(false);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">Se connecter</Link>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (hasCompleted && result) {
    const primary = profiles[result.primary];
    const idealMatch = profiles[primary.idealMatch];
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-4">{primary.emoji}</div>
          <p className="text-gray-400 mb-1">Vous êtes un profil</p>
          <h1 className="text-3xl font-bold mb-4">{primary.title}</h1>
          <p className="text-gray-400 mb-8">{primary.description}</p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-400 mb-2">Votre match idéal</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{idealMatch.emoji}</span>
              <span className="text-xl font-bold">{idealMatch.title}</span>
            </div>
          </div>

          <button onClick={() => router.push("/discover/")} className="px-6 py-3 bg-primary-600 rounded-xl font-medium hover:bg-primary-500 transition">
            Découvrir des profils compatibles
          </button>
        </div>
      </div>
    );
  }

  const q = profileQuestions[currentIndex];
  const progress = ((currentIndex + 1) / profileQuestions.length) * 100;

  const select = (profileId: ProfileId) => setSelectedAnswers(prev => ({ ...prev, [q.id]: profileId }));
  const next = () => currentIndex < profileQuestions.length - 1 && setCurrentIndex(p => p + 1);
  const prev = () => currentIndex > 0 && setCurrentIndex(p => p - 1);

  const submit = async () => {
    if (Object.keys(selectedAnswers).length < profileQuestions.length) {
      alert("Veuillez répondre à toutes les questions !");
      return;
    }
    setSaving(true);
    await saveAnswers(selectedAnswers);
    setSaving(false);
    router.push("/questionnaire/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-500" />
              Test de Compatibilité
            </h1>
            <span className="text-sm text-gray-400">{currentIndex + 1} / {profileQuestions.length}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button key={opt.profileId} onClick={() => select(opt.profileId)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAnswers[q.id] === opt.profileId ? "border-primary-500 bg-primary-600/20" : "border-gray-800 bg-gray-900 hover:border-gray-700"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAnswers[q.id] === opt.profileId ? "border-primary-500 bg-primary-500" : "border-gray-600"}`}>
                  {selectedAnswers[q.id] === opt.profileId && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="font-medium">{opt.label}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button onClick={prev} disabled={currentIndex === 0} className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />Précédent
          </button>
          {currentIndex === profileQuestions.length - 1 ? (
            <button onClick={submit} disabled={saving || selectedAnswers[q.id] === undefined} className="flex items-center gap-2 px-6 py-2 bg-primary-600 rounded-xl hover:bg-primary-500 transition disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles className="w-4 h-4" />Découvrir mon profil</>}
            </button>
          ) : (
            <button onClick={next} disabled={selectedAnswers[q.id] === undefined} className="flex items-center gap-2 px-6 py-2 bg-primary-600 rounded-xl hover:bg-primary-500 transition disabled:opacity-50">
              Suivant<ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
