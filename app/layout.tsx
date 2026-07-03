import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/ToastContainer"
import { ToastProvider } from "@/components/ToastProvider";;
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import { ToastProvider } from "@/components/ToastProvider";;
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt"
import { ToastProvider } from "@/components/ToastProvider";;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1b4b" },
  ],
};

export const metadata: Metadata = {
  title: {
    template: "%s | Nawa Mariage",
    default: "Nawa Mariage - Trouvez l amour serieux pour le mariage",
  },
  description: "Nawa Mariage est le site de rencontre serieux pour le mariage. Profils verifies, matching intelligent.",
  keywords: ["mariage", "rencontre serieuse", "site de rencontre", "amour", "couple", "musulman", "afrique", "senegal"],
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head><link rel="apple-touch-icon" href="/icon-192x192.png" /></head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
        <ToastProvider>
        {children}
        <ToastContainer />
        <ServiceWorkerRegister />
        <PWAInstallPrompt />
              </ToastProvider>
</body>
    </html>
  );
}

