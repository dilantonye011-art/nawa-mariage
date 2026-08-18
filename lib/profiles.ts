export type ProfileId =
  | "ancrage_familial"
  | "aventurier_engage"
  | "batisseur_projet"
  | "coeur_spirituel"
  | "complice_quotidien"
  | "protecteur_discret";

export interface CompatibilityProfile {
  id: ProfileId;
  emoji: string;
  title: string;
  description: string;
  idealMatch: ProfileId;
  complementaryMatch: ProfileId;
}

export const profiles: Record<ProfileId, CompatibilityProfile> = {
  ancrage_familial: {
    id: "ancrage_familial",
    emoji: "🏡",
    title: "Ancrage Familial",
    description:
      "Pour vous, le mariage se construit avant tout autour de la famille, de la stabilité et de la transmission. Vous cherchez un partenaire qui partage cette vision d'un foyer solide et de racines profondes.",
    idealMatch: "complice_quotidien",
    complementaryMatch: "coeur_spirituel",
  },
  aventurier_engage: {
    id: "aventurier_engage",
    emoji: "🌍",
    title: "Aventurier Engagé",
    description:
      "Vous voulez un mariage qui n'exclut pas le mouvement, la découverte et l'évolution personnelle. Vous cherchez un partenaire qui construit une vie à deux sans renoncer à grandir et explorer.",
    idealMatch: "batisseur_projet",
    complementaryMatch: "complice_quotidien",
  },
  batisseur_projet: {
    id: "batisseur_projet",
    emoji: "🎯",
    title: "Bâtisseur de Projet",
    description:
      "Vous envisagez le couple comme une équipe tournée vers des objectifs communs : carrière, finances, ambitions partagées. Vous cherchez un partenaire aussi investi que vous dans la construction d'un avenir concret.",
    idealMatch: "aventurier_engage",
    complementaryMatch: "protecteur_discret",
  },
  coeur_spirituel: {
    id: "coeur_spirituel",
    emoji: "🕊️",
    title: "Cœur Spirituel",
    description:
      "Vos valeurs spirituelles ou religieuses sont au centre de votre vision du mariage. Vous cherchez un partenaire qui partage — ou respecte profondément — ce socle dans la construction de votre couple.",
    idealMatch: "ancrage_familial",
    complementaryMatch: "protecteur_discret",
  },
  complice_quotidien: {
    id: "complice_quotidien",
    emoji: "☕",
    title: "Complice du Quotidien",
    description:
      "Pour vous, un mariage réussi se vit dans les petits moments : la complicité, l'humour, la présence de chaque jour. Vous cherchez un partenaire avec qui la vie simple devient précieuse.",
    idealMatch: "ancrage_familial",
    complementaryMatch: "aventurier_engage",
  },
  protecteur_discret: {
    id: "protecteur_discret",
    emoji: "🛡️",
    title: "Protecteur Discret",
    description:
      "Vous privilégiez la loyauté, la sécurité affective et la discrétion. Vous cherchez un partenaire posé, fiable, avec qui construire une relation solide loin du bruit.",
    idealMatch: "coeur_spirituel",
    complementaryMatch: "batisseur_projet",
  },
};

export const profileList: CompatibilityProfile[] = Object.values(profiles);

export interface ProfileQuestionOption {
  profileId: ProfileId;
  label: string;
}

export interface ProfileQuestion {
  id: string;
  question: string;
  options: ProfileQuestionOption[];
}

// Chaque question propose une option par profil (ordre mélangé pour éviter
// qu'un profil occupe toujours la même position). La réponse choisie vote
// pour un profil ; le profil avec le plus de votes devient le profil
// dominant, le deuxième le profil secondaire.
export const profileQuestions: ProfileQuestion[] = [
  {
    id: "q1",
    question: "Comment imaginez-vous un dimanche idéal en couple, dans 10 ans ?",
    options: [
      { profileId: "ancrage_familial", label: "En famille, à la maison, entouré des enfants" },
      { profileId: "aventurier_engage", label: "En train de découvrir un nouvel endroit ensemble" },
      { profileId: "batisseur_projet", label: "À travailler sur un projet commun (business, maison, épargne)" },
      { profileId: "coeur_spirituel", label: "Dans un moment de recueillement ou de pratique partagée" },
      { profileId: "complice_quotidien", label: "À rire autour d'un café, sans rien faire de spécial" },
      { profileId: "protecteur_discret", label: "Tranquillement, juste tous les deux, loin du monde extérieur" },
    ],
  },
  {
    id: "q2",
    question: "Qu'est-ce qui vous ferait le plus confiance en une personne ?",
    options: [
      { profileId: "ancrage_familial", label: "Sa capacité à créer un foyer chaleureux" },
      { profileId: "aventurier_engage", label: "Son ouverture d'esprit et son envie de grandir" },
      { profileId: "batisseur_projet", label: "Sa détermination et sa vision claire de l'avenir" },
      { profileId: "coeur_spirituel", label: "Ses valeurs profondes et sa sincérité" },
      { profileId: "complice_quotidien", label: "Sa capacité à me faire rire au quotidien" },
      { profileId: "protecteur_discret", label: "Sa loyauté et sa discrétion" },
    ],
  },
  {
    id: "q3",
    question: "Qu'est-ce qui vous ferait le plus peur dans une relation ?",
    options: [
      { profileId: "ancrage_familial", label: "L'instabilité, l'absence de repères" },
      { profileId: "aventurier_engage", label: "La routine qui étouffe" },
      { profileId: "batisseur_projet", label: "Le manque d'ambition commune" },
      { profileId: "coeur_spirituel", label: "Le désalignement de valeurs" },
      { profileId: "complice_quotidien", label: "La distance émotionnelle" },
      { profileId: "protecteur_discret", label: "La trahison ou le manque de discrétion" },
    ],
  },
  {
    id: "q4",
    question: "Face à l'argent du foyer, votre priorité est plutôt :",
    options: [
      { profileId: "batisseur_projet", label: "Investir et faire fructifier pour construire l'avenir" },
      { profileId: "ancrage_familial", label: "Sécuriser le confort et les besoins de la famille" },
      { profileId: "protecteur_discret", label: "Garder une épargne solide, sans prendre de risque" },
      { profileId: "aventurier_engage", label: "Se garder les moyens de vivre de nouvelles expériences" },
      { profileId: "complice_quotidien", label: "Profiter raisonnablement du quotidien, sans trop calculer" },
      { profileId: "coeur_spirituel", label: "Vivre simplement, l'essentiel n'est pas matériel" },
    ],
  },
  {
    id: "q5",
    question: "En cas de désaccord dans le couple, vous préférez :",
    options: [
      { profileId: "complice_quotidien", label: "En parler avec légèreté, puis passer à autre chose" },
      { profileId: "batisseur_projet", label: "Trouver rapidement une solution concrète et avancer" },
      { profileId: "protecteur_discret", label: "En discuter calmement, en privé, sans éclat" },
      { profileId: "coeur_spirituel", label: "Revenir à nos valeurs communes pour trancher" },
      { profileId: "ancrage_familial", label: "Penser d'abord à l'équilibre de la famille" },
      { profileId: "aventurier_engage", label: "Prendre du recul, parfois en changeant d'air" },
    ],
  },
  {
    id: "q6",
    question: "Quel rôle la famille élargie (parents, belle-famille) doit-elle jouer ?",
    options: [
      { profileId: "ancrage_familial", label: "Un rôle central, très présente dans notre vie" },
      { profileId: "protecteur_discret", label: "Présente mais avec des limites claires et respectées" },
      { profileId: "coeur_spirituel", label: "Un lien de respect et de transmission des valeurs" },
      { profileId: "batisseur_projet", label: "Un soutien ponctuel, sans interférer dans nos décisions" },
      { profileId: "aventurier_engage", label: "Un lien affectueux mais nous restons indépendants" },
      { profileId: "complice_quotidien", label: "Comme des proches qu'on aime voir souvent, sans pression" },
    ],
  },
  {
    id: "q7",
    question: "Ce qui vous rendrait le plus fier/fière dans 20 ans :",
    options: [
      { profileId: "ancrage_familial", label: "Avoir bâti une famille unie et des enfants épanouis" },
      { profileId: "aventurier_engage", label: "Avoir vécu et grandi à travers de nombreuses expériences" },
      { profileId: "batisseur_projet", label: "Avoir construit quelque chose de concret et durable" },
      { profileId: "coeur_spirituel", label: "Être resté(e) fidèle à ses valeurs et à sa foi" },
      { profileId: "complice_quotidien", label: "Avoir partagé des milliers de petits bonheurs simples" },
      { profileId: "protecteur_discret", label: "Avoir protégé et soutenu les siens, sans faire de bruit" },
    ],
  },
];

export interface CompatibilityProfileResult {
  primary: ProfileId;
  secondary: ProfileId;
  scores: Record<ProfileId, number>;
}

export function computeProfile(
  answers: Record<string, ProfileId>
): CompatibilityProfileResult | null {
  const scores = {} as Record<ProfileId, number>;
  (Object.keys(profiles) as ProfileId[]).forEach((id) => (scores[id] = 0));

  Object.values(answers).forEach((profileId) => {
    if (profileId in scores) scores[profileId] += 1;
  });

  const ranked = (Object.keys(scores) as ProfileId[]).sort(
    (a, b) => scores[b] - scores[a]
  );
  if (ranked.length === 0 || scores[ranked[0]] === 0) return null;

  return { primary: ranked[0], secondary: ranked[1], scores };
}

// Score de compatibilité (0-100) entre deux profils dominants, basé sur la
// matrice match idéal / match complémentaire.
export function profileCompatibilityScore(a: ProfileId, b: ProfileId): number {
  if (a === b) return 85;
  if (profiles[a].idealMatch === b) return 100;
  if (profiles[a].complementaryMatch === b) return 75;
  if (profiles[b].idealMatch === a) return 100;
  if (profiles[b].complementaryMatch === a) return 75;
  return 50;
}
