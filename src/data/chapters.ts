
export interface Chapter {
  id: string;
  title: string;
  subject: string;
  level: string;
  description: string;
  content: string;
  quizQuestions: QuizQuestion[];
  relatedExams: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  type: "qcm" | "text" | "number" | "boolean";
  explanation: string;
}

export const chapters: Chapter[] = [
  // Mathématiques - 6ème (5 chapitres)
  {
    id: "math-6eme-nombres-entiers",
    title: "Les nombres entiers",
    subject: "math",
    level: "6ème",
    description: "Découverte et manipulation des nombres entiers naturels.",
    content: `# Les nombres entiers\n\nLes nombres entiers naturels sont les nombres 0, 1, 2, 3, 4, 5...\n\n## Écriture et lecture\n- Chiffres et nombres\n- Valeur positionnelle\n- Comparaison et rangement\n\n## Applications\n- Compter et dénombrer\n- Résoudre des problèmes simples`,
    quizQuestions: [
      {
        id: "q1-entiers",
        question: "Quel est le plus grand nombre à 3 chiffres ?",
        type: "number",
        correctAnswer: 999,
        explanation: "Le plus grand nombre à 3 chiffres est 999."
      }
    ],
    relatedExams: []
  },
  {
    id: "math-6eme-fractions",
    title: "Introduction aux fractions",
    subject: "math",
    level: "6ème",
    description: "Première approche des fractions et de leur signification.",
    content: `# Les fractions\n\nUne fraction représente une partie d'un tout.\n\n## Notation\n- Numérateur et dénominateur\n- Lecture d'une fraction\n- Représentation graphique\n\n## Fractions simples\n- 1/2, 1/3, 1/4\n- Comparaison avec l'unité`,
    quizQuestions: [
      {
        id: "q1-fractions",
        question: "Dans la fraction 3/4, quel est le numérateur ?",
        type: "number",
        correctAnswer: 3,
        explanation: "Le numérateur est le nombre du haut, ici 3."
      }
    ],
    relatedExams: []
  },
  {
    id: "math-6eme-decimaux",
    title: "Les nombres décimaux",
    subject: "math",
    level: "6ème",
    description: "Découverte et manipulation des nombres décimaux.",
    content: `# Les nombres décimaux\n\nLes nombres décimaux ont une partie entière et une partie décimale.\n\n## Écriture décimale\n- Virgule décimale\n- Dixièmes, centièmes\n- Comparaison et rangement\n\n## Opérations simples\n- Addition et soustraction`,
    quizQuestions: [
      {
        id: "q1-decimaux",
        question: "Dans le nombre 12,45, combien y a-t-il de centièmes ?",
        type: "number",
        correctAnswer: 5,
        explanation: "Le chiffre des centièmes est 5."
      }
    ],
    relatedExams: []
  },
  {
    id: "math-6eme-geometrie",
    title: "Géométrie : droites et segments",
    subject: "math",
    level: "6ème",
    description: "Introduction aux objets géométriques de base.",
    content: `# Droites et segments\n\n## Vocabulaire de base\n- Point, droite, segment\n- Appartenance et alignement\n- Droites parallèles et perpendiculaires\n\n## Construction\n- Utilisation de la règle\n- Tracer des parallèles et perpendiculaires`,
    quizQuestions: [
      {
        id: "q1-geometrie",
        question: "Deux droites qui ne se coupent jamais sont :",
        type: "qcm",
        options: ["Parallèles", "Perpendiculaires", "Sécantes", "Confondues"],
        correctAnswer: "Parallèles",
        explanation: "Deux droites parallèles ne se coupent jamais."
      }
    ],
    relatedExams: []
  },
  {
    id: "math-6eme-aires",
    title: "Aires et périmètres",
    subject: "math",
    level: "6ème",
    description: "Calcul d'aires et de périmètres de figures simples.",
    content: `# Aires et périmètres\n\n## Périmètre\n- Périmètre d'un rectangle\n- Périmètre d'un carré\n- Unités de longueur\n\n## Aire\n- Aire d'un rectangle\n- Aire d'un carré\n- Unités d'aire`,
    quizQuestions: [
      {
        id: "q1-aires",
        question: "L'aire d'un carré de côté 5 cm est :",
        type: "number",
        correctAnswer: 25,
        explanation: "Aire = côté × côté = 5 × 5 = 25 cm²."
      }
    ],
    relatedExams: []
  },

  // Français - 6ème (5 chapitres)
  {
    id: "french-6eme-grammaire",
    title: "Les classes grammaticales",
    subject: "french",
    level: "6ème",
    description: "Identification et rôle des différentes classes de mots.",
    content: `# Les classes grammaticales\n\n## Les mots variables\n- Nom, adjectif, verbe, pronom\n- Déterminant\n\n## Les mots invariables\n- Adverbe, préposition, conjonction\n- Interjection\n\n## Reconnaissance\n- Critères d'identification\n- Exercices d'application`,
    quizQuestions: [
      {
        id: "q1-grammaire",
        question: "Dans la phrase 'Le chat noir dort', quel est l'adjectif ?",
        type: "text",
        correctAnswer: "noir",
        explanation: "L'adjectif qualificatif 'noir' qualifie le nom 'chat'."
      }
    ],
    relatedExams: []
  },
  {
    id: "french-6eme-conjugaison",
    title: "Le présent de l'indicatif",
    subject: "french",
    level: "6ème",
    description: "Conjugaison des verbes au présent de l'indicatif.",
    content: `# Le présent de l'indicatif\n\n## Les trois groupes\n- 1er groupe : verbes en -er\n- 2ème groupe : verbes en -ir\n- 3ème groupe : verbes irréguliers\n\n## Terminaisons\n- Règles générales\n- Cas particuliers\n\n## Emplois du présent\n- Action en cours\n- Vérité générale\n- Présent de narration`,
    quizQuestions: [
      {
        id: "q1-conjugaison",
        question: "Conjuguez 'finir' à la 2ème personne du pluriel :",
        type: "text",
        correctAnswer: "vous finissez",
        explanation: "Les verbes du 2ème groupe prennent -issez à la 2ème personne du pluriel."
      }
    ],
    relatedExams: []
  },
  {
    id: "french-6eme-orthographe",
    title: "L'accord dans le groupe nominal",
    subject: "french",
    level: "6ème",
    description: "Règles d'accord de l'adjectif qualificatif.",
    content: `# L'accord dans le groupe nominal\n\n## Accord de l'adjectif\n- Accord en genre (masculin/féminin)\n- Accord en nombre (singulier/pluriel)\n\n## Formation du féminin\n- Règle générale : ajout d'un -e\n- Cas particuliers\n\n## Formation du pluriel\n- Règle générale : ajout d'un -s\n- Cas particuliers`,
    quizQuestions: [
      {
        id: "q1-orthographe",
        question: "Accordez : 'Une voiture (rouge)'",
        type: "text",
        correctAnswer: "rouge",
        explanation: "L'adjectif 'rouge' ne change pas au féminin."
      }
    ],
    relatedExams: []
  },
  {
    id: "french-6eme-vocabulaire",
    title: "Les familles de mots",
    subject: "french",
    level: "6ème",
    description: "Formation et reconnaissance des familles de mots.",
    content: `# Les familles de mots\n\n## Définition\n- Mots formés à partir du même radical\n- Même origine étymologique\n\n## Formation\n- Préfixes et suffixes\n- Dérivation\n\n## Exemples\n- Famille de 'terre' : terrestre, territoire, enterrer\n- Famille de 'chant' : chanter, chanson, chanteur`,
    quizQuestions: [
      {
        id: "q1-vocabulaire",
        question: "Quel mot appartient à la famille de 'dent' ?",
        type: "qcm",
        options: ["Dentiste", "Dos", "Doigt", "Tête"],
        correctAnswer: "Dentiste",
        explanation: "Dentiste est formé à partir du radical 'dent'."
      }
    ],
    relatedExams: []
  },
  {
    id: "french-6eme-lecture",
    title: "Les genres littéraires",
    subject: "french",
    level: "6ème",
    description: "Découverte des principaux genres littéraires.",
    content: `# Les genres littéraires\n\n## Le récit\n- Roman, nouvelle, conte\n- Caractéristiques narratives\n\n## Le théâtre\n- Dialogue et didascalies\n- Actes et scènes\n\n## La poésie\n- Vers et strophes\n- Rimes et rythmes\n\n## Reconnaissance\n- Indices textuels\n- Mise en page`,
    quizQuestions: [
      {
        id: "q1-lecture",
        question: "Un texte en vers appartient généralement au genre :",
        type: "qcm",
        options: ["Narratif", "Théâtral", "Poétique", "Argumentatif"],
        correctAnswer: "Poétique",
        explanation: "La poésie utilise généralement la forme versifiée."
      }
    ],
    relatedExams: []
  },

  // Histoire-Géographie - 6ème (5 chapitres)
  {
    id: "history-6eme-prehistoire",
    title: "La Préhistoire",
    subject: "history",
    level: "6ème",
    description: "Les premiers hommes et l'évolution de l'humanité.",
    content: `# La Préhistoire\n\n## Les premiers hommes\n- L'évolution de l'espèce humaine\n- Les premiers outils\n- La maîtrise du feu\n\n## Le Néolithique\n- L'agriculture et l'élevage\n- La sédentarisation\n- Les premières civilisations`,
    quizQuestions: [
      {
        id: "q1-prehistoire",
        question: "Quel est l'événement majeur du Néolithique ?",
        type: "qcm",
        options: ["La maîtrise du feu", "L'invention de l'agriculture", "L'écriture", "La métallurgie"],
        correctAnswer: "L'invention de l'agriculture",
        explanation: "Le Néolithique est marqué par l'invention de l'agriculture."
      }
    ],
    relatedExams: []
  },
  {
    id: "history-6eme-antiquite",
    title: "L'Antiquité orientale",
    subject: "history",
    level: "6ème",
    description: "Les premières civilisations du Proche-Orient.",
    content: `# L'Antiquité orientale\n\n## La Mésopotamie\n- Les Sumériens\n- L'invention de l'écriture\n- Les premières villes\n\n## L'Égypte antique\n- Les pharaons\n- Les pyramides\n- La momification`,
    quizQuestions: [
      {
        id: "q1-antiquite",
        question: "Où a été inventée l'écriture ?",
        type: "qcm",
        options: ["Égypte", "Mésopotamie", "Grèce", "Rome"],
        correctAnswer: "Mésopotamie",
        explanation: "L'écriture cunéiforme a été inventée en Mésopotamie."
      }
    ],
    relatedExams: []
  },
  {
    id: "history-6eme-grece",
    title: "Le monde grec",
    subject: "history",
    level: "6ème",
    description: "La civilisation grecque antique.",
    content: `# Le monde grec\n\n## Les cités grecques\n- Athènes et Sparte\n- La démocratie athénienne\n- Les colonies grecques\n\n## La culture grecque\n- Les dieux de l'Olympe\n- Les Jeux olympiques\n- Le théâtre grec`,
    quizQuestions: [
      {
        id: "q1-grece",
        question: "Quelle cité grecque a inventé la démocratie ?",
        type: "text",
        correctAnswer: "Athènes",
        explanation: "Athènes a développé la première forme de démocratie."
      }
    ],
    relatedExams: []
  },
  {
    id: "history-6eme-rome",
    title: "L'Empire romain",
    subject: "history",
    level: "6ème",
    description: "La formation et l'expansion de l'Empire romain.",
    content: `# L'Empire romain\n\n## La République romaine\n- Les institutions républicaines\n- Les conquêtes\n- Les guerres civiles\n\n## L'Empire\n- Auguste, premier empereur\n- La Pax Romana\n- La romanisation`,
    quizQuestions: [
      {
        id: "q1-rome",
        question: "Qui est le premier empereur romain ?",
        type: "text",
        correctAnswer: "Auguste",
        explanation: "Auguste (Octave) est le premier empereur romain."
      }
    ],
    relatedExams: []
  },
  {
    id: "history-6eme-geographie",
    title: "Habiter la Terre",
    subject: "history",
    level: "6ème",
    description: "La répartition de la population mondiale.",
    content: `# Habiter la Terre\n\n## La population mondiale\n- Répartition inégale\n- Foyers de peuplement\n- Déserts humains\n\n## Les espaces ruraux\n- L'agriculture dans le monde\n- Les paysages agricoles\n- L'exode rural`,
    quizQuestions: [
      {
        id: "q1-geographie",
        question: "Quel continent a la plus forte densité de population ?",
        type: "qcm",
        options: ["Afrique", "Europe", "Asie", "Amérique"],
        correctAnswer: "Asie",
        explanation: "L'Asie concentre plus de la moitié de la population mondiale."
      }
    ],
    relatedExams: []
  },

  // SVT - 6ème (5 chapitres)
  {
    id: "svt-6eme-vivant",
    title: "Caractéristiques du vivant",
    subject: "svt",
    level: "6ème",
    description: "Les caractères communs aux êtres vivants.",
    content: `# Caractéristiques du vivant\n\n## Qu'est-ce qu'un être vivant ?\n- Nutrition\n- Respiration\n- Reproduction\n- Croissance\n\n## Diversité du vivant\n- Animaux et végétaux\n- Micro-organismes\n- Classification`,
    quizQuestions: [
      {
        id: "q1-vivant",
        question: "Quelle est une caractéristique du vivant ?",
        type: "qcm",
        options: ["La reproduction", "La couleur", "La forme", "La taille"],
        correctAnswer: "La reproduction",
        explanation: "La reproduction est une caractéristique fondamentale du vivant."
      }
    ],
    relatedExams: []
  },
  {
    id: "svt-6eme-nutrition",
    title: "La nutrition chez les végétaux",
    subject: "svt",
    level: "6ème",
    description: "Comment les plantes se nourrissent.",
    content: `# La nutrition chez les végétaux\n\n## Les besoins des plantes\n- Lumière\n- Eau\n- Sels minéraux\n- Dioxyde de carbone\n\n## La photosynthèse\n- Production de matière organique\n- Libération d'oxygène\n- Rôle de la chlorophylle`,
    quizQuestions: [
      {
        id: "q1-nutrition",
        question: "Quel gaz les plantes rejettent-elles lors de la photosynthèse ?",
        type: "text",
        correctAnswer: "oxygène",
        explanation: "Les plantes rejettent de l'oxygène lors de la photosynthèse."
      }
    ],
    relatedExams: []
  },
  {
    id: "svt-6eme-animaux",
    title: "La nutrition chez les animaux",
    subject: "svt",
    level: "6ème",
    description: "Les différents régimes alimentaires des animaux.",
    content: `# La nutrition chez les animaux\n\n## Les régimes alimentaires\n- Herbivores\n- Carnivores\n- Omnivores\n\n## Adaptations\n- Dentition\n- Appareil digestif\n- Comportement de chasse`,
    quizQuestions: [
      {
        id: "q1-animaux",
        question: "Un animal qui mange uniquement des végétaux est :",
        type: "qcm",
        options: ["Carnivore", "Herbivore", "Omnivore", "Insectivore"],
        correctAnswer: "Herbivore",
        explanation: "Un herbivore ne mange que des végétaux."
      }
    ],
    relatedExams: []
  },
  {
    id: "svt-6eme-environnement",
    title: "L'environnement et ses composantes",
    subject: "svt",
    level: "6ème",
    description: "Les interactions entre les êtres vivants et leur milieu.",
    content: `# L'environnement et ses composantes\n\n## Composantes de l'environnement\n- Êtres vivants\n- Composantes minérales\n- Climat\n\n## Interactions\n- Chaînes alimentaires\n- Relations de prédation\n- Symbiose`,
    quizQuestions: [
      {
        id: "q1-environnement",
        question: "Dans une chaîne alimentaire, les végétaux sont :",
        type: "qcm",
        options: ["Producteurs primaires", "Consommateurs", "Décomposeurs", "Prédateurs"],
        correctAnswer: "Producteurs primaires",
        explanation: "Les végétaux sont les producteurs primaires de la chaîne alimentaire."
      }
    ],
    relatedExams: []
  },
  {
    id: "svt-6eme-peuplement",
    title: "Le peuplement d'un milieu",
    subject: "svt",
    level: "6ème",
    description: "Comment les êtres vivants colonisent un milieu.",
    content: `# Le peuplement d'un milieu\n\n## Modes de peuplement\n- Reproduction\n- Migration\n- Dispersion\n\n## Facteurs influençant le peuplement\n- Conditions climatiques\n- Ressources alimentaires\n- Compétition`,
    quizQuestions: [
      {
        id: "q1-peuplement",
        question: "Quel facteur influence le peuplement d'un milieu ?",
        type: "qcm",
        options: ["La température", "La couleur du sol", "La forme des roches", "L'âge du milieu"],
        correctAnswer: "La température",
        explanation: "La température est un facteur climatique important pour le peuplement."
      }
    ],
    relatedExams: []
  },

  // Anglais - 6ème (5 chapitres)
  {
    id: "english-6eme-greetings",
    title: "Greetings and Introductions",
    subject: "english",
    level: "6ème",
    description: "Les salutations et présentations en anglais.",
    content: `# Greetings and Introductions\n\n## Basic Greetings\n- Hello, Hi, Good morning\n- How are you?\n- Nice to meet you\n\n## Introducing Yourself\n- My name is...\n- I am... years old\n- I live in...`,
    quizQuestions: [
      {
        id: "q1-greetings",
        question: "Comment dit-on 'Bonjour' en anglais ?",
        type: "text",
        correctAnswer: "Hello",
        explanation: "'Hello' est la traduction de 'Bonjour' en anglais."
      }
    ],
    relatedExams: []
  },
  {
    id: "english-6eme-family",
    title: "Family and Relations",
    subject: "english",
    level: "6ème",
    description: "Le vocabulaire de la famille en anglais.",
    content: `# Family and Relations\n\n## Family Members\n- Mother, Father, Brother, Sister\n- Grandfather, Grandmother\n- Uncle, Aunt, Cousin\n\n## Describing Family\n- I have...\n- My family is...\n- Possessive adjectives`,
    quizQuestions: [
      {
        id: "q1-family",
        question: "Comment dit-on 'frère' en anglais ?",
        type: "text",
        correctAnswer: "brother",
        explanation: "'Brother' signifie 'frère' en anglais."
      }
    ],
    relatedExams: []
  },
  {
    id: "english-6eme-school",
    title: "School Life",
    subject: "english",
    level: "6ème",
    description: "Le vocabulaire de l'école en anglais.",
    content: `# School Life\n\n## School Subjects\n- Maths, English, Science\n- History, Geography\n- Art, Music, PE\n\n## School Objects\n- Book, Pen, Pencil\n- Bag, Ruler, Eraser\n- Classroom, Teacher`,
    quizQuestions: [
      {
        id: "q1-school",
        question: "Comment dit-on 'livre' en anglais ?",
        type: "text",
        correctAnswer: "book",
        explanation: "'Book' signifie 'livre' en anglais."
      }
    ],
    relatedExams: []
  },
  {
    id: "english-6eme-colors",
    title: "Colors and Numbers",
    subject: "english",
    level: "6ème",
    description: "Les couleurs et les nombres en anglais.",
    content: `# Colors and Numbers\n\n## Basic Colors\n- Red, Blue, Green, Yellow\n- Black, White, Pink, Orange\n- Purple, Brown, Grey\n\n## Numbers 1-20\n- One to ten\n- Eleven to twenty\n- Pronunciation`,
    quizQuestions: [
      {
        id: "q1-colors",
        question: "Comment dit-on 'rouge' en anglais ?",
        type: "text",
        correctAnswer: "red",
        explanation: "'Red' signifie 'rouge' en anglais."
      }
    ],
    relatedExams: []
  },
  {
    id: "english-6eme-time",
    title: "Days, Months and Time",
    subject: "english",
    level: "6ème",
    description: "Les jours, mois et l'heure en anglais.",
    content: `# Days, Months and Time\n\n## Days of the Week\n- Monday to Sunday\n- Weekend and weekdays\n\n## Months of the Year\n- January to December\n- Seasons\n\n## Telling Time\n- What time is it?\n- It's... o'clock\n- Half past, quarter past`,
    quizQuestions: [
      {
        id: "q1-time",
        question: "Combien y a-t-il de jours dans une semaine ?",
        type: "number",
        correctAnswer: 7,
        explanation: "Il y a 7 jours dans une semaine."
      }
    ],
    relatedExams: []
  },

  // Technologie - 6ème (5 chapitres)
  {
    id: "technology-6eme-objets",
    title: "Les objets techniques",
    subject: "technology",
    level: "6ème",
    description: "Découverte des objets techniques qui nous entourent.",
    content: `# Les objets techniques\n\n## Qu'est-ce qu'un objet technique ?\n- Objet fabriqué par l'homme\n- Répond à un besoin\n- A une fonction\n\n## Classification\n- Objets mécaniques\n- Objets électriques\n- Objets électroniques`,
    quizQuestions: [
      {
        id: "q1-objets",
        question: "Un objet technique est créé pour :",
        type: "qcm",
        options: ["Décorer", "Répondre à un besoin", "Faire du bruit", "Prendre de la place"],
        correctAnswer: "Répondre à un besoin",
        explanation: "Un objet technique est conçu pour répondre à un besoin humain."
      }
    ],
    relatedExams: []
  },
  {
    id: "technology-6eme-materiaux",
    title: "Les matériaux",
    subject: "technology",
    level: "6ème",
    description: "Les différents matériaux et leurs propriétés.",
    content: `# Les matériaux\n\n## Types de matériaux\n- Métaux\n- Plastiques\n- Bois\n- Céramiques\n\n## Propriétés\n- Résistance\n- Conductivité\n- Transparence\n- Recyclabilité`,
    quizQuestions: [
      {
        id: "q1-materiaux",
        question: "Quel matériau conduit le mieux l'électricité ?",
        type: "qcm",
        options: ["Bois", "Plastique", "Métal", "Verre"],
        correctAnswer: "Métal",
        explanation: "Les métaux sont généralement de bons conducteurs d'électricité."
      }
    ],
    relatedExams: []
  },
  {
    id: "technology-6eme-energie",
    title: "Les énergies",
    subject: "technology",
    level: "6ème",
    description: "Les différentes formes d'énergie et leurs utilisations.",
    content: `# Les énergies\n\n## Sources d'énergie\n- Énergies renouvelables\n- Énergies fossiles\n- Énergie nucléaire\n\n## Transformations\n- Mécanique vers électrique\n- Chimique vers thermique\n- Solaire vers électrique`,
    quizQuestions: [
      {
        id: "q1-energie",
        question: "Quelle énergie est renouvelable ?",
        type: "qcm",
        options: ["Pétrole", "Charbon", "Solaire", "Gaz"],
        correctAnswer: "Solaire",
        explanation: "L'énergie solaire est une énergie renouvelable."
      }
    ],
    relatedExams: []
  },
  {
    id: "technology-6eme-informatique",
    title: "L'informatique et la programmation",
    subject: "technology",
    level: "6ème",
    description: "Introduction à l'informatique et aux algorithmes.",
    content: `# L'informatique et la programmation\n\n## L'ordinateur\n- Composants\n- Périphériques\n- Logiciels\n\n## Algorithmes\n- Séquences d'instructions\n- Conditions\n- Boucles\n\n## Programmation\n- Scratch\n- Robots éducatifs`,
    quizQuestions: [
      {
        id: "q1-informatique",
        question: "Un algorithme est :",
        type: "qcm",
        options: ["Un ordinateur", "Une séquence d'instructions", "Un logiciel", "Un robot"],
        correctAnswer: "Une séquence d'instructions",
        explanation: "Un algorithme est une suite d'instructions pour résoudre un problème."
      }
    ],
    relatedExams: []
  },
  {
    id: "technology-6eme-communication",
    title: "La communication et l'information",
    subject: "technology",
    level: "6ème",
    description: "Les moyens de communication et de transmission de l'information.",
    content: `# La communication et l'information\n\n## Moyens de communication\n- Téléphone, Internet\n- Radio, télévision\n- Courrier, journaux\n\n## Transmission de l'information\n- Signaux analogiques\n- Signaux numériques\n- Réseaux`,
    quizQuestions: [
      {
        id: "q1-communication",
        question: "Internet permet de :",
        type: "qcm",
        options: ["Transmettre des informations", "Faire du sport", "Cuisiner", "Dormir"],
        correctAnswer: "Transmettre des informations",
        explanation: "Internet est un réseau de communication d'informations."
      }
    ],
    relatedExams: []
  }
];
