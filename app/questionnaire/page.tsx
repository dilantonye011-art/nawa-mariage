"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCompatibility } from "@/hooks/useCompatibility";
import { questions, categoryLabels, categoryColors } from "@/lib/questions";
import { ChevronRight, ChevronLeft, Check, Heart, Sparkles } from "lucide-react";

export default function QuestionnairePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { saveAnswers, hasCompleted } = useCompatibility(user?.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
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

  if (hasCompleted) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Questionnaire complété !</h1>
        <p className="text-gray-400 mb-6">Vos réponses ont été enregistrées. Le matching intelligent va maintenant utiliser vos préférences pour trouver votre âme sœur.</p>
        <button onClick={() => router.push("/discover/")} className="px-6 py-3 bg-primary-600 rounded-xl font-medium hover:bg-primary-500 transition">
          Découvrir des profils
        </button>
      </div>
    </div>
  );

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const select = (i: number) => setSelectedAnswers(prev => ({ ...prev, [q.id]: i }));
  const next = () => currentIndex < questions.length - 1 && setCurrentIndex(p => p + 1);
  const prev = () => currentIndex > 0 && setCurrentIndex(p => p - 1);

  const submit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Veuillez répondre à toutes les questions !");
      return;
    }
    setSaving(true);
    await saveAnswers(selectedAnswers);
    setSaving(false);
    router.push("/discover/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-500" />
              Questionnaire de Compatibilité
            </h1>
            <span className="text-sm text-gray-400">{currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <span className={`inline-block px-3 py-1 ${categoryColors[q.category]} bg-opacity-20 text-white text-xs rounded-full mb-4`}>
          {categoryLabels[q.category]}
        </span>
        <h2 className="text-xl font-bold mb-6">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => select(i)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAnswers[q.id] === i ? "border-primary-500 bg-primary-600/20" : "border-gray-800 bg-gray-900 hover:border-gray-700"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAnswers[q.id] === i ? "border-primary-500 bg-primary-500" : "border-gray-600"}`}>
                  {selectedAnswers[q.id] === i && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="font-medium">{opt}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button onClick={prev} disabled={currentIndex === 0} className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />Précédent
          </button>
          {currentIndex === questions.length - 1 ? (
            <button onClick={submit} disabled={saving || selectedAnswers[q.id] === undefined} className="flex items-center gap-2 px-6 py-2 bg-primary-600 rounded-xl hover:bg-primary-500 transition disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Sparkles className="w-4 h-4" />Terminer</>}
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
