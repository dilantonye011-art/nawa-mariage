import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

// Ces 3 variables viennent du fichier JSON de compte de service genere
// dans Firebase Console > Parametres du projet > Comptes de service >
// "Generer une nouvelle cle privee". A definir dans Vercel (Settings >
// Environment Variables), jamais commitees dans le repo.
//
// Initialisation volontairement paresseuse (lazy) : si on appelait cert()
// au chargement du module, le build Next.js echouerait des que ces
// variables ne sont pas encore definies. En ne l'executant qu'au premier
// appel reel (dans un handler d'API route), le site continue de builder
// et de se deployer normalement meme avant que les cles soient ajoutees -
// seul l'envoi de notifications restera indisponible jusque-la.
let adminApp: App | null = null;

function getAdminApp(): App {
  if (adminApp) return adminApp;
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Variables d'environnement manquantes: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY. " +
      "A configurer dans Vercel avec les valeurs du compte de service Firebase."
    );
  }

  adminApp = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return adminApp;
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminMessaging() {
  return getMessaging(getAdminApp());
}
