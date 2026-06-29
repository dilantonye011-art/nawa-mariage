"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    age: "", 
    gender: "male" as "male" | "female", 
    city: "", 
    country: "", 
    bio: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, sendVerificationEmail } = useAuth();
  const router = useRouter();

  const updateField = (field: string, value: string) => { 
    setFormData((prev) => ({ ...prev, [field]: value })); 
    setError(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(""); 
    setLoading(true);
    
    const success = await register({ ...formData, age: parseInt(formData.age) || 25 });
    setLoading(false);
    
    if (success) {
      // Optionnel : envoyer l'email de vérification
      // await sendVerificationEmail();
      // alert("Un email de vérification a été envoyé ! Vérifiez votre boîte Gmail.");
      
      router.push("/discover/");
    } else {
      setError("Cet email est deja utilise");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-8">
          <ArrowLeft className="w-4 h-4" />Retour
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-600 fill-primary-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Creer un compte</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Etape {step} sur 2</p>
          </div>
          <div className="flex gap-2 mb-6">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"}`} />
          </div>
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }}>
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prenom</label>
                  <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="Votre prenom" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="vous@exemple.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => updateField("password", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition pr-12" placeholder="8 caracteres minimum" minLength={8} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">Continuer</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                    <input type="number" min={18} max={100} value={formData.age} onChange={(e) => updateField("age", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="25" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
                    <select value={formData.gender} onChange={(e) => updateField("gender", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition">
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                    <input type="text" value={formData.city} onChange={(e) => updateField("city", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="Dakar" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
                    <input type="text" value={formData.country} onChange={(e) => updateField("country", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="Senegal" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea value={formData.bio} onChange={(e) => updateField("bio", e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition resize-none" rows={3} placeholder="Decrivez-vous..." maxLength={500} />
                </div>
                {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl">{error}</div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">Retour</button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50">{loading ? "Creation..." : "Creer mon compte"}</button>
                </div>
              </div>
            )}
          </form>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Deja un compte ? <Link href="/login/" className="text-primary-600 hover:text-primary-700 font-medium">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}