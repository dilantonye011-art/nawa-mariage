// lib/questions.ts
import type { Question } from "@/types";

export const questions: Question[] = [
  // 🏛️ VALEURS (4 questions)
  {
    id: "values_1",
    category: "values",
    question: "Quelle est votre vision du mariage ?",
    options: [
      "Union sacrée avant tout",
      "Partenariat d'égal à égal",
      "Aventure à deux",
      "Engagement pragmatique"
    ]
  },
  {
    id: "values_2",
    category: "values",
    question: "L'honnêteté dans le couple, c'est :",
    options: [
      "Dire tout, toujours",
      "Dire l'essentiel, avec tact",
      "Protéger l'autre parfois",
      "Ça dépend des situations"
    ]
  },
  {
    id: "values_3",
    category: "values",
    question: "Votre priorité dans la vie :",
    options: [
      "Famille avant tout",
      "Carrière et réussite",
      "Équilibre famille/travail",
      "Épanouissement personnel"
    ]
  },
  {
    id: "values_4",
    category: "values",
    question: "Face à un conflit, vous :",
    options: [
      "Discutez immédiatement",
      "Attendez de vous calmer",
      "Cherchez un compromis",
      "Évitez le sujet"
    ]
  },

  // 🏠 MODE DE VIE (4 questions)
  {
    id: "lifestyle_1",
    category: "lifestyle",
    question: "Votre rythme de vie idéal :",
    options: [
      "Très actif, toujours en mouvement",
      "Équilibré avec du temps calme",
      "Tranquille, zen",
      "Spontané, sans planning"
    ]
  },
  {
    id: "lifestyle_2",
    category: "lifestyle",
    question: "Vos week-ends sont plutôt :",
    options: [
      "Sorties et découvertes",
      "Famille et proches",
      "Repos à la maison",
      "Sport et activités"
    ]
  },
  {
    id: "lifestyle_3",
    category: "lifestyle",
    question: "Votre rapport à l'argent :",
    options: [
      "Épargne stricte",
      "Équilibre prudent",
      "Profiter de la vie",
      "Investir pour l'avenir"
    ]
  },
  {
    id: "lifestyle_4",
    category: "lifestyle",
    question: "Votre alimentation :",
    options: [
      "Halal strict",
      "Halal quand possible",
      "Végétarien/végétalien",
      "Pas de restriction particulière"
    ]
  },

  // 🕌 RELIGION (4 questions)
  {
    id: "religion_1",
    category: "religion",
    question: "Pratique religieuse :",
    options: [
      "Prières quotidiennes + mosquée",
      "Prières régulières",
      "Occasionnelle",
      "Spiritualité sans pratique"
    ]
  },
  {
    id: "religion_2",
    category: "religion",
    question: "L'éducation religieuse des enfants :",
    options: [
      "Très importante, dès le plus jeune âge",
      "Importante, avec douceur",
      "À leur choix plus tard",
      "Pas une priorité"
    ]
  },
  {
    id: "religion_3",
    category: "religion",
    question: "Le rôle de la religion dans le couple :",
    options: [
      "Fondement de l'union",
      "Guide moral important",
      "Respect mutuel des croyances",
      "Affaire personnelle"
    ]
  },
  {
    id: "religion_4",
    category: "religion",
    question: "Ramadan et fêtes religieuses :",
    options: [
      "Observance stricte et joyeuse",
      "Importantes, famille réunie",
      "Moment de recueillement",
      "Pas de pratique"
    ]
  },

  // 👨‍👩‍👧‍👦 FAMILLE (4 questions)
  {
    id: "family_1",
    category: "family",
    question: "Nombre d'enfants souhaité :",
    options: [
      "3 ou plus",
      "2 enfants",
      "1 enfant",
      "Pas d'enfant"
    ]
  },
  {
    id: "family_2",
    category: "family",
    question: "Rôle des beaux-parents :",
    options: [
      "Très proches, famille élargie",
      "Respectueux mais indépendants",
      "Visites occasionnelles",
      "Distance souhaitée"
    ]
  },
  {
    id: "family_3",
    category: "family",
    question: "Répartition des tâches ménagères :",
    options: [
      "Traditionnelle",
      "Partagée équitablement",
      "Selon les compétences",
      "Externalisée (aide ménagère)"
    ]
  },
  {
    id: "family_4",
    category: "family",
    question: "Vivre avec la belle-famille :",
    options: [
      "Acceptable temporairement",
      "Jamais",
      "Si nécessaire",
      "Pas de problème"
    ]
  },

  // 🎭 PERSONNALITÉ (4 questions)
  {
    id: "personality_1",
    category: "personality",
    question: "Vous êtes plutôt :",
    options: [
      "Extraverti et sociable",
      "Ambivert (selon l'humeur)",
      "Introverti mais chaleureux",
      "Réservé et posé"
    ]
  },
  {
    id: "personality_2",
    category: "personality",
    question: "Vos hobbies principaux :",
    options: [
      "Sport et plein air",
      "Lecture et culture",
      "Cuisine et création",
      "Voyages et aventure"
    ]
  },
  {
    id: "personality_3",
    category: "personality",
    question: "Votre tempérament :",
    options: [
      "Passionné et intense",
      "Calme et réfléchi",
      "Drôle et décontracté",
      "Organisé et méthodique"
    ]
  },
  {
    id: "personality_4",
    category: "personality",
    question: "Votre défaut principal :",
    options: [
      "Trop perfectionniste",
      "Trop sensible",
      "Têtue/têtu",
      "Procrastinateur"
    ]
  }
];