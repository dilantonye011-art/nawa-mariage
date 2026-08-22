export interface CityFAQ {
  question: string;
  answer: string;
}

export interface City {
  slug: string;
  name: string;
  country: string;
  type: "afrique" | "diaspora";
  intro: string;
  whyNawa: string;
  faq: CityFAQ[];
}

export const cities: City[] = [
  {
    slug: "douala",
    name: "Douala",
    country: "Cameroun",
    type: "afrique",
    intro: "Douala concentre l'une des populations de jeunes actifs les plus importantes du Cameroun, mais trouver un partenaire sérieux dans une métropole aussi dense reste un vrai défi : entre le rythme de vie, les cercles sociaux fermés et les rencontres superficielles, beaucoup de célibataires douze douze finissent par se lasser des applications de rencontre classiques.",
    whyNawa: "Nawa s'adresse aux Doualais qui cherchent un mariage sérieux, pas une conversation de plus. Le test de compatibilité aide à identifier rapidement les célibataires de Douala qui partagent une vision similaire du couple, avant même le premier message.",
    faq: [
      { question: "Existe-t-il une application de rencontre sérieuse à Douala ?", answer: "Oui, Nawa est pensée pour les célibataires d'Afrique francophone, dont Douala, qui recherchent une relation sérieuse orientée mariage plutôt que des rencontres casuelles." },
      { question: "Le test de compatibilité est-il gratuit à Douala ?", answer: "Oui, l'inscription et le test de compatibilité sont gratuits pour tous les membres, où qu'ils se trouvent au Cameroun." },
      { question: "Comment Nawa vérifie-t-elle les profils à Douala ?", answer: "Chaque profil est validé par l'équipe Nawa avant d'apparaître dans les suggestions de match, pour limiter les faux comptes." },
    ],
  },
  {
    slug: "yaounde",
    name: "Yaoundé",
    country: "Cameroun",
    type: "afrique",
    intro: "Capitale politique et administrative, Yaoundé rassemble une population diverse, souvent très occupée par le travail ou les études. Les rencontres spontanées y sont plus rares qu'ailleurs, ce qui pousse de plus en plus de célibataires yaoundéens sérieux à se tourner vers des plateformes en ligne pensées pour le mariage plutôt que pour le divertissement.",
    whyNawa: "À Yaoundé, Nawa permet de gagner du temps : plutôt que d'enchaîner les rencontres sans lendemain, le profil de compatibilité oriente directement vers des célibataires dont la vision du couple rejoint la vôtre.",
    faq: [
      { question: "Nawa est-elle disponible à Yaoundé ?", answer: "Oui, Nawa est accessible à tous les célibataires du Cameroun, y compris à Yaoundé." },
      { question: "Combien de temps prend le test de compatibilité ?", answer: "Environ deux minutes, avec sept questions sur votre vision du couple et vos priorités de vie." },
      { question: "Peut-on filtrer les profils par ville sur Nawa ?", answer: "Oui, la recherche permet d'affiner les suggestions par localisation, dont Yaoundé." },
    ],
  },
  {
    slug: "abidjan",
    name: "Abidjan",
    country: "Côte d'Ivoire",
    type: "afrique",
    intro: "Abidjan est l'une des métropoles les plus dynamiques d'Afrique de l'Ouest, avec une vie sociale intense mais souvent centrée sur le divertissement plus que sur la construction d'une relation durable. De nombreux célibataires ivoiriens sérieux recherchent aujourd'hui une alternative plus ciblée aux applications de rencontre généralistes.",
    whyNawa: "Nawa se distingue à Abidjan par son positionnement clair : pas de swipe à l'infini, mais un profil de compatibilité qui oriente vers des célibataires réellement engagés dans une recherche de mariage.",
    faq: [
      { question: "Y a-t-il beaucoup de membres sérieux à Abidjan sur Nawa ?", answer: "Abidjan fait partie des villes prioritaires de Nawa en Côte d'Ivoire, avec une communauté de célibataires orientés mariage en croissance." },
      { question: "Nawa est-elle une application de rencontre casuelle ?", answer: "Non, Nawa est positionnée exclusivement sur la recherche d'une relation sérieuse menant au mariage." },
      { question: "Faut-il payer pour faire le test de compatibilité à Abidjan ?", answer: "Non, le test et l'inscription sont entièrement gratuits." },
    ],
  },
  {
    slug: "dakar",
    name: "Dakar",
    country: "Sénégal",
    type: "afrique",
    intro: "Dakar conjugue tradition et modernité, et cette double réalité se retrouve aussi dans la façon dont les célibataires sénégalais envisagent le mariage : ils veulent souvent une relation qui respecte des valeurs solides tout en s'inscrivant dans une vie moderne et active.",
    whyNawa: "Nawa a été pensée pour ce type d'équilibre : un test de compatibilité basé sur les valeurs et la vision du couple, sans imposer un mode de vie particulier, pour aider les célibataires de Dakar à identifier des partenaires réellement alignés.",
    faq: [
      { question: "Nawa fonctionne-t-elle bien au Sénégal ?", answer: "Oui, Dakar fait partie des villes cibles prioritaires de Nawa en Afrique de l'Ouest." },
      { question: "Le profil de compatibilité tient-il compte des valeurs personnelles ?", answer: "Oui, c'est justement le cœur du test : identifier votre vision du couple et vos priorités de vie, pas seulement vos critères physiques." },
      { question: "Comment contacter un profil compatible à Dakar ?", answer: "Une fois le test complété, Nawa vous suggère des profils compatibles avec lesquels échanger via une messagerie sécurisée." },
    ],
  },
  {
    slug: "kinshasa",
    name: "Kinshasa",
    country: "République démocratique du Congo",
    type: "afrique",
    intro: "Avec plusieurs millions d'habitants, Kinshasa est l'une des plus grandes villes francophones du monde — et l'une des plus difficiles pour rencontrer un partenaire sérieux au hasard des interactions du quotidien. Beaucoup de célibataires kinois se tournent vers les applications en ligne, mais peinent à trouver une plateforme réellement orientée mariage.",
    whyNawa: "Nawa répond directement à ce besoin à Kinshasa : un test de compatibilité rapide, des profils vérifiés, et une communauté clairement orientée vers l'engagement plutôt que la conversation sans but.",
    faq: [
      { question: "Nawa est-elle accessible à Kinshasa ?", answer: "Oui, Nawa est disponible pour tous les célibataires en République démocratique du Congo, dont Kinshasa." },
      { question: "Les profils sont-ils vérifiés à Kinshasa ?", answer: "Oui, chaque profil est validé par l'équipe Nawa avant d'être visible dans les suggestions de match." },
      { question: "Quelle est la différence entre Nawa et une application de rencontre classique ?", answer: "Nawa se concentre exclusivement sur les relations sérieuses orientées mariage, avec un matching basé sur la compatibilité de valeurs plutôt que sur le swipe." },
    ],
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    type: "diaspora",
    intro: "Pour de nombreux célibataires de la diaspora africaine francophone installés à Paris et en région parisienne, trouver un partenaire qui comprend à la fois leur culture d'origine et leur vie en France n'est pas toujours simple sur les applications de rencontre généralistes.",
    whyNawa: "Nawa rassemble une communauté de célibataires sérieux d'Afrique francophone et de sa diaspora, dont beaucoup à Paris, à la recherche d'un partenaire partageant une vision similaire du couple et du mariage.",
    faq: [
      { question: "Nawa est-elle utilisée par la diaspora à Paris ?", answer: "Oui, Nawa compte une communauté active de célibataires d'Afrique francophone installés à Paris et en Île-de-France." },
      { question: "Peut-on rencontrer des profils basés en Afrique depuis Paris ?", answer: "Oui, la recherche permet d'élargir ou de restreindre les suggestions selon la localisation souhaitée." },
      { question: "L'inscription est-elle gratuite depuis la France ?", answer: "Oui, l'inscription et le test de compatibilité sont gratuits, quel que soit le pays de résidence." },
    ],
  },
  {
    slug: "bruxelles",
    name: "Bruxelles",
    country: "Belgique",
    type: "diaspora",
    intro: "Bruxelles accueille une importante communauté originaire d'Afrique francophone, souvent en quête d'un partenaire qui comprenne à la fois les repères culturels d'origine et la réalité de la vie en Belgique.",
    whyNawa: "Nawa permet aux célibataires sérieux de Bruxelles de se connecter à une communauté partageant ces mêmes repères, grâce à un profil de compatibilité basé sur les valeurs plutôt que sur la seule proximité géographique.",
    faq: [
      { question: "Nawa est-elle disponible en Belgique ?", answer: "Oui, Nawa est accessible aux célibataires de la diaspora africaine francophone installés en Belgique, dont Bruxelles." },
      { question: "Comment fonctionne le matching pour la diaspora ?", answer: "Le test de compatibilité fonctionne de la même façon partout : il identifie votre profil et vous suggère des célibataires alignés, en Afrique ou dans la diaspora." },
      { question: "Le service est-il payant à Bruxelles ?", answer: "Non, l'inscription et le test sont gratuits pour tous les membres." },
    ],
  },
  {
    slug: "bamako",
    name: "Bamako",
    country: "Mali",
    type: "afrique",
    intro: "Bamako est une ville en pleine expansion démographique, où les modes de rencontre traditionnels laissent de plus en plus de place aux plateformes en ligne. Les célibataires sérieux y cherchent une alternative fiable aux applications de rencontre casuelle, souvent perçues comme peu adaptées à une recherche de mariage.",
    whyNawa: "Nawa offre aux célibataires de Bamako un cadre pensé pour le sérieux : un test de compatibilité basé sur les valeurs, et des profils vérifiés par une équipe humaine, pas seulement des critères physiques.",
    faq: [
      { question: "Nawa est-elle disponible au Mali ?", answer: "Oui, Nawa est accessible à tous les célibataires du Mali, dont Bamako." },
      { question: "L'inscription est-elle gratuite à Bamako ?", answer: "Oui, l'inscription et le test de compatibilité sont entièrement gratuits." },
      { question: "Comment fonctionne la vérification des profils ?", answer: "Chaque profil est validé manuellement par l'équipe Nawa avant d'apparaître dans les suggestions de match." },
    ],
  },
  {
    slug: "ouagadougou",
    name: "Ouagadougou",
    country: "Burkina Faso",
    type: "afrique",
    intro: "À Ouagadougou, la vie sociale reste dense mais les occasions de rencontrer un partenaire aux mêmes attentes de mariage se raréfient dans un rythme de vie urbain accéléré. De plus en plus de célibataires burkinabè se tournent vers des plateformes en ligne pensées pour le sérieux plutôt que pour le divertissement.",
    whyNawa: "Nawa permet aux célibataires de Ouagadougou de gagner du temps en se concentrant sur des profils réellement alignés avec leur vision du couple, grâce à un test de compatibilité rapide.",
    faq: [
      { question: "Nawa est-elle accessible au Burkina Faso ?", answer: "Oui, Nawa est disponible pour tous les célibataires du Burkina Faso, dont Ouagadougou." },
      { question: "Le test de compatibilité prend-il longtemps ?", answer: "Non, environ deux minutes, avec sept questions sur votre vision du couple." },
      { question: "Nawa est-elle une application de rencontre sérieuse ?", answer: "Oui, Nawa est exclusivement positionnée sur la recherche d'une relation sérieuse orientée mariage." },
    ],
  },
  {
    slug: "lome",
    name: "Lomé",
    country: "Togo",
    type: "afrique",
    intro: "Lomé, ville côtière dynamique, voit sa population de jeunes actifs urbains grandir rapidement. Beaucoup de célibataires togolais cherchent aujourd'hui une application qui les distingue clairement des plateformes de rencontre casuelle, avec un vrai objectif de mariage.",
    whyNawa: "Nawa répond à cette attente à Lomé avec un profil de compatibilité basé sur les valeurs, et une communauté de célibataires clairement orientés vers l'engagement.",
    faq: [
      { question: "Nawa est-elle disponible au Togo ?", answer: "Oui, Nawa est accessible à tous les célibataires du Togo, dont Lomé." },
      { question: "Les profils sont-ils vérifiés à Lomé ?", answer: "Oui, chaque profil est validé par l'équipe Nawa avant d'être visible dans les suggestions." },
      { question: "Quel est le prix de l'inscription à Lomé ?", answer: "L'inscription et le test de compatibilité sont gratuits." },
    ],
  },
  {
    slug: "cotonou",
    name: "Cotonou",
    country: "Bénin",
    type: "afrique",
    intro: "Cotonou concentre une grande partie de la vie économique et sociale du Bénin, avec une population jeune et connectée. Les célibataires béninois sérieux cherchent de plus en plus des plateformes qui vont au-delà du simple swipe pour trouver un partenaire de mariage.",
    whyNawa: "Nawa propose aux célibataires de Cotonou un test de compatibilité basé sur les valeurs de vie, pour des rencontres qui ont du sens dès le départ.",
    faq: [
      { question: "Nawa est-elle disponible au Bénin ?", answer: "Oui, Nawa est accessible à tous les célibataires du Bénin, dont Cotonou." },
      { question: "Comment se déroule le test de compatibilité ?", answer: "Sept questions rapides sur votre vision du couple déterminent votre profil de compatibilité et votre match idéal." },
      { question: "Nawa est-elle gratuite à Cotonou ?", answer: "Oui, l'inscription et le test sont entièrement gratuits." },
    ],
  },
  {
    slug: "libreville",
    name: "Libreville",
    country: "Gabon",
    type: "afrique",
    intro: "Libreville rassemble une population urbaine en quête de relations sérieuses, souvent déçue par les applications de rencontre généralistes qui privilégient la quantité de profils à la qualité des connexions. Les célibataires gabonais cherchent une alternative axée sur l'engagement.",
    whyNawa: "Nawa s'adresse aux célibataires de Libreville qui veulent un mariage construit sur des bases solides, grâce à un matching par compatibilité de valeurs plutôt que par simple apparence.",
    faq: [
      { question: "Nawa est-elle disponible au Gabon ?", answer: "Oui, Nawa est accessible à tous les célibataires du Gabon, dont Libreville." },
      { question: "Le matching est-il basé sur quoi ?", answer: "Sur un profil de compatibilité déterminé par vos valeurs et votre vision du couple, pas uniquement vos critères physiques." },
      { question: "Faut-il payer pour s'inscrire à Libreville ?", answer: "Non, l'inscription est gratuite pour tous les membres." },
    ],
  },
  {
    slug: "brazzaville",
    name: "Brazzaville",
    country: "République du Congo",
    type: "afrique",
    intro: "À Brazzaville, les célibataires sérieux ont souvent du mal à distinguer les profils réellement engagés dans une recherche de mariage de ceux qui cherchent simplement à discuter. Une application clairement positionnée sur le sérieux répond directement à ce besoin.",
    whyNawa: "Nawa apporte à Brazzaville une communauté de célibataires vérifiés et orientés mariage, avec un test de compatibilité qui filtre dès le départ les attentes de chacun.",
    faq: [
      { question: "Nawa est-elle disponible en République du Congo ?", answer: "Oui, Nawa est accessible à tous les célibataires du Congo-Brazzaville." },
      { question: "Comment savoir si un profil est vérifié ?", answer: "Un badge de vérification apparaît sur les profils validés par l'équipe Nawa." },
      { question: "Le test de compatibilité est-il obligatoire ?", answer: "Il est fortement recommandé : c'est lui qui détermine votre profil et vos suggestions de match." },
    ],
  },
  {
    slug: "conakry",
    name: "Conakry",
    country: "Guinée",
    type: "afrique",
    intro: "Conakry connaît une croissance rapide de sa population connectée, avec une demande grandissante pour des plateformes de rencontre orientées vers le mariage plutôt que le divertissement. Les célibataires guinéens sérieux cherchent un cadre de confiance pour leurs recherches.",
    whyNawa: "Nawa offre aux célibataires de Conakry un profil de compatibilité basé sur les valeurs, et une modération humaine qui garantit des profils authentiques.",
    faq: [
      { question: "Nawa est-elle disponible en Guinée ?", answer: "Oui, Nawa est accessible à tous les célibataires de Guinée, dont Conakry." },
      { question: "Qu'est-ce qui différencie Nawa des autres applications ?", answer: "Un matching basé sur la compatibilité de valeurs plutôt que le swipe, et un positionnement exclusivement orienté mariage." },
      { question: "L'inscription prend-elle du temps ?", answer: "Non, l'inscription et le test de compatibilité prennent quelques minutes au total." },
    ],
  },
  {
    slug: "niamey",
    name: "Niamey",
    country: "Niger",
    type: "afrique",
    intro: "Niamey voit sa population urbaine jeune de plus en plus connectée, à la recherche de plateformes de rencontre adaptées à une vraie démarche de mariage. Les célibataires nigériens sérieux privilégient désormais des applications qui garantissent la sécurité et l'authenticité des profils.",
    whyNawa: "Nawa met à disposition des célibataires de Niamey un test de compatibilité rapide et des profils vérifiés, pour des rencontres orientées vers l'engagement.",
    faq: [
      { question: "Nawa est-elle disponible au Niger ?", answer: "Oui, Nawa est accessible à tous les célibataires du Niger, dont Niamey." },
      { question: "Comment fonctionne la modération à Niamey ?", answer: "Chaque profil est vérifié manuellement par l'équipe Nawa avant d'être visible." },
      { question: "Le service est-il payant à Niamey ?", answer: "Non, l'inscription et le test de compatibilité sont gratuits." },
    ],
  },
  {
    slug: "montreal",
    name: "Montréal",
    country: "Canada",
    type: "diaspora",
    intro: "Montréal est l'une des villes nord-américaines comptant la plus forte communauté francophone originaire d'Afrique. Beaucoup de célibataires y recherchent un partenaire sérieux partageant à la fois la langue, les valeurs et une vision similaire du mariage.",
    whyNawa: "Nawa connecte les célibataires sérieux de Montréal à une communauté francophone d'Afrique et de sa diaspora, avec un test de compatibilité pensé pour aller au-delà des critères superficiels.",
    faq: [
      { question: "Nawa est-elle utilisée à Montréal ?", answer: "Oui, Montréal fait partie des villes de la diaspora où Nawa développe activement sa communauté." },
      { question: "Peut-on filtrer les profils par pays d'origine ?", answer: "Le profil de chaque membre indique ses informations, et la recherche permet d'affiner selon plusieurs critères, dont la localisation." },
      { question: "L'application est-elle disponible au Canada ?", answer: "Oui, Nawa est accessible partout où la connexion internet le permet, y compris au Canada." },
    ],
  },
  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    type: "diaspora",
    intro: "Toronto abrite l'une des communautés africaines les plus importantes d'Amérique du Nord, avec une présence francophone active malgré le contexte majoritairement anglophone de la ville. Pour les célibataires sérieux originaires d'Afrique francophone, trouver un partenaire qui partage à la fois la langue et les mêmes repères culturels reste un vrai défi sur les applications généralistes.",
    whyNawa: "Nawa rassemble les célibataires francophones d'Afrique et de sa diaspora installés à Toronto autour d'un objectif commun : le mariage. Le test de compatibilité aide à identifier rapidement les profils réellement alignés, au-delà de la seule proximité géographique.",
    faq: [
      { question: "Nawa est-elle disponible à Toronto ?", answer: "Oui, Nawa est accessible aux célibataires francophones d'Afrique et de sa diaspora installés à Toronto." },
      { question: "Nawa s'adresse-t-elle uniquement aux francophones à Toronto ?", answer: "Nawa est pensée en priorité pour la communauté francophone d'Afrique et de sa diaspora, où qu'elle se trouve, y compris à Toronto." },
      { question: "L'inscription est-elle gratuite au Canada ?", answer: "Oui, l'inscription et le test de compatibilité sont gratuits partout, y compris à Toronto." },
    ],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
