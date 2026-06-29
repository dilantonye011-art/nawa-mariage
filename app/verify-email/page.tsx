"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode, getAuth } from "firebase/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (oobCode) {
      const auth = getAuth();
      applyActionCode(auth, oobCode)
        .then(() => {
          alert("Email vérifié avec succès !");
          router.push("/login/");
        })
        .catch((error) => {
          console.error("Verification error:", error);
          alert("Lien de vérification invalide ou expiré.");
        });
    }
  }, [oobCode, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Vérification de votre email en cours...</p>
      </div>
    </div>
  );
}