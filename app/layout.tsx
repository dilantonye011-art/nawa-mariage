import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";
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
  <head>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
  </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased">
        <ToastProvider>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var originalError = window.onerror;
          window.onerror = function(msg, url, line, col, error) {
            if (msg && (msg.toString().includes('ChunkLoadError') || msg.toString().includes('Loading chunk') || msg.toString().includes('404'))) {
              console.log('Chunk manquant, reload forcé...');
              window.location.reload(true);
              return true;
            }
            if (originalError) return originalError(msg, url, line, col, error);
          };
        })();
      `}} />{children}
          <ServiceWorkerRegister />
          <PWAInstallPrompt />        </ToastProvider>
</body>
    </html>
  );
}


