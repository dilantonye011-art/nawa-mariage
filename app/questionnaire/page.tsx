"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCompatibility } from "@/hooks/useCompatibility";
import { ChevronRight, ChevronLeft, Check, Heart } from "lucide-react";
import Link from "next/link";

export default function QuestionnairePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { questions, saveAnswers, hasCompleted } = useCompatibility(user?.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Link href="/login/" className="px-6 py-3 bg-primary-600 text-white rounded-xl">
          Se connecter
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Veuillez répondre à toutes les questions !");
      return;
    }

    setSaving(true);
    await saveAnswers(selectedAnswers);
    setSaving(false);
    router.push("/discover/");
  };

  const categoryLabels: Record<string, string> = {
    values: "Valeurs",
    lifestyle: "Mode de vie",
    religion: "Religion",
    family: "Famille",
    personality: "Personnalité",
  };

  const categoryColors: Record<string, string> = {
    values: "bg-amber-500",
    lifestyle: "bg-emerald-500",
    religion: "bg-sky-500",
    family: "bg-rose-500",
    personality: "bg-violet-500",
  };

  // Si déjà complété
  if (hasCompleted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Questionnaire complété !</h1>
          <p className="text-gray-400 mb-6">
            Vos réponses ont été enregistrées. Le matching intelligent va maintenant utiliser vos préférences pour trouver votre âme sœur.
          </p>
          <button
            onClick={() => router.push("/discover/")}
            className="px-6 py-3 bg-primary-600 rounded-xl font-medium hover:bg-primary-500 transition"
          >
            Découvrir des profils
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-500" />
              Questionnaire de Compatibilité
            </h1>
            <span className="text-sm text-gray-400">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Category badge */}
        <span className={`inline-block px-3 py-1 ${categoryColors[currentQuestion.category]} bg-opacity-20 text-white text-xs rounded-full mb-4`}>
          {categoryLabels[currentQuestion.category]}
        </span>

        <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedAnswers[currentQuestion.id] === index
                  ? "border-primary-500 bg-primary-600/20"
                  : "border-gray-800 bg-gray-900 hover:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "border-primary-500 bg-primary-500"
                      : "border-gray-600"
                  }`}
                >
                  {selectedAnswers[currentQuestion.id] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-xl hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={saving || selectedAnswers[currentQuestion.id] === undefined}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 rounded-xl hover:bg-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Terminer
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion.id] === undefined}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 rounded-xl hover:bg-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}