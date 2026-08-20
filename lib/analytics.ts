import { track } from "@vercel/analytics";

// Evenements du funnel d'acquisition et d'activation Nawa.
// Chaque etape cle est nommee explicitement pour pouvoir suivre le taux de
// conversion entre chaque palier dans le dashboard Vercel Analytics.
export const analytics = {
  ctaClicked: (location: string) => track("cta_clicked", { location }),
  signupStarted: () => track("signup_started"),
  signupCompleted: (method: string) => track("signup_completed", { method }),
  questionnaireStarted: () => track("questionnaire_started"),
  questionnaireCompleted: (primaryProfile: string) =>
    track("questionnaire_completed", { primaryProfile }),
  profileResultViewed: (primaryProfile: string, idealMatch: string) =>
    track("profile_result_viewed", { primaryProfile, idealMatch }),
  discoverViewed: () => track("discover_viewed"),
};
