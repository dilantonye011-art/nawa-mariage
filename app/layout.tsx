import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
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
  metadataBase: new URL("https://nawa-mariage.vercel.app"),
  title: "Nawa Mariage - L'app qui vous rapproche des personnes compatibles",
  description: "Nawa Mariage analyse vos valeurs et votre vision du couple pour vous mettre en relation avec des celibataires serieux, prets pour un engagement durable, en Afrique francophone et dans la diaspora.",
  keywords: ["mariage", "rencontre serieuse", "compatibilite", "afrique francophone", "amour", "couple"],
  authors: [{ name: "Nawa Mariage" }],
  openGraph: {
    title: "Nawa Mariage - La compatibilite avant tout",
    description: "Decouvrez votre profil de compatibilite et rencontrez des celibataires serieux, vraiment alignes avec vos valeurs.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nawa Mariage - La compatibilite avant tout",
    description: "Decouvrez votre profil de compatibilite et rencontrez des celibataires serieux.",
    images: ["/og-image.png"],
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
        <ThemeProvider>
          <Navbar />
          <ToastProvider>
            {children}
            <ServiceWorkerRegister />
            <PWAInstallPrompt />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
