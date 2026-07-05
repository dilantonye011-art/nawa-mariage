import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "Nawa Mariage - Trouvez l'amour pour le mariage",
  description: "La première application de rencontre musulmane 100% axée sur le mariage en Afrique. Algorithme de compatibilité, profils vérifiés, messagerie sécurisée.",
  keywords: ["mariage", "rencontre", "musulman", "afrique", "amour", "compatibilité"],
  authors: [{ name: "Nawa Mariage" }],
  openGraph: {
    title: "Nawa Mariage",
    description: "Trouvez l'amour pour le mariage",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            if (window.__reloaded) return;
            if (!window.location.search.includes('v=') && !window.location.pathname.includes('/_next/')) {
              window.__reloaded = true;
              window.location.href = window.location.pathname + '?v=' + Date.now();
            }
          })();
        `}} />
        <ToastProvider>
          {children}
          <ServiceWorkerRegister />
          <PWAInstallPrompt />
        </ToastProvider>
      </body>
    </html>
  );
}

