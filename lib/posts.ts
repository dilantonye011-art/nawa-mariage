import { ProfileId, profiles } from "@/lib/profiles";

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  relatedProfile?: ProfileId;
  content: string[];
}

export const posts: BlogPost[] = [
  {
    slug: "profil-ancrage-familial",
    title: "Vous êtes un profil Ancrage Familial ? Voici ce qui compte vraiment pour vous en couple",
    metaDescription: "Découvrez ce qui définit le profil de compatibilité Ancrage Familial et ce que cette vision du couple implique dans une relation durable.",
    excerpt: "Pour ce profil, le mariage se construit avant tout autour de la famille et de la stabilité.",
    date: "2026-08-25",
    relatedProfile: "ancrage_familial",
    content: [
      "Si le test de compatibilité Nawa vous a attribué le profil Ancrage Familial, ce n'est pas un hasard : chacune de vos réponses a révélé une même priorité, celle de bâtir un foyer stable, chaleureux et durable.",
      "Pour vous, le mariage n'est pas qu'une union entre deux personnes. C'est la fondation d'une famille, avec tout ce que cela suppose de transmission, de repères et de continuité. Vous imaginez naturellement les dimanches en famille, les enfants qui grandissent dans un cadre sécurisant, et une maison qui reste le point d'ancrage de tous.",
      "Ce n'est pas un manque d'ambition personnelle ou de goût pour la nouveauté. C'est une hiérarchie de priorités claire : la solidité du foyer passe avant le reste.",
      "Ce qui compte vraiment pour vous en couple",
      "Trois éléments reviennent systématiquement chez les profils Ancrage Familial : la fiabilité de l'autre sur la durée, la capacité à créer un environnement chaleureux au quotidien, et un rapport apaisé à la famille élargie. Un partenaire imprévisible, ou qui place son indépendance bien au-dessus de la vie de famille, créera chez vous une forme d'insécurité, même si l'attirance est réelle au départ.",
      "Avec qui êtes-vous le plus compatible ?",
      "Le profil qui s'accorde le mieux avec le vôtre est le Complice du Quotidien : cette personne partage votre attachement aux petits moments simples et à la chaleur du foyer, sans pour autant reproduire exactement votre façon de voir les choses — ce qui équilibre la relation plutôt que de la dupliquer. Le Cœur Spirituel est également un bon complément : vos deux visions du mariage reposent sur un socle de valeurs et de stabilité proche.",
      "Faites le test de compatibilité Nawa pour découvrir votre profil complet et les célibataires sérieux qui partagent votre vision du couple.",
    ],
  },
  {
    slug: "profil-aventurier-engage",
    title: "Aventurier Engagé en amour : comment concilier liberté et engagement",
    metaDescription: "Le profil Aventurier Engagé veut un mariage qui n'exclut pas la découverte. Comprendre cette vision du couple et les partenaires les plus compatibles.",
    excerpt: "Ce profil veut un mariage qui laisse de la place à la découverte et à l'évolution personnelle.",
    date: "2026-08-27",
    relatedProfile: "aventurier_engage",
    content: [
      "L'Aventurier Engagé est souvent mal compris : on suppose à tort que vouloir du mouvement et de la découverte dans sa vie signifie fuir l'engagement. C'est l'inverse. Ce profil veut un mariage solide, mais refuse qu'il devienne synonyme de routine figée.",
      "Ce qui vous anime, c'est l'idée qu'un couple peut grandir ensemble sans s'enfermer : découvrir de nouveaux endroits, apprendre, évoluer professionnellement ou personnellement, tout en construisant une relation stable. Le mariage, pour vous, n'est pas un point d'arrêt mais un projet vivant.",
      "La tension à anticiper",
      "Le principal défi de ce profil est de trouver un partenaire qui ne confond pas votre besoin de mouvement avec un manque d'investissement. Un partenaire trop attaché à la routine ou à l'immobilisme peut vite se sentir délaissé, alors que vous, de votre côté, vous sentirez étouffé par trop de rigidité.",
      "Avec qui êtes-vous le plus compatible ?",
      "Le Bâtisseur de Projet est votre match idéal : vous partagez tous les deux une orientation vers l'avenir et la construction, lui à travers des objectifs concrets, vous à travers l'exploration — une combinaison qui avance dans la même direction sans se marcher dessus. Le Complice du Quotidien fonctionne aussi très bien en complément : sa légèreté équilibre votre besoin de nouveauté par une capacité à profiter du moment présent, où que vous soyez.",
      "Faites le test de compatibilité Nawa pour découvrir votre profil complet et les célibataires sérieux qui partagent votre vision du couple.",
    ],
  },
  {
    slug: "profil-batisseur-de-projet",
    title: "Bâtisseur de Projet : quand le couple devient une équipe",
    metaDescription: "Le profil Bâtisseur de Projet envisage le couple comme une équipe tournée vers des objectifs communs. Découvrez ce que cela implique en compatibilité.",
    excerpt: "Pour ce profil, le couple fonctionne comme une équipe tournée vers des objectifs communs.",
    date: "2026-08-29",
    relatedProfile: "batisseur_projet",
    content: [
      "Chez le Bâtisseur de Projet, l'amour ne suffit pas à lui seul : encore faut-il qu'il se traduise en direction commune. Ce profil envisage naturellement le couple comme une équipe, avec des objectifs partagés — carrière, projets, stabilité financière, ambitions de vie.",
      "Ce n'est pas une vision froide ou calculatrice du mariage. C'est une façon de sécuriser la relation par des preuves concrètes d'engagement : construire ensemble, avancer ensemble, se projeter ensemble sur des horizons précis plutôt que sur des promesses vagues.",
      "Ce que ce profil recherche vraiment",
      "Un partenaire aussi investi que vous dans la construction d'un avenir concret, capable de fixer des objectifs communs et de s'y tenir. Un manque d'ambition partagée, ou une approche trop attentiste de la vie à deux, peut rapidement créer chez vous un sentiment de déséquilibre, même si l'entente émotionnelle est bonne par ailleurs.",
      "Avec qui êtes-vous le plus compatible ?",
      "L'Aventurier Engagé est votre match idéal : son goût pour le mouvement et l'évolution personnelle rejoint votre orientation vers l'avenir, chacun nourrissant le projet commun à sa façon. Le Protecteur Discret complète bien votre profil aussi : sa loyauté discrète et sa prudence apportent un contrepoids stabilisant à votre énergie tournée vers l'action.",
      "Faites le test de compatibilité Nawa pour découvrir votre profil complet et les célibataires sérieux qui partagent votre vision du couple.",
    ],
  },
  {
    slug: "profil-coeur-spirituel",
    title: "Cœur Spirituel : construire un couple autour de ses valeurs profondes",
    metaDescription: "Le profil Cœur Spirituel place ses valeurs et sa spiritualité au centre de sa vision du mariage. Comprendre ce profil et ses meilleures compatibilités.",
    excerpt: "Ce profil place ses valeurs profondes au centre de sa vision du mariage.",
    date: "2026-08-31",
    relatedProfile: "coeur_spirituel",
    content: [
      "Pour le Cœur Spirituel, un mariage ne se juge pas seulement à la qualité de la relation au quotidien, mais à la solidité du socle sur lequel elle repose. Vos valeurs, qu'elles soient religieuses, spirituelles ou simplement des principes de vie profondément ancrés, sont au centre de votre vision du couple.",
      "Vous ne cherchez pas nécessairement un partenaire identique à vous sur tous les plans, mais quelqu'un capable de comprendre, respecter et idéalement partager ce socle. Sans cet alignement, même une relation par ailleurs harmonieuse peut manquer de profondeur à vos yeux.",
      "Ce qui fait la différence pour vous",
      "La sincérité prime sur beaucoup d'autres critères. Un partenaire dont les valeurs affichées ne correspondent pas aux actes du quotidien créera rapidement une distance, même invisible de l'extérieur. À l'inverse, un désaccord de forme (rythme de vie, tempérament) pèse peu face à un vrai alignement de fond.",
      "Avec qui êtes-vous le plus compatible ?",
      "L'Ancrage Familial est votre match idéal : sa recherche de stabilité et de transmission rejoint directement votre besoin d'un socle solide et durable. Le Protecteur Discret est également un excellent complément : sa loyauté et sa discrétion s'accordent bien avec votre approche posée et sincère de la relation.",
      "Faites le test de compatibilité Nawa pour découvrir votre profil complet et les célibataires sérieux qui partagent votre vision du couple.",
    ],
  },
  {
    slug: "profil-complice-du-quotidien",
    title: "Complice du Quotidien : et si le bonheur se cachait dans les petits moments",
    metaDescription: "Le profil Complice du Quotidien vit le couple à travers les petits moments partagés. Découvrez cette vision du mariage et ses compatibilités idéales.",
    excerpt: "Pour ce profil, un mariage réussi se vit dans les petits moments du quotidien.",
    date: "2026-09-02",
    relatedProfile: "complice_quotidien",
    content: [
      "Le Complice du Quotidien ne mesure pas la réussite d'un couple à de grands accomplissements, mais à l'accumulation de petits moments : un fou rire partagé, une habitude tendre, une présence rassurante chaque jour. C'est une vision simple, mais loin d'être superficielle.",
      "Ce profil sait qu'un mariage se vit à 95% dans le quotidien, pas dans les grandes occasions. Ce qui compte, c'est la qualité de la complicité installée jour après jour : l'humour partagé, la facilité à être soi-même, la légèreté qui désamorce les tensions avant qu'elles ne s'installent.",
      "Ce à quoi vous êtes le plus sensible",
      "La distance émotionnelle est ce qui vous pèse le plus dans une relation, bien plus qu'un désaccord ponctuel. Un partenaire trop sérieux en permanence, ou incapable de savourer les moments simples, peut vous donner l'impression d'un couple qui fonctionne sans jamais vraiment se retrouver.",
      "Avec qui êtes-vous le plus compatible ?",
      "L'Ancrage Familial est votre match idéal : son attachement au foyer et à la chaleur familiale rejoint parfaitement votre besoin de complicité quotidienne. L'Aventurier Engagé fonctionne bien en complément : votre légèreté équilibre son besoin de mouvement, en lui rappelant que le bonheur se trouve aussi dans l'instant présent.",
      "Faites le test de compatibilité Nawa pour découvrir votre profil complet et les célibataires sérieux qui partagent votre vision du couple.",
    ],
  },
  {
    slug: "profil-protecteur-discret",
    title: "Protecteur Discret : loyauté et discrétion, les piliers d'un amour solide",
    metaDescription: "Le profil Protecteur Discret privilégie la loyauté et la sécurité affective. Comprendre cette vision du couple et ses meilleures compatibilités.",
    excerpt: "Ce profil privilégie la loyauté, la sécurité affective et la discrétion en couple.",
    date: "2026-09-04",
    relatedProfile: "protecteur_discret",
    content: [
      "Le Protecteur Discret ne cherche ni l'agitation ni la mise en avant. Ce qui compte pour vous, c'est la solidité tranquille d'une relation où la confiance n'est jamais remise en question — construite loin du bruit, sur la durée.",
      "Vous privilégiez naturellement la loyauté et la sécurité affective à l'intensité ou à la nouveauté permanente. Un couple, pour vous, doit avant tout être un espace sûr, où l'on peut baisser la garde sans crainte d'être trahi ou exposé inutilement.",
      "Ce qui compte vraiment pour vous en couple",
      "La discrétion n'est pas un manque d'affection, c'est une façon de protéger ce qui est précieux. Un partenaire trop imprévisible, ou qui expose facilement la vie du couple à l'extérieur, créera chez vous un inconfort réel, même sans conflit apparent.",
      "Avec qui êtes-vous le plus compatible ?",
      "Le Cœur Spirituel est votre match idéal : sa sincérité et son attachement à des valeurs profondes rejoignent directement votre besoin de confiance durable. Le Bâtisseur de Projet est un bon complément également : sa détermination bénéficie de votre stabilité, tandis que vous trouvez en lui un cadre concret et rassurant.",
      "Faites le test de compatibilité Nawa pour découvrir votre profil complet et les célibataires sérieux qui partagent votre vision du couple.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
