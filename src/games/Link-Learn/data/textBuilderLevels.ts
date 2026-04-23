export interface TextBuilderLevel {
  id: number;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  
  // Mode d'exercice (pour Phase 2)
  mode: "text-builder" | "fill-gaps";
  
  text: string;
  translation: string;
  chunks: string[];
  
  // Configuration des gaps (pour Phase 2 - fill-gaps)
  gaps?: {
    positions: number[];
    distractors: string[];
  };
  
  timerSeconds: number | null;
  topic: string;
  
  // Système de points
  scoring: {
    maxPoints: 10;
    passingScore: 7;        // 7/10 pour débloquer le suivant
    penalties: {
      wrongAnswer: 0.5;     // -0.5 par mauvaise réponse
      consecutiveErrorsReset: 1; // -1 si reset après 5 erreurs
    };
  };
}

function splitWords(text: string): string[] {
  return text.split(/\s+/);
}

const beginnerTexts: Omit<TextBuilderLevel, "id">[] = [
  {
    title: "Introduction",
    difficulty: "beginner",
    mode: "text-builder",
    text: "Hello, my name is Kofi. I am twelve years old and I live in a big house in Lome.",
    translation: "Bonjour, mon nom est Kofi. J'ai douze ans et j'habite dans une grande maison à Lomé.",
    chunks: splitWords("Hello, my name is Kofi. I am twelve years old and I live in a big house in Lome."),
    timerSeconds: 120,
    topic: "Greetings",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Morning Routine",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I wake up early every morning. I wash my face and then I eat my breakfast with milk.",
    translation: "Je me réveille tôt chaque matin. Je me lave le visage et ensuite je mange mon petit-déjeuner avec du lait.",
    chunks: splitWords("I wake up early every morning. I wash my face and then I eat my breakfast with milk."),
    gaps: {
      positions: [1, 6, 10, 12], // wake up, wash, eat, milk
      distractors: ["sleep", "brush", "drink", "water", "play", "bread"]
    },
    timerSeconds: 120,
    topic: "Daily Life",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "At School",
    difficulty: "beginner",
    mode: "text-builder",
    text: "My favorite subject is English. I like to learn new words and talk to my teacher every day.",
    translation: "Ma matière préférée est l'anglais. J'aime apprendre de nouveaux mots et parler à mon professeur chaque jour.",
    chunks: splitWords("My favorite subject is English. I like to learn new words and talk to my teacher every day."),
    timerSeconds: 120,
    topic: "School",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Market",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "On Saturdays, I go to the market with my mother. We buy fresh fish, tomatoes, onions and yams.",
    translation: "Les samedis, je vais au marché avec ma mère. Nous achetons du poisson frais, des tomates, des oignons et des ignames.",
    chunks: splitWords("On Saturdays, I go to the market with my mother. We buy fresh fish, tomatoes, onions and yams."),
    gaps: {
      positions: [1, 4, 8, 14], // Saturdays, market, buy, yams
      distractors: ["Mondays", "school", "sell", "bread", "Sundays", "meat"]
    },
    timerSeconds: 120,
    topic: "Life",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Football Match",
    difficulty: "beginner",
    mode: "text-builder",
    text: "I love playing football with my friends. We go to the field behind the school after our classes.",
    translation: "J'adore jouer au football avec mes amis. Nous allons au terrain derrière l'école après nos cours.",
    chunks: splitWords("I love playing football with my friends. We go to the field behind the school after our classes."),
    timerSeconds: 120,
    topic: "Sports",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Mango Tree",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "There is a big mango tree in our garden. Many birds sing beautiful songs in the green leaves.",
    translation: "Il y a un grand manguier dans notre jardin. Beaucoup d'oiseaux chantent de belles chansons dans les feuilles vertes.",
    chunks: splitWords("There is a big mango tree in our garden. Many birds sing beautiful songs in the green leaves."),
    gaps: {
      positions: [2, 6, 11, 12], // mango tree, birds, green, leaves
      distractors: ["apple tree", "dogs", "red", "flowers", "cats", "blue"]
    },
    timerSeconds: 120,
    topic: "Nature",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Father",
    difficulty: "beginner",
    mode: "text-builder",
    text: "My father is a teacher. He works in a school. He is very kind and he helps me.",
    translation: "Mon père est enseignant. Il travaille dans une école. Il est très gentil et il m'aide.",
    chunks: splitWords("My father is a teacher. He works in a school. He is very kind and he helps me."),
    timerSeconds: 120,
    topic: "Family",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Hot Weather",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "The sun is very hot today. I want to drink cold water and sit under the big tree.",
    translation: "Le soleil est très chaud aujourd'hui. Je veux boire de l'eau froide et m'asseoir sous le grand arbre.",
    chunks: splitWords("The sun is very hot today. I want to drink cold water and sit under the big tree."),
    gaps: {
      positions: [2, 5, 7, 11], // hot, drink, water, tree
      distractors: ["cold", "eat", "juice", "car", "rainy", "house"]
    },
    timerSeconds: 120,
    topic: "Weather",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "New Clothes",
    difficulty: "beginner",
    mode: "text-builder",
    text: "Today I am wearing my blue shirt and black trousers. My shoes are new and they are clean.",
    translation: "Aujourd'hui, je porte ma chemise bleue et un pantalon noir. Mes chaussures sont neuves et elles sont propres.",
    chunks: splitWords("Today I am wearing my blue shirt and black trousers. My shoes are new and they are clean."),
    timerSeconds: 120,
    topic: "Clothing",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Delicious Dinner",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "For dinner, my family eats fufu and soup. It is very delicious. I always help my mother cook.",
    translation: "Pour le dîner, ma famille mange du fufu et de la soupe. C'est très délicieux. J'aide toujours ma mère à cuisiner.",
    chunks: splitWords("For dinner, my family eats fufu and soup. It is very delicious. I always help my mother cook."),
    gaps: {
      positions: [3, 4, 8, 12], // eats, fufu, delicious, cook
      distractors: ["drinks", "pizza", "bad", "sleep", "runs", "rice"]
    },
    timerSeconds: 120,
    topic: "Food",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Classroom",
    difficulty: "beginner",
    mode: "text-builder",
    text: "In my classroom, there are twenty students. We have a blackboard, many desks and a small brown clock.",
    translation: "Dans ma salle de classe, il y a vingt élèves. Nous avons un tableau noir, beaucoup de pupitres et une petite horloge marron.",
    chunks: splitWords("In my classroom, there are twenty students. We have a blackboard, many desks and a small brown clock."),
    timerSeconds: 120,
    topic: "School",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Sunday Morning",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "On Sunday morning, we go to church together. Then we visit our grandmother and eat a big lunch.",
    translation: "Le dimanche matin, nous allons à l'église ensemble. Ensuite, nous rendons visite à notre grand-mère et mangeons un grand déjeuner.",
    chunks: splitWords("On Sunday morning, we go to church together. Then we visit our grandmother and eat a big lunch."),
    gaps: {
      positions: [1, 4, 9, 12], // Sunday, church, grandmother, lunch
      distractors: ["Friday", "school", "friend", "breakfast", "Monday", "market"]
    },
    timerSeconds: 120,
    topic: "Family",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Healthy Teeth",
    difficulty: "beginner",
    mode: "text-builder",
    text: "I brush my teeth twice a day. It is important to have a healthy smile and strong teeth.",
    translation: "Je me brosse les dents deux fois par jour. C'est important d'avoir un sourire sain et des dents fortes.",
    chunks: splitWords("I brush my teeth twice a day. It is important to have a healthy smile and strong teeth."),
    timerSeconds: 120,
    topic: "Health",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Going to School",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I take the motorcycle to go to school. My brother rides his bicycle. It is very fast today.",
    translation: "Je prends la moto pour aller à l'école. Mon frère monte son vélo. C'est très rapide aujourd'hui.",
    chunks: splitWords("I take the motorcycle to go to school. My brother rides his bicycle. It is very fast today."),
    gaps: {
      positions: [2, 6, 8, 11], // motorcycle, rides, bicycle, fast
      distractors: ["car", "walks", "plane", "slow", "bus", "jumps"]
    },
    timerSeconds: 120,
    topic: "Transport",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Homework Time",
    difficulty: "beginner",
    mode: "text-builder",
    text: "In the evening, I do my homework. Then I watch television for thirty minutes before I go sleep.",
    translation: "Le soir, je fais mes devoirs. Ensuite, je regarde la télévision pendant trente minutes avant d'aller dormir.",
    chunks: splitWords("In the evening, I do my homework. Then I watch television for thirty minutes before I go sleep."),
    timerSeconds: 120,
    topic: "Daily Life",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Best Friend",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "Abla is my best friend. She is very clever and she always helps me with my math exercises.",
    translation: "Abla est ma meilleure amie. Elle est très intelligente et elle m'aide toujours avec mes exercices de mathématiques.",
    chunks: splitWords("Abla is my best friend. She is very clever and she always helps me with my math exercises."),
    gaps: {
      positions: [2, 6, 9, 11], // best, clever, helps, math
      distractors: ["worst", "angry", "hits", "music", "old", "sleeps"]
    },
    timerSeconds: 120,
    topic: "Friends",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Fresh Fruits",
    difficulty: "beginner",
    mode: "text-builder",
    text: "I like to eat bananas and pineapples. They are very sweet and good for my health every day.",
    translation: "J'aime manger des bananes et des ananas. Ils sont très sucrés et bons pour ma santé chaque jour.",
    chunks: splitWords("I like to eat bananas and pineapples. They are very sweet and good for my health every day."),
    timerSeconds: 120,
    topic: "Food",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My School Bag",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "My school bag is green. Inside, I have red pens, blue pencils and a yellow notebook for school.",
    translation: "Mon sac d'école est vert. À l'intérieur, j'ai des stylos rouges, des crayons bleus et un cahier jaune pour l'école.",
    chunks: splitWords("My school bag is green. Inside, I have red pens, blue pencils and a yellow notebook for school."),
    gaps: {
      positions: [2, 6, 8, 11], // green, pens, pencils, notebook
      distractors: ["black", "books", "shoes", "table", "white", "toys"]
    },
    timerSeconds: 120,
    topic: "Objects",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Beautiful Flowers",
    difficulty: "beginner",
    mode: "text-builder",
    text: "My mother grows many flowers in the garden. They are red, pink and white. They smell very good.",
    translation: "Ma mère fait pousser beaucoup de fleurs dans le jardin. Elles sont rouges, roses et blanches. Elles sentent très bon.",
    chunks: splitWords("My mother grows many flowers in the garden. They are red, pink and white. They smell very good."),
    timerSeconds: 120,
    topic: "Nature",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Music House",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I like to listen to music in my room. My brother plays the drums. We are very happy.",
    translation: "J'aime écouter de la musique dans ma chambre. Mon frère joue de la batterie. Nous sommes très heureux.",
    chunks: splitWords("I like to listen to music in my room. My brother plays the drums. We are very happy."),
    gaps: {
      positions: [2, 4, 7, 10], // music, room, drums, happy
      distractors: ["radio", "kitchen", "piano", "sad", "homework", "car"]
    },
    timerSeconds: 120,
    topic: "Hobbies",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
{
    title: "Rainy Day",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Weather",
    text: "Today it is raining. I stay at home and read my favourite book near the window.",
    translation: "Aujourd'hui, il pleut. Je reste à la maison et je lis mon livre préféré près de la fenêtre.",
    chunks: splitWords("Today it is raining. I stay at home and read my favourite book near the window."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Family",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Family",
    text: "I live with my parents and my sister. We are a happy family and we love each other.",
    translation: "J'habite avec mes parents et ma sœur. Nous sommes une famille heureuse et nous nous aimons les uns les autres.",
    chunks: splitWords("I live with my parents and my sister. We are a happy family and we love each other."),
    gaps: {
      positions: [4, 7, 12, 16], // parents, sister, family, love
      distractors: ["friends", "brother", "angry", "hate", "cousins", "sad"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Cooking Together",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Daily Life",
    text: "I help my mother in the kitchen. We prepare rice and fish for the whole family every evening.",
    translation: "J'aide ma mère dans la cuisine. Nous préparons du riz et du poisson pour toute la famille chaque soir.",
    chunks: splitWords("I help my mother in the kitchen. We prepare rice and fish for the whole family every evening."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Bicycle",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Transport",
    text: "My bicycle is red and very fast. I ride it every day to go to my friend's house.",
    translation: "Mon vélo est rouge et très rapide. Je le conduis chaque jour pour aller chez mon ami.",
    chunks: splitWords("My bicycle is red and very fast. I ride it every day to go to my friend's house."),
    gaps: {
      positions: [3, 6, 15, 17], // red, fast, friend's, house
      distractors: ["blue", "slow", "teacher's", "school", "green", "market"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Farm",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Nature",
    text: "My grandfather has a big farm. He has many cows, chickens and goats that eat green grass daily.",
    translation: "Mon grand-père a une grande ferme. Il a beaucoup de vaches, de poules et de chèvres qui mangent de l'herbe verte quotidiennement.",
    chunks: splitWords("My grandfather has a big farm. He has many cows, chickens and goats that eat green grass daily."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Drinking Water",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Health",
    text: "It is very important to drink water. I always carry a blue bottle in my small school bag.",
    translation: "Il est très important de boire de l'eau. Je transporte toujours une bouteille bleue dans mon petit sac d'école.",
    chunks: splitWords("It is very important to drink water. I always carry a blue bottle in my small school bag."),
    gaps: {
      positions: [5, 6, 12, 17], // drink, water, bottle, bag
      distractors: ["eat", "juice", "box", "pocket", "milk", "desk"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Beautiful Birds",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Nature",
    text: "I see many birds in the trees. They sing beautiful songs when the sun rises in the morning.",
    translation: "Je vois beaucoup d'oiseaux dans les arbres. Ils chantent de belles chansons quand le soleil se lève le matin.",
    chunks: splitWords("I see many birds in the trees. They sing beautiful songs when the sun rises in the morning."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "New Shoes",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Clothing",
    text: "My father bought me new shoes. They are black and very comfortable for playing football with my friends.",
    translation: "Mon père m'a acheté de nouvelles chaussures. Elles sont noires et très confortables pour jouer au football avec mes amis.",
    chunks: splitWords("My father bought me new shoes. They are black and very comfortable for playing football with my friends."),
    gaps: {
      positions: [4, 7, 13, 16], // shoes, black, football, friends
      distractors: ["hats", "white", "tennis", "parents", "shirts", "enemies"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Garden",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Nature",
    text: "There are many green vegetables in our garden. My mother picks tomatoes and peppers to cook good soup.",
    translation: "Il y a beaucoup de légumes verts dans notre jardin. Ma mère cueille des tomates et des piments pour cuisiner une bonne soupe.",
    chunks: splitWords("There are many green vegetables in our garden. My mother picks tomatoes and peppers to cook good soup."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Drawing Time",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Hobbies",
    text: "I love to draw pictures of my family. I use my colorful pencils to make a beautiful house.",
    translation: "J'aime dessiner des images de ma famille. J'utilise mes crayons colorés pour faire une belle maison.",
    chunks: splitWords("I love to draw pictures of my family. I use my colorful pencils to make a beautiful house."),
    gaps: {
      positions: [3, 4, 11, 16], // draw, pictures, pencils, house
      distractors: ["sing", "videos", "pens", "car", "run", "tree"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Big Elephant",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Animals",
    text: "An elephant is a very big animal. It has a long nose and two large ears for hearing.",
    translation: "Un éléphant est un très gros animal. Il a un long nez et deux grandes oreilles pour entendre.",
    chunks: splitWords("An elephant is a very big animal. It has a long nose and two large ears for hearing."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Clean Hands",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Health",
    text: "We must wash our hands with soap. It is good for our health before we eat our lunch.",
    translation: "Nous devons nous laver les mains avec du savon. C'est bon pour notre santé avant de manger notre déjeuner.",
    chunks: splitWords("We must wash our hands with soap. It is good for our health before we eat our lunch."),
    gaps: {
      positions: [2, 4, 7, 12], // wash, hands, soap, health
      distractors: ["dirty", "feet", "soup", "money", "paint", "sleep"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Beach",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Places",
    text: "I like to go to the beach in Lome. The water is blue and the sand is hot.",
    translation: "J'aime aller à la plage à Lomé. L'eau est bleue et le sable est chaud.",
    chunks: splitWords("I like to go to the beach in Lome. The water is blue and the sand is hot."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Brother",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Family",
    text: "My brother is five years old. He likes to play with his small car on the living room floor.",
    translation: "Mon frère a cinq ans. Il aime jouer avec sa petite voiture sur le sol du salon.",
    chunks: splitWords("My brother is five years old. He likes to play with his small car on the living room floor."),
    gaps: {
      positions: [3, 8, 12, 18], // five, play, car, floor
      distractors: ["ten", "eat", "bike", "ceiling", "eight", "window"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Rainy Weather",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Weather",
    text: "When it rains, I stay inside. I listen to the sound of water on the metal roof tonight.",
    translation: "Quand il pleut, je reste à l'intérieur. J'écoute le bruit de l'eau sur le toit en métal ce soir.",
    chunks: splitWords("When it rains, I stay inside. I listen to the sound of water on the metal roof tonight."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Hospital",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Life",
    text: "My aunt is a nurse at the hospital. She helps people who are sick and gives them medicine.",
    translation: "Ma tante est infirmière à l'hôpital. Elle aide les gens qui sont malades et leur donne des médicaments.",
    chunks: splitWords("My aunt is a nurse at the hospital. She helps people who are sick and gives them medicine."),
    gaps: {
      positions: [4, 7, 13, 17], // nurse, hospital, sick, medicine
      distractors: ["teacher", "market", "happy", "candy", "driver", "bread"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Fruit Juice",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Food",
    text: "I drink fresh orange juice every morning. It gives me energy to study well at my school today.",
    translation: "Je bois du jus d'orange frais chaque matin. Cela me donne de l'énergie pour bien étudier à mon école aujourd'hui.",
    chunks: splitWords("I drink fresh orange juice every morning. It gives me energy to study well at my school today."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Crossing the Road",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Safety",
    text: "Look left and right before you cross the road. It is very important for your safety every day.",
    translation: "Regardez à gauche et à droite avant de traverser la route. C'est très important pour votre sécurité chaque jour.",
    chunks: splitWords("Look left and right before you cross the road. It is very important for your safety every day."),
    gaps: {
      positions: [1, 3, 8, 15], // left, right, road, safety
      distractors: ["up", "down", "river", "money", "fast", "back"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Kind Friend",
    difficulty: "beginner",
    mode: "text-builder",
    topic: "Friends",
    text: "My friend Paul is very kind. He shares his bread with me during the break at our school.",
    translation: "Mon ami Paul est très gentil. Il partage son pain avec moi pendant la pause à notre école.",
    chunks: splitWords("My friend Paul is very kind. He shares his bread with me during the break at our school."),
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Moon",
    difficulty: "beginner",
    mode: "fill-gaps",
    topic: "Nature",
    text: "The moon is bright in the dark sky. I can see many small stars around it every night.",
    translation: "La lune est brillante dans le ciel sombre. Je peux voir beaucoup de petites étoiles autour d'elle chaque nuit.",
    chunks: splitWords("The moon is bright in the dark sky. I can see many small stars around it every night."),
    gaps: {
      positions: [1, 7, 12, 18], // moon, sky, stars, night
      distractors: ["sun", "ground", "birds", "day", "cloud", "tree"]
    },
    timerSeconds: 120,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The School Canteen",
    difficulty: "beginner",
    mode: "text-builder",
    text: "I eat my lunch at the school canteen. I usually have rice, beans and a cold drink today.",
    translation: "Je mange mon déjeuner à la cantine de l'école. D'habitude, je prends du riz, des haricots et une boisson fraîche aujourd'hui.",
    chunks: splitWords("I eat my lunch at the school canteen. I usually have rice, beans and a cold drink today."),
    timerSeconds: 120,
    topic: "School",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Little Sister",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "My little sister is very funny. She likes to play with her dolls and sing songs all day.",
    translation: "Ma petite sœur est très amusante. Elle aime jouer avec ses poupées et chanter des chansons toute la journée.",
    chunks: splitWords("My little sister is very funny. She likes to play with her dolls and sing songs all day."),
    gaps: {
      positions: [2, 5, 9, 12], // sister, funny, play, dolls
      distractors: ["brother", "angry", "sleep", "cars", "mother", "sad"]
    },
    timerSeconds: 120,
    topic: "Family",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Busy Street",
    difficulty: "beginner",
    mode: "text-builder",
    text: "Lome has many busy streets. I see many cars, motorcycles and people walking to their offices every morning.",
    translation: "Lomé a beaucoup de rues animées. Je vois beaucoup de voitures, de motos et de gens marchant vers leurs bureaux chaque matin.",
    chunks: splitWords("Lome has many busy streets. I see many cars, motorcycles and people walking to their offices every morning."),
    timerSeconds: 120,
    topic: "Places",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Brushing Teeth",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I brush my teeth every morning and night. It is very important to keep my smile bright and healthy.",
    translation: "Je me brosse les dents chaque matin et chaque soir. C'est très important pour garder mon sourire éclatant et sain.",
    chunks: splitWords("I brush my teeth every morning and night. It is very important to keep my smile bright and healthy."),
    gaps: {
      positions: [1, 5, 10, 15], // brush, night, important, healthy
      distractors: ["wash", "day", "easy", "dirty", "break", "small"]
    },
    timerSeconds: 120,
    topic: "Health",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Planting a Tree",
    difficulty: "beginner",
    mode: "text-builder",
    text: "My brother and I plant a tree in the garden. We give it water every day to help it.",
    translation: "Mon frère et moi plantons un arbre dans le jardin. Nous lui donnons de l'eau chaque jour pour l'aider.",
    chunks: splitWords("My brother and I plant a tree in the garden. We give it water every day to help it."),
    timerSeconds: 120,
    topic: "Nature",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Red Pen",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I use a red pen to correct my mistakes. My teacher says it helps me to learn better.",
    translation: "J'utilise un stylo rouge pour corriger mes fautes. Mon professeur dit que cela m'aide à mieux apprendre.",
    chunks: splitWords("I use a red pen to correct my mistakes. My teacher says it helps me to learn better."),
    gaps: {
      positions: [3, 7, 10, 15], // pen, mistakes, teacher, learn
      distractors: ["pencil", "books", "father", "sleep", "bag", "errors"]
    },
    timerSeconds: 120,
    topic: "School",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Post Office",
    difficulty: "beginner",
    mode: "text-builder",
    text: "The post office is near the bank. My father goes there to send a letter to my uncle.",
    translation: "La poste est près de la banque. Mon père y va pour envoyer une lettre à mon oncle.",
    chunks: splitWords("The post office is near the bank. My father goes there to send a letter to my uncle."),
    timerSeconds: 120,
    topic: "Places",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Playing the Piano",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "My cousin plays the piano very well. I like to listen to the music when I visit her house.",
    translation: "Ma cousine joue très bien du piano. J'aime écouter la musique quand je visite sa maison.",
    chunks: splitWords("My cousin plays the piano very well. I like to listen to the music when I visit her house."),
    gaps: {
      positions: [2, 5, 10, 16], // plays, well, listen, house
      distractors: ["eats", "bad", "talk", "school", "runs", "fast"]
    },
    timerSeconds: 120,
    topic: "Hobbies",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Sunny Day",
    difficulty: "beginner",
    mode: "text-builder",
    text: "The sun is shining in the blue sky. I wear my sunglasses and a hat to go outside.",
    translation: "Le soleil brille dans le ciel bleu. Je porte mes lunettes de soleil et un chapeau pour sortir dehors.",
    chunks: splitWords("The sun is shining in the blue sky. I wear my sunglasses and a hat to go outside."),
    timerSeconds: 120,
    topic: "Weather",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Reading a Story",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I read a story book before I go to bed. It helps me to have very good dreams.",
    translation: "Je lis un livre d'histoires avant de me coucher. Cela m'aide à faire de très bons rêves.",
    chunks: splitWords("I read a story book before I go to bed. It helps me to have very good dreams."),
    gaps: {
      positions: [1, 7, 10, 16], // read, bed, helps, dreams
      distractors: ["write", "school", "hits", "food", "cook", "water"]
    },
    timerSeconds: 120,
    topic: "Hobbies",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Bakery",
    difficulty: "beginner",
    mode: "text-builder",
    text: "The bakery smells like fresh bread. I buy two small cakes for my brother and my sister today.",
    translation: "La boulangerie sent le pain frais. J'achète deux petits gâteaux pour mon frère et ma sœur aujourd'hui.",
    chunks: splitWords("The bakery smells like fresh bread. I buy two small cakes for my brother and my sister today."),
    timerSeconds: 120,
    topic: "Places",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Grandmother's Kitchen",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "My grandmother cooks delicious soup in her kitchen. The smell makes me very hungry before the big lunch.",
    translation: "Ma grand-mère cuisine une soupe délicieuse dans sa cuisine. L'odeur me donne très faim avant le grand déjeuner.",
    chunks: splitWords("My grandmother cooks delicious soup in her kitchen. The smell makes me very hungry before the big lunch."),
    gaps: {
      positions: [2, 7, 9, 17], // cooks, kitchen, smell, lunch
      distractors: ["plays", "bedroom", "sound", "breakfast", "walks", "car"]
    },
    timerSeconds: 120,
    topic: "Family",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Walking to School",
    difficulty: "beginner",
    mode: "text-builder",
    text: "I walk to school with my neighbors. We talk about our favorite games and our homework on the way.",
    translation: "Je marche vers l'école avec mes voisins. Nous parlons de nos jeux préférés et de nos devoirs en chemin.",
    chunks: splitWords("I walk to school with my neighbors. We talk about our favorite games and our homework on the way."),
    timerSeconds: 120,
    topic: "Daily Life",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A New Computer",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "We have a new computer in our classroom. We use it to learn how to type and search.",
    translation: "Nous avons un nouvel ordinateur dans notre classe. Nous l'utilisons pour apprendre à taper et à faire des recherches.",
    chunks: splitWords("We have a new computer in our classroom. We use it to learn how to type and search."),
    gaps: {
      positions: [4, 7, 13, 17], // computer, classroom, learn, search
      distractors: ["television", "garden", "forget", "sleep", "radio", "eat"]
    },
    timerSeconds: 120,
    topic: "School",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Flying a Kite",
    difficulty: "beginner",
    mode: "text-builder",
    text: "The wind is strong today. I go to the field to fly my blue and yellow kite high.",
    translation: "Le vent est fort aujourd'hui. Je vais au terrain pour faire voler mon cerf-volant bleu et jaune très haut.",
    chunks: splitWords("The wind is strong today. I go to the field to fly my blue and yellow kite high."),
    timerSeconds: 120,
    topic: "Hobbies",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Buying Mangoes",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I buy sweet mangoes at the corner shop. They are very cheap and they taste very good today.",
    translation: "J'achète des mangues sucrées à la boutique du coin. Elles sont très bon marché et elles ont très bon goût aujourd'hui.",
    chunks: splitWords("I buy sweet mangoes at the corner shop. They are very cheap and they taste very good today."),
    gaps: {
      positions: [2, 7, 12, 15], // mangoes, shop, cheap, taste
      distractors: ["apples", "school", "expensive", "smell", "bread", "fast"]
    },
    timerSeconds: 120,
    topic: "Food",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Clean Classroom",
    difficulty: "beginner",
    mode: "text-builder",
    text: "We clean our classroom every Friday. We sweep the floor and we wipe all the big brown desks.",
    translation: "Nous nettoyons notre salle de classe chaque vendredi. Nous balayons le sol et nous essuyons tous les grands bureaux marron.",
    chunks: splitWords("We clean our classroom every Friday. We sweep the floor and we wipe all the big brown desks."),
    timerSeconds: 120,
    topic: "School",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Going to the Doctor",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "I go to the doctor when I feel sick. He gives me medicine to help me feel better.",
    translation: "Je vais chez le médecin quand je me sens malade. Il me donne des médicaments pour m'aider à me sentir mieux.",
    chunks: splitWords("I go to the doctor when I feel sick. He gives me medicine to help me feel better."),
    gaps: {
      positions: [4, 8, 12, 17], // doctor, sick, medicine, better
      distractors: ["teacher", "happy", "candy", "worse", "market", "sad"]
    },
    timerSeconds: 120,
    topic: "Health",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Blue Ocean",
    difficulty: "beginner",
    mode: "text-builder",
    text: "The ocean in Lome is very beautiful. I like to watch the big waves from the sandy beach.",
    translation: "L'océan à Lomé est très beau. J'aime regarder les grandes vagues depuis la plage de sable.",
    chunks: splitWords("The ocean in Lome is very beautiful. I like to watch the big waves from the sandy beach."),
    timerSeconds: 120,
    topic: "Nature",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Favorite Sport",
    difficulty: "beginner",
    mode: "fill-gaps",
    text: "Basketball is my favorite sport. I play with my team every Wednesday afternoon after the long school day.",
    translation: "Le basket-ball est mon sport préféré. Je joue avec mon équipe chaque mercredi après-midi après la longue journée d'école.",
    chunks: splitWords("Basketball is my favorite sport. I play with my team every Wednesday afternoon after the long school day."),
    gaps: {
      positions: [0, 4, 10, 18], // Basketball, sport, team, day
      distractors: ["Football", "food", "family", "night", "Tennis", "lesson"]
    },
    timerSeconds: 120,
    topic: "Sports",
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  }
];

const intermediateTexts: Omit<TextBuilderLevel, "id">[] = [
   {
    title: "Last Summer Vacation",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Memories",
    text: "Last summer, my family and I decided to travel to the north of Togo. We visited the beautiful Koutammakou and saw the amazing Takienta houses. It was a very long journey by bus, but we were so happy to discover our country's history. We took many photos and bought local souvenirs for our friends.",
    translation: "L'été dernier, ma famille et moi avons décidé de voyager dans le nord du Togo. Nous avons visité le magnifique Koutammakou et vu les incroyables maisons Takienta. C'était un très long voyage en bus, mais nous étions si heureux de découvrir l'histoire de notre pays. Nous avons pris beaucoup de photos et acheté des souvenirs locaux pour nos amis.",
    chunks: splitWords("Last summer, my family and I decided to travel to the north of Togo. We visited the beautiful Koutammakou and saw the amazing Takienta houses. It was a very long journey by bus, but we were so happy to discover our country's history. We took many photos and bought local souvenirs for our friends."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Childhood Memories",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Memories",
    text: "When I was a little child, I used to play outside with all my neighbors. We didn't have expensive toys or video games, so we made our own balls using plastic bags and old strings. Every evening, our parents called us for dinner and we had to wash our hands and feet before entering the clean house.",
    translation: "Quand j'étais petit, j'avais l'habitude de jouer dehors avec tous mes voisins. Nous n'avions pas de jouets chers ou de jeux vidéo, alors nous fabriquions nos propres ballons avec des sacs en plastique et de vieilles ficelles. Chaque soir, nos parents nous appelaient pour le dîner et nous devions nous laver les mains et les pieds avant d'entrer dans la maison propre.",
    chunks: splitWords("When I was a little child, I used to play outside with all my neighbors. We didn't have expensive toys or video games, so we made our own balls using plastic bags and old strings. Every evening, our parents called us for dinner and we had to wash our hands and feet before entering the clean house."),
    gaps: {
      positions: [7, 13, 22, 36], // used, neighbors, expensive, evening
      distractors: ["wanted", "teachers", "cheap", "morning", "tried", "cousins"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "First Day at School",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "School",
    text: "I still remember my very first day at secondary school three years ago. I was wearing a brand new khaki uniform and carrying a heavy bag. I felt nervous because I didn't know anyone in my classroom. Fortunately, a friendly boy sat next to me and we started talking about our favorite hobbies and football teams.",
    translation: "Je me souviens encore de mon tout premier jour au collège il y a trois ans. Je portais un uniforme kaki tout neuf et je transportais un sac lourd. Je me sentais nerveux parce que je ne connaissais personne dans ma classe. Heureusement, un garçon sympathique s'est assis à côté de moi et nous avons commencé à parler de nos loisirs préférés et de nos équipes de football.",
    chunks: splitWords("I still remember my very first day at secondary school three years ago. I was wearing a brand new khaki uniform and carrying a heavy bag. I felt nervous because I didn't know anyone in my classroom. Fortunately, a friendly boy sat next to me and we started talking about our favorite hobbies and football teams."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Surprise Party",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Family",
    text: "Last month, we organized a surprise party for my sister's fifteenth birthday. My mother baked a delicious cake with chocolate and fresh mangoes. My father bought colorful balloons and we decorated the whole living room very secretly. When she arrived from school, we all shouted 'Happy Birthday!' and she started crying with joy.",
    translation: "Le mois dernier, nous avons organisé une fête surprise pour le quinzième anniversaire de ma sœur. Ma mère a cuit un délicieux gâteau au chocolat et aux mangues fraîches. Mon père a acheté des ballons colorés et nous avons décoré tout le salon très secrètement. Quand elle est arrivée de l'école, nous avons tous crié 'Joyeux anniversaire !' et elle a commencé à pleurer de joie.",
    chunks: splitWords("Last month, we organized a surprise party for my sister's fifteenth birthday. My mother baked a delicious cake with chocolate and fresh mangoes. My father bought colorful balloons and we decorated the whole living room very secretly. When she arrived from school, we all shouted 'Happy Birthday!' and she started crying with joy."),
    gaps: {
      positions: [3, 11, 23, 31], // organized, birthday, decorated, secretly
      distractors: ["watched", "holiday", "cleaned", "loudly", "made", "wedding"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Village Festival",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Culture",
    text: "Two years ago, I went to my parents' village for a festival. There was traditional music played with drums and people were dancing everywhere. I tasted local dishes like pounded yam and spicy sauce. It was a wonderful chance to learn about my cultural roots and meet my extended family.",
    translation: "Il y a deux ans, je suis allé au village de mes parents pour un festival. Il y avait de la musique traditionnelle jouée avec des tambours et les gens dansaient partout. J'ai goûté des plats locaux comme l'igname pilée et la sauce épicée. C'était une occasion merveilleuse d'en apprendre davantage sur mes racines culturelles et de rencontrer ma famille élargie.",
    chunks: splitWords("Two years ago, I went to my parents' village for a festival. There was traditional music played with drums and people were dancing everywhere. I tasted local dishes like pounded yam and spicy sauce. It was a wonderful chance to learn about my cultural roots and meet my extended family."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Learning to Ride",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Life",
    text: "My older brother taught me how to ride a bicycle five years ago. At the beginning, I was very afraid of falling down on the road. He held the seat for a long time while I was trying to pedal. Suddenly, he let go and I realized I was riding all by myself like a champion.",
    translation: "Mon frère aîné m'a appris à faire du vélo il y a cinq ans. Au début, j'avais très peur de tomber sur la route. Il a tenu le siège pendant un long moment alors que j'essayais de pédaler. Soudain, he a lâché et j'ai réalisé que je roulais tout seul comme un champion.",
    chunks: splitWords("My older brother taught me how to ride a bicycle five years ago. At the beginning, I was very afraid of falling down on the road. He held the seat for a long time while I was trying to pedal. Suddenly, he let go and I realized I was riding all by myself like a champion."),
    gaps: {
      positions: [3, 15, 23, 33], // taught, afraid, seat, pedal
      distractors: ["showed", "happy", "handle", "run", "gave", "brave"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Rainy Adventure",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Weather",
    text: "Last Friday afternoon, a heavy rain started falling while we were walking back home. We didn't have an umbrella, so we ran as fast as we possibly could. By the time we arrived, we were completely wet from head to toe. My mother gave us warm tea and dry clothes to make sure we didn't catch a cold.",
    translation: "Vendredi dernier après-midi, une forte pluie a commencé à tomber alors que nous rentrions à la maison. Nous n'avions pas de parapluie, alors nous avons couru aussi vite que possible. Au moment où nous sommes arrivés, nous étions complètement mouillés de la tête aux pieds. Ma mère nous a donné du thé chaud et des vêtements secs pour s'assurer que nous ne prenions pas froid.",
    chunks: splitWords("Last Friday afternoon, a heavy rain started falling while we were walking back home. We didn't have an umbrella, so we ran as fast as we possibly could. By the time we arrived, we were completely wet from head to toe. My mother gave us warm tea and dry clothes to make sure we didn't catch a cold."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My First Trip",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Travel",
    text: "My very first trip to another city was to Aneho with my school. We travelled in a big yellow bus and we sang many songs together. We saw the beautiful lagoon and learned about the colonial history of the region. I brought back some fresh fish and beautiful shells for my little brother to see.",
    translation: "Mon tout premier voyage dans une autre ville était à Aného avec mon école. Nous avons voyagé dans un grand bus jaune et nous avons chanté beaucoup de chansons ensemble. Nous avons vu la belle lagune et appris l'histoire coloniale de la région. J'ai rapporté du poisson frais et de beaux coquillages pour que mon petit frère puisse les voir.",
    chunks: splitWords("My very first trip to another city was to Aneho with my school. We travelled in a big yellow bus and we sang many songs together. We saw the beautiful lagoon and learned about the colonial history of the region. I brought back some fresh fish and beautiful shells for my little brother to see."),
    gaps: {
      positions: [9, 13, 27, 39], // Aneho, travelled, lagoon, shells
      distractors: ["Lome", "walked", "forest", "rocks", "Kpalime", "flew"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Football Final",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Sports",
    text: "Our school team played the final of the tournament last semester. The match was very difficult and both teams played very well. In the last few minutes, our captain scored a goal with a powerful head shot. All the students ran onto the field to celebrate our victory with the happy players.",
    translation: "L'équipe de notre école a joué la finale du tournoi le semestre dernier. Le match était très difficile et les deux équipes ont très bien joué. Dans les dernières minutes, notre capitaine a marqué un but d'un puissant coup de tête. Tous les élèves ont couru sur le terrain pour célébrer notre victoire avec les joueurs heureux.",
    chunks: splitWords("Our school team played the final of the tournament last semester. The match was very difficult and both teams played very well. In the last few minutes, our captain scored a goal with a powerful head shot. All the students ran onto the field to celebrate our victory with the happy players."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Weekend at the Beach",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Leisure",
    text: "Last Sunday, my cousins invited me to spend the day at the beach. We played in the sand and built a huge castle with many towers. The weather was perfect and the sea breeze felt very cool. We ate grilled fish and drank coconut water under a large umbrella until sunset.",
    translation: "Dimanche dernier, mes cousins m'ont invité à passer la journée à la plage. Nous avons joué dans le sable et construit un énorme château avec beaucoup de tours. Le temps était parfait et la brise marine était très fraîche. Nous avons mangé du poisson grillé et bu de l'eau de coco sous un grand parasol jusqu'au coucher du soleil.",
    chunks: splitWords("Last Sunday, my cousins invited me to spend the day at the beach. We played in the sand and built a huge castle with many towers. The weather was perfect and the sea breeze felt very cool. We ate grilled fish and drank coconut water under a large umbrella until sunset."),
    gaps: {
      positions: [6, 17, 26, 40], // invited, castle, breeze, sunset
      distractors: ["asked", "house", "storm", "morning", "forced", "wall"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Aunt's Wedding",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Family",
    text: "I attended my favorite aunt's wedding ceremony last December. She was wearing a magnificent white dress and looked like a queen. There were hundreds of guests from different cities and plenty of delicious food. We danced all night long to the rhythm of modern and traditional African music.",
    translation: "J'ai assisté à la cérémonie de mariage de ma tante préférée en décembre dernier. Elle portait une magnifique robe blanche et ressemblait à une reine. Il y avait des centaines d'invités venus de différentes villes et beaucoup de nourriture délicieuse. Nous avons dansé toute la nuit au rythme de la musique africaine moderne et traditionnelle.",
    chunks: splitWords("I attended my favorite aunt's wedding ceremony last December. She was wearing a magnificent white dress and looked like a queen. There were hundreds of guests from different cities and plenty of delicious food. We danced all night long to the rhythm of modern and traditional African music."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Lost Keys",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Life",
    text: "Yesterday morning, I couldn't find my house keys before leaving. I looked under the sofa, inside my bag and even in the kitchen. I was very worried because I was already late for my exam. Finally, I found them in my trouser pocket where I had put them the night before.",
    translation: "Hier matin, je ne trouvais pas mes clés de maison avant de partir. J'ai regardé sous le canapé, dans mon sac et même dans la cuisine. J'étais très inquiet parce que j'étais déjà en retard pour mon examen. Finalement, je les ai trouvées dans la poche de mon pantalon où je les avais mises la veille au soir.",
    chunks: splitWords("Yesterday morning, I couldn't find my house keys before leaving. I looked under the sofa, inside my bag and even in the kitchen. I was very worried because I was already late for my exam. Finally, I found them in my trouser pocket where I had put them the night before."),
    gaps: {
      positions: [11, 23, 30, 36], // leaving, worried, found, pocket
      distractors: ["sleeping", "happy", "lost", "shoes", "working", "sad"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Science Project",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "School",
    text: "Last month, our teacher asked us to build a small volcano. We used sand, plastic bottles and some special ingredients to make it work. When the eruption happened, everyone in class was very impressed by the red lava. We received the best mark for our hard work and our creative presentation.",
    translation: "Le mois dernier, notre professeur nous a demandé de construire un petit volcan. Nous avons utilisé du sable, des bouteilles en plastique et quelques ingrédients spéciaux pour le faire fonctionner. Quand l'éruption s'est produite, tout le monde en classe a été très impressionné par la lave rouge. Nous avons reçu la meilleure note pour our travail acharné et notre présentation créative.",
    chunks: splitWords("Last month, our teacher asked us to build a small volcano. We used sand, plastic bottles and some special ingredients to make it work. When the eruption happened, everyone in class was very impressed by the red lava. We received the best mark for our hard work and our creative presentation."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Old Mango Tree",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Nature",
    text: "When my father was a teenager, he planted a mango tree in our yard. Now, it is a massive tree that provides a lot of shade during hot days. Every year, we harvest hundreds of sweet mangoes and share them with our kind neighbors. It is my favorite place to read my books.",
    translation: "Quand mon père était adolescent, il a planté un manguier dans notre cour. Maintenant, c'est un arbre massif qui offre beaucoup d'ombre pendant les jours de chaleur. Chaque année, nous récoltons des centaines de mangues sucrées et nous les partageons avec nos gentils voisins. C'est mon endroit préféré pour lire mes livres.",
    chunks: splitWords("When my father was a teenager, he planted a mango tree in our yard. Now, it is a massive tree that provides a lot of shade during hot days. Every year, we harvest hundreds of sweet mangoes and share them with our kind neighbors. It is my favorite place to read my books."),
    gaps: {
      positions: [4, 15, 23, 30], // teenager, massive, shade, harvest
      distractors: ["child", "small", "sunlight", "buy", "adult", "weak"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Broken Window",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Life",
    text: "Two days ago, we were playing football in the street with my friends. I kicked the ball very hard but it went in the wrong direction. It hit our neighbor's window and the glass broke into many small pieces. I went to apologize and promised to help him clean the mess and repair it.",
    translation: "Il y a deux jours, nous jouions au football dans la rue avec mes amis. J'ai frappé le ballon très fort mais il est allé dans la mauvaise direction. Il a frappé la fenêtre de notre voisin et le verre s'est brisé en de nombreux petits morceaux. Je suis allé m'excuser et j'ai promis de l'aider à nettoyer le désordre et à réparer.",
    chunks: splitWords("Two days ago, we were playing football in the street with my friends. I kicked the ball very hard but it went in the wrong direction. It hit our neighbor's window and the glass broke into many small pieces. I went to apologize and promised to help him clean the mess and repair it."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Helping at the Farm",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Nature",
    text: "During the last holidays, I helped my grandfather on his farm. We woke up at dawn to feed the hungry animals and clean the barn. I learned how to plant corn and protect the crops from the insects. It was hard work, but I felt very proud of being useful.",
    translation: "Pendant les dernières vacances, j'ai aidé mon grand-père dans sa ferme. Nous nous sommes réveillés à l'aube pour nourrir les animaux affamés et nettoyer la grange. J'ai appris à planter du maïs et à protéger les cultures contre les insectes. C'était un travail difficile, mais je me sentais très fier d'être utile.",
    chunks: splitWords("During the last holidays, I helped my grandfather on his farm. We woke up at dawn to feed the hungry animals and clean the barn. I learned how to plant corn and protect the crops from the insects. It was hard work, but I felt very proud of being useful."),
    gaps: {
      positions: [11, 13, 22, 36], // dawn, feed, crops, useful
      distractors: ["night", "eat", "flowers", "famous", "noon", "scare"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A New Friend",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Friends",
    text: "I met a new friend at the library last Wednesday. He was looking for the same history book as me. We started a long conversation about our favorite kings and ancient civilizations. Now, we meet every weekend to study together and share our knowledge about our country's past.",
    translation: "J'ai rencontré un nouvel ami à la bibliothèque mercredi dernier. Il cherchait le même livre d'histoire que moi. Nous avons commencé une longue conversation sur nos rois préférés et les anciennes civilisations. Maintenant, nous nous rencontrons chaque week-end pour étudier ensemble et partager nos connaissances sur le passé de notre pays.",
    chunks: splitWords("I met a new friend at the library last Wednesday. He was looking for the same history book as me. We started a long conversation about our favorite kings and ancient civilizations. Now, we meet every weekend to study together and share our knowledge about our country's past."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Night Market",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Places",
    text: "Last Friday, my mother took me to the night market. It was full of light and the smell of spicy food was everywhere. We saw many traders selling beautiful fabrics and handmade jewelry. We bought some fried yams and enjoyed the lively atmosphere of the city after dark.",
    translation: "Vendredi dernier, ma mère m'a emmené au marché de nuit. C'était plein de lumière et l'odeur de nourriture épicée était partout. Nous avons vu de nombreux commerçants vendre de beaux tissus et des bijoux faits main. Nous avons acheté des ignames frites et profité de l'atmosphère animée de la ville après la tombée de la nuit.",
    chunks: splitWords("Last Friday, my mother took me to the night market. It was full of light and the smell of spicy food was everywhere. We saw many traders selling beautiful fabrics and handmade jewelry. We bought some fried yams and enjoyed the lively atmosphere of the city after dark."),
    gaps: {
      positions: [17, 23, 26, 36], // spicy, traders, fabrics, atmosphere
      distractors: ["sweet", "doctors", "cars", "weather", "cold", "drivers"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "My Grandmother's Story",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Culture",
    text: "Yesterday evening, my grandmother told us a fascinating story about our ancestors. We sat in a circle around the small lamp while she spoke. She told us how they survived difficult times with courage and great wisdom. Her voice was soft but her words were very powerful and inspiring.",
    translation: "Hier soir, ma grand-mère nous a raconté une histoire fascinante sur nos ancêtres. Nous nous sommes assis en cercle autour de la petite lampe pendant qu'elle parlait. Elle nous a raconté comment ils avaient survécu à des temps difficiles avec courage et une grande sagesse. Sa voix était douce mais ses mots étaient très puissants et inspirants.",
    chunks: splitWords("Yesterday evening, my grandmother told us a fascinating story about our ancestors. We sat in a circle around the small lamp while she spoke. She told us how they survived difficult times with courage and great wisdom. Her voice was soft but her words were very powerful and inspiring."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "A Day in the Mountains",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Nature",
    text: "Last year, we went for a hike in the mountains near Kpalime. The air was very fresh and we saw a beautiful waterfall in the forest. We walked for many hours and felt a bit tired, but the amazing view from the top was worth all our physical efforts.",
    translation: "L'année dernière, nous sommes allés faire une randonnée dans les montagnes près de Kpalimé. L'air était très frais et nous avons vu une magnifique cascade dans la forêt. Nous avons marché pendant de nombreuses heures et nous nous sentions un peu fatigués, mais la vue incroyable du sommet valait tous nos efforts physiques.",
    chunks: splitWords("Last year, we went for a hike in the mountains near Kpalime. The air was very fresh and we saw a beautiful waterfall in the forest. We walked for many hours and felt a bit tired, but the amazing view from the top was worth all our physical efforts."),
    gaps: {
      positions: [7, 11, 18, 25], // hike, Kpalime, waterfall, tired
      distractors: ["swim", "Lome", "beach", "happy", "run", "Aneho"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Water Cycle",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Environment",
    text: "The water cycle describes how water evaporates from the surface of the earth, rises into the atmosphere, cools and condenses into rain or snow in clouds, and falls again to the surface as precipitation. This continuous process is vital for the survival of all living organisms and the regulation of global temperatures.",
    translation: "Le cycle de l'eau décrit comment l'eau s'évapore de la surface de la terre, s'élève dans l'atmosphère, se refroidit et se condense en pluie ou en neige dans les nuages, et retombe à la surface sous forme de précipitations. Ce processus continu est vital pour la survie de tous les organismes vivants et la régulation des températures mondiales.",
    chunks: splitWords("The water cycle describes how water evaporates from the surface of the earth, rises into the atmosphere, cools and condenses into rain or snow in clouds, and falls again to the surface as precipitation. This continuous process is vital for the survival of all living organisms and the regulation of global temperatures."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Tropical Rainforests",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Nature",
    text: "Tropical rainforests are often called the lungs of the planet because they produce a significant amount of the world's oxygen. These forests are home to millions of species of plants and animals, many of which are not found anywhere else. Protecting these ecosystems is crucial for maintaining biodiversity and fighting climate change.",
    translation: "Les forêts tropicales sont souvent appelées les poumons de la planète car elles produisent une quantité importante de l'oxygène mondial. Ces forêts abritent des millions d'espèces de plantes et d'animaux, dont beaucoup ne se trouvent nulle part ailleurs. La protection de ces écosystèmes est cruciale pour maintenir la biodiversité et lutter contre le changement climatique.",
    chunks: splitWords("Tropical rainforests are often called the lungs of the planet because they produce a significant amount of the world's oxygen. These forests are home to millions of species of plants and animals, many of which are not found anywhere else. Protecting these ecosystems is crucial for maintaining biodiversity and fighting climate change."),
    gaps: {
      positions: [7, 13, 27, 43], // lungs, oxygen, species, biodiversity
      distractors: ["heart", "carbon", "groups", "pollution", "stomach", "weather"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Solar Energy",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Technology",
    text: "Solar energy is a renewable power source that comes directly from the sun's rays. It is captured using special panels that convert sunlight into electricity for homes and industries. Unlike fossil fuels, solar power does not produce harmful greenhouse gases, making it a very clean and sustainable solution for the future of Africa.",
    translation: "L'énergie solaire est une source d'énergie renouvelable qui provient directement des rayons du soleil. Elle est captée à l'aide de panneaux spéciaux qui convertissent la lumière du soleil en électricité pour les maisons et les industries. Contrairement aux combustibles fossiles, l'énergie solaire ne produit pas de gaz à effet de serre nocifs, ce qui en fait une solution très propre et durable pour l'avenir de l'Afrique.",
    chunks: splitWords("Solar energy is a renewable power source that comes directly from the sun's rays. It is captured using special panels that convert sunlight into electricity for homes and industries. Unlike fossil fuels, solar power does not produce harmful greenhouse gases, making it a very clean and sustainable solution for the future of Africa."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Desertification",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Environment",
    text: "Desertification is a process where fertile land becomes desert, typically as a result of drought, deforestation, or inappropriate agriculture. In many parts of West Africa, this phenomenon threatens food security and forces populations to migrate. Planting trees and practicing sustainable farming are effective ways to stop the expansion of the desert and protect the soil.",
    translation: "La désertification est un processus par lequel une terre fertile devient un désert, généralement à la suite d'une sécheresse, de la déforestation ou d'une agriculture inappropriée. Dans de nombreuses régions d'Afrique de l'Ouest, ce phénomène menace la sécurité alimentaire et force les populations à migrer. Planter des arbres et pratiquer une agriculture durable sont des moyens efficaces d'arrêter l'expansion du désert et de protéger le sol.",
    chunks: splitWords("Desertification is a process where fertile land becomes desert, typically as a result of drought, deforestation, or inappropriate agriculture. In many parts of West Africa, this phenomenon threatens food security and forces populations to migrate. Planting trees and practicing sustainable farming are effective ways to stop the expansion of the desert and protect the soil."),
    gaps: {
      positions: [5, 13, 27, 41], // fertile, drought, security, expansion
      distractors: ["dry", "rain", "safety", "growth", "rich", "storm"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Role of Bees",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Nature",
    text: "Bees play a vital role in the environment by pollinating plants and flowers while they search for nectar. This process is necessary for the production of many fruits, vegetables, and seeds that humans eat every day. Without these small insects, the global food chain would be in danger, and many plant species would eventually disappear.",
    translation: "Les abeilles jouent un rôle vital dans l'environnement en pollinisant les plantes et les fleurs pendant qu'elles cherchent du nectar. Ce processus est nécessaire à la production de nombreux fruits, légumes et graines que les humains mangent chaque jour. Sans ces petits insectes, la chaîne alimentaire mondiale serait en danger et de nombreuses espèces végétales finiraient par disparaître.",
    chunks: splitWords("Bees play a vital role in the environment by pollinating plants and flowers while they search for nectar. This process is necessary for the production of many fruits, vegetables, and seeds that humans eat every day. Without these small insects, the global food chain would be in danger, and many plant species would eventually disappear."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Plastic Pollution",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Environment",
    text: "Plastic pollution is a major environmental problem that affects the oceans and wildlife across the globe. Millions of tons of plastic waste end up in the sea every year, hurting fish and birds that mistake it for food. Reducing the use of single-use plastics and improving recycling systems are essential steps to protect our natural world.",
    translation: "La pollution plastique est un problème environnemental majeur qui affecte les océans et la faune sauvage à travers le monde. Des millions de tonnes de déchets plastiques finissent dans la mer chaque année, blessant les poissons et les oiseaux qui les confondent avec de la nourriture. Réduire l'utilisation de plastiques à usage unique et améliorer les systèmes de recyclage sont des étapes essentielles pour protéger notre monde naturel.",
    chunks: splitWords("Plastic pollution is a major environmental problem that affects the oceans and wildlife across the globe. Millions of tons of plastic waste end up in the sea every year, hurting fish and birds that mistake it for food. Reducing the use of single-use plastics and improving recycling systems are essential steps to protect our natural world."),
    gaps: {
      positions: [10, 20, 31, 38], // affects, sea, mistake, recycling
      distractors: ["cleans", "land", "take", "burning", "helps", "beach"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The African Elephant",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Nature",
    text: "The African elephant is the largest land animal on Earth and is known for its great intelligence and social bonds. These majestic creatures live in various habitats, from savannas to thick forests, and they play a key role in maintaining the ecosystem. Unfortunately, they face threats from habitat loss and illegal hunting for their valuable ivory tusks.",
    translation: "L'éléphant d'Afrique est le plus grand animal terrestre sur Terre et est connu pour sa grande intelligence et ses liens sociaux. Ces créatures majestueuses vivent dans divers habitats, des savanes aux forêts denses, et elles jouent un rôle clé dans le maintien de l'écosystème. Malheureusement, elles sont menacées par la perte d'habitat et la chasse illégale pour leurs précieuses défenses en ivoire.",
    chunks: splitWords("The African elephant is the largest land animal on Earth and is known for its great intelligence and social bonds. These majestic creatures live in various habitats, from savannas to thick forests, and they play a key role in maintaining the ecosystem. Unfortunately, they face threats from habitat loss and illegal hunting for their valuable ivory tusks."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Global Warming",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Environment",
    text: "Global warming refers to the long-term increase in the average temperature of the Earth's climate system. This rise in temperature is mainly caused by the accumulation of greenhouse gases in the atmosphere from human activities. The consequences include melting ice caps, rising sea levels, and more frequent extreme weather events like floods and severe droughts.",
    translation: "Le réchauffement climatique désigne l'augmentation à long terme de la température moyenne du système climatique de la Terre. Cette hausse de température est principalement causée par l'accumulation de gaz à effet de serre dans l'atmosphère provenant des activités humaines. Les conséquences comprennent la fonte des calottes glaciaires, l'élévation du niveau de la mer et des événements météorologiques extrêmes plus fréquents comme les inondations et les sécheresses sévères.",
    chunks: splitWords("Global warming refers to the long-term increase in the average temperature of the Earth's climate system. This rise in temperature is mainly caused by the accumulation of greenhouse gases in the atmosphere from human activities. The consequences include melting ice caps, rising sea levels, and more frequent extreme weather events like floods and severe droughts."),
    gaps: {
      positions: [23, 31, 34, 48], // accumulation, atmosphere, activities, floods
      distractors: ["reduction", "ground", "studies", "sunlight", "increase", "fires"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Importance of Trees",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Nature",
    text: "Trees are essential for life on Earth because they provide shade, food, and habitat for many different creatures. They also act as natural filters by absorbing carbon dioxide and releasing clean oxygen into the air we breathe. Planting more trees in urban areas can help reduce heat and improve the quality of life for everyone.",
    translation: "Les arbres sont essentiels à la vie sur Terre car ils fournissent de l'ombre, de la nourriture et un habitat à de nombreuses créatures différentes. Ils agissent également comme des filtres naturels en absorbant le dioxyde de carbone et en libérant de l'oxygène propre dans l'air que nous respirons. Planter plus d'arbres dans les zones urbaines peut aider à réduire la chaleur et à améliorer la qualité de vie de tous.",
    chunks: splitWords("Trees are essential for life on Earth because they provide shade, food, and habitat for many different creatures. They also act as natural filters by absorbing carbon dioxide and releasing clean oxygen into the air we breathe. Planting more trees in urban areas can help reduce heat and improve the quality of life for everyone."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Ocean Ecosystems",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Nature",
    text: "The ocean covers more than seventy percent of the Earth's surface and contains a vast variety of marine life. Coral reefs, in particular, are extremely important ecosystems that support thousands of species of fish and protect coastal areas from erosion. However, rising water temperatures and pollution are currently threatening the health of these vital underwater structures.",
    translation: "L'océan couvre plus de soixante-dix pour cent de la surface de la Terre et contient une vaste variété de vie marine. Les récifs coralliens, en particulier, sont des écosystèmes extrêmement importants qui abritent des milliers d'espèces de poissons et protègent les zones côtières de l'érosion. Cependant, la hausse des températures de l'eau et la pollution menacent actuellement la santé de ces structures sous-marines vitales.",
    chunks: splitWords("The ocean covers more than seventy percent of the Earth's surface and contains a vast variety of marine life. Coral reefs, in particular, are extremely important ecosystems that support thousands of species of fish and protect coastal areas from erosion. However, rising water temperatures and pollution are currently threatening the health of these vital underwater structures."),
    gaps: {
      positions: [17, 30, 34, 40], // reefs, support, coastal, erosion
      distractors: ["mountains", "destroy", "mountainous", "growth", "shores", "sharks"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Recycling Waste",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Environment",
    text: "Recycling is the process of collecting and processing materials that would otherwise be thrown away as trash. By turning old glass, paper, and metal into new products, we can save natural resources and reduce the amount of energy needed for manufacturing. Communities that practice recycling help to keep their environment clean and protect the planet for future generations.",
    translation: "Le recyclage est le processus de collecte et de traitement de matériaux qui seraient autrement jetés comme ordures. En transformant le vieux verre, le papier et le métal en de nouveaux produits, nous pouvons économiser les ressources naturelles et réduire la quantité d'énergie nécessaire à la fabrication. Les communautés qui pratiquent le recyclage aident à garder leur environnement propre et à protéger la planète pour les générations futures.",
    chunks: splitWords("Recycling is the process of collecting and processing materials that would otherwise be thrown away as trash. By turning old glass, paper, and metal into new products, we can save natural resources and reduce the amount of energy needed for manufacturing. Communities that practice recycling help to keep their environment clean and protect the planet for future generations."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Organic Farming",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Agriculture",
    text: "Organic farming is a method of growing crops without using synthetic chemicals, pesticides, or artificial fertilizers. This approach focuses on maintaining soil health and using natural processes to control pests and improve plant growth. Many people prefer organic food because it is considered healthier and better for the environment than traditional industrial farming methods.",
    translation: "L'agriculture biologique est une méthode de culture sans utilisation de produits chimiques synthétiques, de pesticides ou d'engrais artificiels. Cette approche se concentre sur le maintien de la santé du sol et l'utilisation de processus naturels pour contrôler les ravageurs et améliorer la croissance des plantes. Beaucoup de gens préfèrent la nourriture biologique car elle est considérée plus saine et meilleure pour l'environnement que les méthodes d'agriculture industrielle traditionnelles.",
    chunks: splitWords("Organic farming is a method of growing crops without using synthetic chemicals, pesticides, or artificial fertilizers. This approach focuses on maintaining soil health and using natural processes to control pests and improve plant growth. Many people prefer organic food because it is considered healthier and better for the environment than traditional industrial farming methods."),
    gaps: {
      positions: [10, 11, 28, 45], // synthetic, chemicals, pests, industrial
      distractors: ["natural", "water", "birds", "manual", "toxic", "farmers"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Biodiversity",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Nature",
    text: "Biodiversity refers to the variety of all living things on Earth and how they interact with each other in their ecosystems. High biodiversity makes an ecosystem more resilient to changes and helps it to recover from natural disasters more quickly. Every species, no matter how small, has a specific role to play in the balance of nature.",
    translation: "La biodiversité désigne la variété de tous les êtres vivants sur Terre et la manière dont ils interagissent entre eux dans leurs écosystèmes. Une biodiversité élevée rend un écosystème plus résilient aux changements et l'aide à se remettre plus rapidement des catastrophes naturelles. Chaque espèce, aussi petite soit-elle, a un rôle spécifique à jouer dans l'équilibre de la nature.",
    chunks: splitWords("Biodiversity refers to the variety of all living things on Earth and how they interact with each other in their ecosystems. High biodiversity makes an ecosystem more resilient to changes and helps it to recover from natural disasters more quickly. Every species, no matter how small, has a specific role to play in the balance of nature."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Atmosphere",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Science",
    text: "The atmosphere is a thin layer of gases that surrounds the Earth and protects it from the sun's harmful radiation. It contains the oxygen that humans and animals need to breathe, as well as the carbon dioxide used by plants. Without this protective layer, life on our planet would be impossible due to extreme temperatures and lack of air.",
    translation: "L'atmosphère est une fine couche de gaz qui entoure la Terre et la protège des rayons nocifs du soleil. Elle contient l'oxygène dont les humains et les animaux ont besoin pour respirer, ainsi que le dioxyde de carbone utilisé par les plantes. Sans cette couche protectrice, la vie sur notre planète serait impossible en raison des températures extrêmes et du manque d'air.",
    chunks: splitWords("The atmosphere is a thin layer of gases that surrounds the Earth and protects it from the sun's harmful radiation. It contains the oxygen that humans and animals need to breathe, as well as the carbon dioxide used by plants. Without this protective layer, life on our planet would be impossible due to extreme temperatures and lack of air."),
    gaps: {
      positions: [5, 14, 30, 39], // layer, radiation, protective, impossible
      distractors: ["wall", "light", "heavy", "easy", "blanket", "heat"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Savanna Ecosystem",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Nature",
    text: "The savanna is a large grassland ecosystem characterized by scattered trees and a distinct dry season. It supports a wide range of wildlife, including lions, zebras, and giraffes that migrate long distances in search of water and fresh grass. This unique environment is perfectly adapted to survive periodic fires, which actually help to stimulate new plant growth every year.",
    translation: "La savane est un vaste écosystème de prairie caractérisé par des arbres dispersés et une saison sèche distincte. Elle abrite une grande variété de faune, notamment des lions, des zèbres et des girafes qui migrent sur de longues distances à la recherche d'eau et d'herbe fraîche. Cet environnement unique est parfaitement adapté pour survivre aux incendies périodiques, qui aident en réalité à stimuler la croissance de nouvelles plantes chaque année.",
    chunks: splitWords("The savanna is a large grassland ecosystem characterized by scattered trees and a distinct dry season. It supports a wide range of wildlife, including lions, zebras, and giraffes that migrate long distances in search of water and fresh grass. This unique environment is perfectly adapted to survive periodic fires, which actually help to stimulate new plant growth every year."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Composting",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Environment",
    text: "Composting is the natural process of recycling organic matter, such as leaves and food scraps, into a valuable fertilizer that enriches the soil. By composting, people can significantly reduce the amount of waste they send to landfills while producing a nutrient-rich material for their gardens. It is an easy and inexpensive way for everyone to contribute to a healthier planet.",
    translation: "Le compostage est le processus naturel de recyclage des matières organiques, comme les feuilles et les restes de nourriture, en un engrais précieux qui enrichit le sol. En compostant, les gens peuvent réduire considérablement la quantité de déchets qu'ils envoient dans les décharges tout en produisant un matériau riche en nutriments pour leurs jardins. C'est un moyen facile et peu coûteux pour chacun de contribuer à une planète plus saine.",
    chunks: splitWords("Composting is the natural process of recycling organic matter, such as leaves and food scraps, into a valuable fertilizer that enriches the soil. By composting, people can significantly reduce the amount of waste they send to landfills while producing a nutrient-rich material for their gardens. It is an easy and inexpensive way for everyone to contribute to a healthier planet."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Artificial Intelligence",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Technology",
    text: "Artificial intelligence refers to the simulation of human intelligence by computer systems. These processes include learning, reasoning, and self-correction to solve complex problems efficiently. Today, AI is used in various fields such as healthcare and transportation to improve decision-making and automate repetitive tasks for many industries around the world.",
    translation: "L'intelligence artificielle fait référence à la simulation de l'intelligence humaine par des systèmes informatiques. Ces processus incluent l'apprentissage, le raisonnement et l'auto-correction pour résoudre des problèmes complexes efficacement. Aujourd'hui, l'IA est utilisée dans divers domaines tels que la santé et les transports pour améliorer la prise de décision.",
    chunks: splitWords("Artificial intelligence refers to the simulation of human intelligence by computer systems. These processes include learning, reasoning, and self-correction to solve complex problems efficiently. Today, AI is used in various fields such as healthcare and transportation to improve decision-making and automate repetitive tasks for many industries around the world."),
    gaps: {
      positions: [5, 15, 41, 45], // simulation, learning, repetitive, industries
      distractors: ["copy", "reading", "easy", "countries", "games", "people"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Internet of Things",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Technology",
    text: "The Internet of Things describes the network of physical objects that are embedded with sensors and software. These devices connect and exchange data with other systems over the internet without requiring human intervention. Common examples include smart thermostats, wearable fitness trackers, and connected appliances that help people manage their daily lives more efficiently.",
    translation: "L'Internet des Objets décrit le réseau d'objets physiques qui sont intégrés avec des capteurs et des logiciels. Ces appareils se connectent et échangent des données avec d'autres systèmes via Internet sans nécessiter d'intervention humaine. Les exemples courants incluent les thermostats intelligents et les montres connectées.",
    chunks: splitWords("The Internet of Things describes the network of physical objects that are embedded with sensors and software. These devices connect and exchange data with other systems over the internet without requiring human intervention. Common examples include smart thermostats, wearable fitness trackers, and connected appliances that help people manage their daily lives more efficiently."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Space Exploration",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Science",
    text: "Space exploration involves the use of astronomy and space technology to explore outer space for scientific research. Robotic missions to Mars and distant planets provide valuable information about the history of our solar system and the possibility of life elsewhere. In the future, private companies hope to establish human colonies on the moon.",
    translation: "L'exploration spatiale implique l'utilisation de l'astronomie et de la technologie spatiale pour explorer l'espace lointain à des fins de recherche scientifique. Les missions robotiques sur Mars fournissent des informations précieuses sur l'histoire de notre système solaire. À l'avenir, des entreprises privées espèrent établir des colonies humaines sur la lune.",
    chunks: splitWords("Space exploration involves the use of astronomy and space technology to explore outer space for scientific research. Robotic missions to Mars and distant planets provide valuable information about the history of our solar system and the possibility of life elsewhere. In the future, private companies hope to establish human colonies on the moon."),
    gaps: {
      positions: [16, 26, 34, 46], // missions, history, possibility, colonies
      distractors: ["travels", "future", "fear", "cities", "aliens", "ships"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Electric Vehicles",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Transport",
    text: "Electric vehicles use one or more electric motors for propulsion instead of an internal combustion engine. They store electricity in large batteries that can be recharged at special stations or even at home using solar power. Reducing dependence on oil helps to decrease air pollution and noise in modern cities while protecting the climate.",
    translation: "Les véhicules électriques utilisent un ou plusieurs moteurs électriques pour la propulsion au lieu d'un moteur à combustion interne. Ils stockent l'électricité dans de grandes batteries qui peuvent être rechargées. Réduire la dépendance au pétrole aide à diminuer la pollution de l'air et le bruit dans les villes modernes.",
    chunks: splitWords("Electric vehicles use one or more electric motors for propulsion instead of an internal combustion engine. They store electricity in large batteries that can be recharged at special stations or even at home using solar power. Reducing dependence on oil helps to decrease air pollution and noise in modern cities while protecting the climate."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Virtual Reality",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Technology",
    text: "Virtual reality is a simulated experience that can be similar to or completely different from the real world. By wearing a special headset, users can interact with a three-dimensional environment for gaming, education, or professional training. This technology allows medical students to practice complex surgeries in a safe and controlled digital space before operating.",
    translation: "La réalité virtuelle est une expérience simulée qui peut être similaire ou complètement différente du monde réel. En portant un casque spécial, les utilisateurs peuvent interagir avec un environnement en trois dimensions. Cette technologie permet aux étudiants en médecine de pratiquer des chirurgies complexes.",
    chunks: splitWords("Virtual reality is a simulated experience that can be similar to or completely different from the real world. By wearing a special headset, users can interact with a three-dimensional environment for gaming, education, or professional training. This technology allows medical students to practice complex surgeries in a safe and controlled digital space before operating."),
    gaps: {
      positions: [20, 24, 38, 48], // headset, interact, surgeries, operating
      distractors: ["screen", "watching", "games", "playing", "glasses", "talking"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "3D Printing",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Technology",
    text: "Three-dimensional printing is a process that creates solid objects from a digital file by adding material layer by layer. This technology is used to manufacture everything from simple toys to complex aerospace parts and even medical prosthetics. It reduces waste and allows for the creation of customized items that are impossible to make with traditional tools.",
    translation: "L'impression en trois dimensions est un processus qui crée des objets solides à partir d'un fichier numérique en ajoutant de la matière couche par couche. Cette technologie est utilisée pour tout fabriquer, des jouets simples aux prothèses médicales. Elle réduit les déchets et permet de créer des objets personnalisés.",
    chunks: splitWords("Three-dimensional printing is a process that creates solid objects from a digital file by adding material layer by layer. This technology is used to manufacture everything from simple toys to complex aerospace parts and even medical prosthetics. It reduces waste and allows for the creation of customized items that are impossible to make with traditional tools."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Digital Learning",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Education",
    text: "Digital learning platforms are transforming the way students acquire knowledge in the modern world. These tools provide access to interactive lessons, educational games, and real-time feedback for learners of all ages. By using technology in the classroom, teachers can personalize the learning experience and help every student succeed at their own pace.",
    translation: "Les plateformes d'apprentissage numérique transforment la façon dont les élèves acquièrent des connaissances. Ces outils donnent accès à des leçons interactives et à un retour en temps réel. En utilisant la technologie en classe, les enseignants peuvent personnaliser l'expérience d'apprentissage.",
    chunks: splitWords("Digital learning platforms are transforming the way students acquire knowledge in the modern world. These tools provide access to interactive lessons, educational games, and real-time feedback for learners of all ages. By using technology in the classroom, teachers can personalize the learning experience and help every student succeed at their own pace."),
    gaps: {
      positions: [8, 25, 36, 47], // knowledge, feedback, personalize, pace
      distractors: ["books", "results", "change", "time", "grades", "money"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Smart Cities",
    difficulty: "intermediate",
    mode: "text-builder",
    topic: "Technology",
    text: "Smart cities use digital technology and data sensors to manage resources more efficiently and improve urban life. These systems monitor traffic flow, reduce energy consumption in street lights, and optimize waste collection in large urban areas. The goal is to create more sustainable and livable environments for the growing global population in the future.",
    translation: "Les villes intelligentes utilisent la technologie numérique et des capteurs de données pour gérer les ressources plus efficacement. Ces systèmes surveillent le trafic et réduisent la consommation d'énergie. L'objectif est de créer des environnements plus durables pour la population mondiale croissante.",
    chunks: splitWords("Smart cities use digital technology and data sensors to manage resources more efficiently and improve urban life. These systems monitor traffic flow, reduce energy consumption in street lights, and optimize waste collection in large urban areas. The goal is to create more sustainable and livable environments for the growing global population in the future."),
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Cybersecurity",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Technology",
    text: "Cybersecurity is the practice of protecting computer systems, networks, and data from digital attacks or unauthorized access. As more information is stored online, it becomes essential to use strong passwords and encryption to keep personal records safe. Governments and large corporations invest billions of dollars every year to defend their infrastructure from hackers.",
    translation: "La cybersécurité est la pratique consistant à protéger les systèmes informatiques, les réseaux et les données contre les attaques numériques. Comme plus d'informations sont stockées en ligne, il devient essentiel d'utiliser des mots de passe forts. Les gouvernements investissent des milliards pour se défendre.",
    chunks: splitWords("Cybersecurity is the practice of protecting computer systems, networks, and data from digital attacks or unauthorized access. As more information is stored online, it becomes essential to use strong passwords and encryption to keep personal records safe. Governments and large corporations invest billions of dollars every year to defend their infrastructure from hackers."),
    gaps: {
      positions: [5, 14, 30, 46], // protecting, attacks, encryption, infrastructure
      distractors: ["helping", "messages", "coding", "buildings", "sharing", "photos"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Mobile Banking",
    difficulty: "intermediate",
    mode: "fill-gaps",
    topic: "Technology",
    text: "Mobile banking allows customers to perform financial transactions using a smartphone instead of visiting a physical bank branch. This technology has revolutionized the economy in many African countries by providing access to credit and savings for rural populations. It is a fast, secure, and convenient way to pay bills and transfer money instantly.",
    translation: "Le commerce mobile permet aux clients d'effectuer des transactions financières à l'aide d'un smartphone. Cette technologie a révolutionné l'économie dans de nombreux pays africains en offrant un accès au crédit. C'est un moyen rapide et sûr de payer des factures et de transférer de l'argent.",
    chunks: splitWords("Mobile banking allows customers to perform financial transactions using a smartphone instead of visiting a physical bank branch. This technology has revolutionized the economy in many African countries by providing access to credit and savings for rural populations. It is a fast, secure, and convenient way to pay bills and transfer money instantly."),
    gaps: {
      positions: [6, 17, 30, 42], // transactions, revolutionized, rural, transfer
      distractors: ["visits", "destroyed", "city", "send", "games", "problems"]
    },
    timerSeconds: 240,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  }
];

const advancedTexts: Omit<TextBuilderLevel, "id">[] = [
   {
    title: "The Ethics of Bioengineering",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Ethics & Science",
    text: "The rapid advancement of bioengineering has opened extraordinary possibilities for eradicating inherited diseases through precise gene editing techniques. Nevertheless, altering the human genome raises profound ethical concerns regarding the potential for unintended genetic mutations. Furthermore, there is a substantial risk that such technologies could be exclusively available to the wealthy elite, thereby creating a genetically enhanced upper class.",
    translation: "Les progrès rapides de la bio-ingénierie ont ouvert des possibilités extraordinaires pour éradiquer les maladies héréditaires grâce à des techniques précises d'édition de gènes. Néanmoins, l'altération du génome humain soulève de profondes préoccupations éthiques concernant le potentiel de mutations génétiques involontaires. De plus, il existe un risque substantiel que de telles technologies soient exclusivement accessibles à l'élite fortunée, créant ainsi une classe supérieure génétiquement améliorée.",
    chunks: splitWords("The rapid advancement of bioengineering has opened extraordinary possibilities for eradicating inherited diseases through precise gene editing techniques. Nevertheless, altering the human genome raises profound ethical concerns regarding the potential for unintended genetic mutations. Furthermore, there is a substantial risk that such technologies could be exclusively available to the wealthy elite, thereby creating a genetically enhanced upper class."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Universal Basic Income",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Economy",
    text: "In response to the growing threat of mass unemployment caused by artificial intelligence, many economists are advocating for the implementation of a universal basic income. This radical policy would provide every citizen with a regular unconditional payment to cover their fundamental living expenses. Proponents argue that financial security fosters greater entrepreneurial risk-taking and significantly reduces poverty rates.",
    translation: "En réponse à la menace croissante de chômage de masse causé par l'intelligence artificielle, de nombreux économistes plaident pour la mise en œuvre d'un revenu de base universel. Cette politique radicale fournirait à chaque citoyen un paiement inconditionnel régulier pour couvrir ses dépenses de vie fondamentales. Les partisans soutiennent que la sécurité financière favorise une plus grande prise de risque entrepreneurial et réduit considérablement les taux de pauvreté.",
    chunks: splitWords("In response to the growing threat of mass unemployment caused by artificial intelligence, many economists are advocating for the implementation of a universal basic income. This radical policy would provide every citizen with a regular unconditional payment to cover their fundamental living expenses. Proponents argue that financial security fosters greater entrepreneurial risk-taking and significantly reduces poverty rates."),
    gaps: {
      positions: [8, 17, 28, 41], // unemployment, implementation, unconditional, entrepreneurial
      distractors: ["vacation", "destruction", "optional", "traditional", "safety", "factory"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Extinction Crisis",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Environment",
    text: "The current rate of species extinction is unprecedented in human history, driven primarily by rampant deforestation, industrial pollution, and relentless poaching. When apex predators are removed from their natural habitats, the entire ecological balance is destabilized, which inevitably leads to the collapse of local food webs. To halt this catastrophic loss of biodiversity, governments must establish protected conservation areas and rigorously enforce international laws.",
    translation: "Le taux actuel d'extinction des espèces est sans précédent dans l'histoire humaine, principalement alimenté par la déforestation endémique, la pollution industrielle et le braconnage incessant. Lorsque les superprédateurs sont retirés de leurs habitats naturels, tout l'équilibre écologique est déstabilisé, ce qui conduit inévitablement à l'effondrement des réseaux trophiques locaux. Pour enrayer cette perte catastrophique de biodiversité, les gouvernements doivent établir des zones de conservation protégées et appliquer rigoureusement les lois internationales.",
    chunks: splitWords("The current rate of species extinction is unprecedented in human history, driven primarily by rampant deforestation, industrial pollution, and relentless poaching. When apex predators are removed from their natural habitats, the entire ecological balance is destabilized, which inevitably leads to the collapse of local food webs. To halt this catastrophic loss of biodiversity, governments must establish protected conservation areas and rigorously enforce international laws."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Gig Economy",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Economy & Society",
    text: "The rapid expansion of the gig economy has fundamentally transformed traditional employment structures by offering workers unprecedented flexibility and independence. Despite these apparent advantages, independent contractors often lack essential benefits such as health insurance, paid sick leave, and job security. Because labor laws have failed to keep pace with technological innovation, courts are frequently forced to determine whether these individuals should be legally classified.",
    translation: "L'expansion rapide de l'économie à la tâche a fondamentalement transformé les structures d'emploi traditionnelles en offrant aux travailleurs une flexibilité et une indépendance sans précédent. Malgré ces avantages apparents, les entrepreneurs indépendants manquent souvent d'avantages essentiels tels que l'assurance maladie, les congés maladie payés et la sécurité de l'emploi. Parce que les lois du travail n'ont pas réussi à suivre le rythme de l'innovation technologique, les tribunaux sont fréquemment contraints de déterminer si ces individus doivent être classés légalement.",
    chunks: splitWords("The rapid expansion of the gig economy has fundamentally transformed traditional employment structures by offering workers unprecedented flexibility and independence. Despite these apparent advantages, independent contractors often lack essential benefits such as health insurance, paid sick leave, and job security. Because labor laws have failed to keep pace with technological innovation, courts are frequently forced to determine whether these individuals should be legally classified."),
    gaps: {
      positions: [9, 17, 27, 51], // transformed, flexibility, benefits, classified
      distractors: ["destroyed", "limitations", "problems", "hired", "money", "speed"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Space Debris Danger",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Space & Tech",
    text: "As commercial companies launch thousands of new satellites into low Earth orbit, the accumulation of space debris has become a critical international issue. These discarded fragments travel at extraordinary speeds, posing a severe threat to operational spacecraft and the International Space Station. If a major collision occurs, the resulting shrapnel could trigger a cascading chain reaction, effectively rendering specific orbital paths completely unusable for future exploration and global communication.",
    translation: "Alors que les entreprises commerciales lancent des milliers de nouveaux satellites en orbite basse terrestre, l'accumulation de débris spatiaux est devenue un problème international critique. Ces fragments mis au rebut voyagent à des vitesses extraordinaires, posant une menace grave pour les engins spatiaux opérationnels et la Station spatiale internationale. Si une collision majeure se produit, les éclats résultants pourraient déclencher une réaction en chaîne en cascade, rendant des trajectoires orbitales spécifiques complètement inutilisables pour l'exploration future et la communication mondiale.",
    chunks: splitWords("As commercial companies launch thousands of new satellites into low Earth orbit, the accumulation of space debris has become a critical international issue. These discarded fragments travel at extraordinary speeds, posing a severe threat to operational spacecraft and the International Space Station. If a major collision occurs, the resulting shrapnel could trigger a cascading chain reaction, effectively rendering specific orbital paths completely unusable for future exploration and global communication."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Corporate Social Responsibility",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Economy & Ethics",
    text: "In contemporary business environments, corporate social responsibility is no longer viewed as a mere public relations strategy but rather as a fundamental operational imperative. Consumers are increasingly demanding that multinational corporations minimize their environmental impact and guarantee fair labor practices throughout their entire supply chains. Companies that stubbornly ignore these ethical expectations frequently face severe consumer boycotts and permanent damage to their brand reputation.",
    translation: "Dans les environnements commerciaux contemporains, la responsabilité sociale des entreprises n'est plus considérée comme une simple stratégie de relations publiques, mais plutôt comme un impératif opérationnel fondamental. Les consommateurs exigent de plus en plus que les sociétés multinationales minimisent leur impact environnemental et garantissent des pratiques de travail équitables tout au long de leurs chaînes d'approvisionnement. Les entreprises qui ignorent obstinément ces attentes éthiques font fréquemment face à de graves boycotts de consommateurs et à des dommages permanents à la réputation de leur marque.",
    chunks: splitWords("In contemporary business environments, corporate social responsibility is no longer viewed as a mere public relations strategy but rather as a fundamental operational imperative. Consumers are increasingly demanding that multinational corporations minimize their environmental impact and guarantee fair labor practices throughout their entire supply chains. Companies that stubbornly ignore these ethical expectations frequently face severe consumer boycotts and permanent damage to their brand reputation."),
    gaps: {
      positions: [15, 21, 41, 48], // imperative, multinational, stubbornly, boycotts
      distractors: ["option", "local", "happily", "reviews", "meeting", "success"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Illusion of Privacy",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Technology",
    text: "The pervasive integration of smart devices in our homes has created an environment where the concept of absolute privacy is rapidly becoming an illusion. While virtual assistants provide remarkable daily convenience, they simultaneously collect vast amounts of intimate personal data that is frequently sold to third-party advertisers without explicit consent. Consequently, legislative bodies are struggling to draft comprehensive data protection laws.",
    translation: "L'intégration omniprésente des appareils intelligents dans nos maisons a créé un environnement où le concept de vie privée absolue devient rapidement une illusion. Bien que les assistants virtuels offrent une commodité quotidienne remarquable, ils collectent simultanément de vastes quantités de données personnelles intimes qui sont fréquemment vendues à des annonceurs tiers sans consentement explicite. Par conséquent, les corps législatifs luttent pour rédiger des lois complètes sur la protection des données.",
    chunks: splitWords("The pervasive integration of smart devices in our homes has created an environment where the concept of absolute privacy is rapidly becoming an illusion. While virtual assistants provide remarkable daily convenience, they simultaneously collect vast amounts of intimate personal data that is frequently sold to third-party advertisers without explicit consent. Consequently, legislative bodies are struggling to draft comprehensive data protection laws."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Ocean Acidification",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Environment",
    text: "While much attention is rightly focused on rising global temperatures, the parallel crisis of ocean acidification remains vastly underreported by mainstream media. As the oceans absorb massive quantities of carbon dioxide emitted by human industries, the water's chemical composition drastically alters, making it highly acidic. This unseen chemical transformation prevents marine organisms, particularly coral reefs, from building their protective shells.",
    translation: "Alors qu'une grande attention est à juste titre concentrée sur la hausse des températures mondiales, la crise parallèle de l'acidification des océans reste largement sous-médiatisée par les médias traditionnels. Alors que les océans absorbent des quantités massives de dioxyde de carbone émises par les industries humaines, la composition chimique de l'eau s'altère radicalement, la rendant très acide. Cette transformation chimique invisible empêche les organismes marins, en particulier les récifs coralliens, de construire leurs coquilles protectrices.",
    chunks: splitWords("While much attention is rightly focused on rising global temperatures, the parallel crisis of ocean acidification remains vastly underreported by mainstream media. As the oceans absorb massive quantities of carbon dioxide emitted by human industries, the water's chemical composition drastically alters, making it highly acidic. This unseen chemical transformation prevents marine organisms, particularly coral reefs, from building their protective shells."),
    gaps: {
      positions: [12, 32, 36, 49], // underreported, composition, acidic, protective
      distractors: ["popular", "location", "sweet", "decorative", "news", "salt"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Aging Population",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Society & Economy",
    text: "The demographic shift toward an aging population in developed nations presents unprecedented challenges for national healthcare systems and pension funds. Because medical advancements have significantly increased average life expectancy, the proportion of retired citizens now heavily outweighs the active workforce that financially supports them. Unless governments strategically reform their retirement policies and aggressively encourage immigration to replenish the labor pool, they will inevitably face crisis.",
    translation: "L'évolution démographique vers une population vieillissante dans les pays développés présente des défis sans précédent pour les systèmes de santé nationaux et les fonds de pension. Parce que les avancées médicales ont considérablement augmenté l'espérance de vie moyenne, la proportion de citoyens retraités dépasse maintenant largement la population active qui les soutient financièrement. À moins que les gouvernements ne réforment stratégiquement leurs politiques de retraite et n'encouragent agressivement l'immigration pour reconstituer le bassin de main-d'œuvre, ils feront inévitablement face à une crise.",
    chunks: splitWords("The demographic shift toward an aging population in developed nations presents unprecedented challenges for national healthcare systems and pension funds. Because medical advancements have significantly increased average life expectancy, the proportion of retired citizens now heavily outweighs the active workforce that financially supports them. Unless governments strategically reform their retirement policies and aggressively encourage immigration to replenish the labor pool, they will inevitably face crisis."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Power of Microfinance",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Economy",
    text: "Microfinance institutions have revolutionized the global fight against extreme poverty by providing small, accessible loans to marginalized entrepreneurs who lack traditional banking histories. By bypassing bureaucratic commercial banks, these innovative programs empower women in developing countries to establish sustainable local businesses that directly support their families' needs. Extensive research indicates that when communities gain financial independence through microcredit, there is a corresponding decrease in poverty.",
    translation: "Les institutions de microfinance ont révolutionné la lutte mondiale contre l'extrême pauvreté en fournissant de petits prêts accessibles aux entrepreneurs marginalisés qui n'ont pas d'antécédents bancaires traditionnels. En contournant les banques commerciales bureaucratiques, ces programmes innovants permettent aux femmes des pays en développement de créer des entreprises locales durables qui soutiennent directement les besoins de leurs familles. Des recherches approfondies indiquent que lorsque les communautés acquièrent une indépendance financière grâce au microcrédit, il y a une diminution correspondante de la pauvreté.",
    chunks: splitWords("Microfinance institutions have revolutionized the global fight against extreme poverty by providing small, accessible loans to marginalized entrepreneurs who lack traditional banking histories. By bypassing bureaucratic commercial banks, these innovative programs empower women in developing countries to establish sustainable local businesses that directly support their families' needs. Extensive research indicates that when communities gain financial independence through microcredit, there is a corresponding decrease in poverty."),
    gaps: {
      positions: [3, 13, 21, 32], // revolutionized, marginalized, bureaucratic, sustainable
      distractors: ["started", "famous", "efficient", "temporary", "money", "banks"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Ethics of AI",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Ethics & Technology",
    text: "While artificial intelligence offers unprecedented opportunities for economic growth, it also raises profound ethical questions regarding privacy and algorithmic bias. If developers do not implement strict regulations, these systems might perpetuate existing social inequalities. Furthermore, the automation of complex tasks could lead to significant shifts in the global labor market, requiring workers to acquire entirely new digital competencies to remain relevant in a rapidly evolving professional landscape.",
    translation: "Bien que l'intelligence artificielle offre des opportunités de croissance économique sans précédent, elle soulève également de profondes questions éthiques concernant la vie privée et les biais algorithmiques. Si les développeurs ne mettent pas en œuvre des réglementations strictes, ces systèmes pourraient perpétuer les inégalités sociales existantes. De plus, l'automatisation de tâches complexes pourrait entraîner des changements importants sur le marché du travail mondial, obligeant les travailleurs à acquérir de toutes nouvelles compétences numériques pour rester pertinents dans un paysage professionnel en évolution rapide.",
    chunks: splitWords("While artificial intelligence offers unprecedented opportunities for economic growth, it also raises profound ethical questions regarding privacy and algorithmic bias. If developers do not implement strict regulations, these systems might perpetuate existing social inequalities. Furthermore, the automation of complex tasks could lead to significant shifts in the global labor market, requiring workers to acquire entirely new digital competencies to remain relevant in a rapidly evolving professional landscape."),
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Climate Change and Global Responsibility",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Environment",
    text: "The scientific community agrees that urgent action is required to mitigate the devastating effects of global warming on fragile ecosystems. Although many nations have signed international treaties, the reduction of carbon emissions remains insufficient to prevent a significant rise in global temperatures. Consequently, developed countries must provide financial and technological support to help vulnerable regions adapt to extreme weather patterns and rising sea levels that threaten coastal communities worldwide.",
    translation: "La communauté scientifique s'accorde à dire qu'une action urgente est nécessaire pour atténuer les effets dévastateurs du réchauffement climatique sur les écosystèmes fragiles. Bien que de nombreuses nations aient signé des traités internationaux, la réduction des émissions de carbone reste insuffisante pour empêcher une augmentation significative des températures mondiales. Par conséquent, les pays développés doivent fournir un soutien financier et technologique pour aider les régions vulnérables à s'adapter aux conditions météorologiques extrêmes et à l'élévation du niveau de la mer qui menacent les communautés côtières du monde entier.",
    chunks: [
      "The scientific", "community agrees", "that urgent action", "is required", "to mitigate",
      "the devastating", "effects of", "global warming", "on fragile", "ecosystems.",
      "Although", "many nations", "have signed", "international treaties,", "the reduction",
      "of carbon emissions", "remains insufficient", "to prevent", "a significant", "rise in",
      "global temperatures.", "Consequently,", "developed countries", "must provide", "technological support."
    ],
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Paradox of Globalization",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Global Economy",
    text: "Globalization has undoubtedly facilitated the exchange of goods and ideas across borders, yet it has also exacerbated the wealth gap between different regions. While multinational corporations benefit from lower production costs, small local businesses often struggle to compete with global giants. To ensure a more equitable distribution of wealth, international organizations are advocating for fair trade policies and stronger labor protections that prevent the exploitation of workers in developing economies.",
    translation: "La mondialisation a sans aucun doute facilité l'échange de biens et d'idées à travers les frontières, mais elle a également exacerbé l'écart de richesse entre les différentes régions. Alors que les entreprises multinationales bénéficient de coûts de production réduits, les petites entreprises locales luttent souvent pour rivaliser avec les géants mondiaux. Pour assurer une répartition plus équitable des richesses, les organisations internationales plaident pour des politiques de commerce équitable et des protections du travail plus fortes qui empêchent l'exploitation des travailleurs dans les économies en développement.",
    chunks: splitWords("Globalization has undoubtedly facilitated the exchange of goods and ideas across borders, yet it has also exacerbated the wealth gap between different regions. While multinational corporations benefit from lower production costs, small local businesses often struggle to compete with global giants. To ensure a more equitable distribution of wealth, international organizations are advocating for fair trade policies and stronger labor protections that prevent the exploitation of workers in developing economies."),
    gaps: {
      positions: [3, 14, 42, 54], // facilitated, exacerbated, equitable, exploitation
      distractors: ["blocked", "improved", "unfair", "protection", "speed", "money"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Genetic Engineering and Food Security",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Science & Society",
    text: "Genetic engineering provides a potential solution to global hunger by creating crops that are resistant to pests and extreme drought conditions. However, many critics argue that the long-term impact of modified organisms on human health and biodiversity is not yet fully understood. Despite these concerns, research continues to advance, as scientists strive to balance technological innovation with the necessity of maintaining a safe and sustainable food supply for the future.",
    translation: "Le génie génétique offre une solution potentielle à la faim dans le monde en créant des cultures résistantes aux parasites et aux conditions de sécheresse extrême. Cependant, de nombreux critiques soutiennent que l'impact à long terme des organismes modifiés sur la santé humaine et la biodiversité n'est pas encore pleinement compris. Malgré ces préoccupations, la recherche continue de progresser, alors que les scientifiques s'efforcent d'équilibrer l'innovation technologique avec la nécessité de maintenir un approvisionnement alimentaire sûr et durable pour l'avenir.",
    chunks: [
      "Genetic engineering", "provides a", "potential solution", "to global hunger", "by creating",
      "crops that", "are resistant", "to pests", "and extreme", "drought conditions.",
      "However,", "many critics", "argue that", "the long-term", "impact of",
      "modified organisms", "on human health", "and biodiversity", "is not yet", "fully understood.",
      "Despite", "these concerns,", "research continues", "to advance,", "as scientists strive."
    ],
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "The Digital Divide and Education",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Social Issues",
    text: "In the modern era, access to high-speed internet is no longer a luxury but a fundamental requirement for academic and professional success. Nevertheless, the digital divide persists, as millions of students in remote areas lack the necessary tools to participate in online learning. Unless governments prioritize the expansion of digital infrastructure, this technological gap will continue to widen the existing disparities in educational outcomes and limit future career opportunities for younger generations.",
    translation: "À l'ère moderne, l'accès à l'internet haut débit n'est plus un luxe mais une exigence fondamentale pour la réussite académique et professionnelle. Néanmoins, la fracture numérique persiste, car des millions d'élèves dans les zones reculées manquent des outils nécessaires pour participer à l'apprentissage en ligne. À moins que les gouvernements ne donnent la priorité à l'expansion des infrastructures numériques, cet écart technologique continuera d'élargir les disparités existantes dans les résultats éducatifs et de limiter les futures opportunités de carrière pour les jeunes générations.",
    chunks: splitWords("In the modern era, access to high-speed internet is no longer a luxury but a fundamental requirement for academic and professional success. Nevertheless, the digital divide persists, as millions of students in remote areas lack the necessary tools to participate in online learning. Unless governments prioritize the expansion of digital infrastructure, this technological gap will continue to widen the existing disparities in educational outcomes and limit future career opportunities for younger generations."),
    gaps: {
      positions: [11, 20, 42, 50], // fundamental, persists, infrastructure, disparities
      distractors: ["simple", "stops", "buildings", "similarities", "luxury", "speed"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Sustainable Urban Development",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "Urbanism",
    text: "As the world population becomes increasingly urbanized, architects and city planners must focus on creating sustainable environments that minimize energy consumption. Green buildings, which utilize solar energy and rainwater harvesting, are becoming the new standard in modern metropolis design. Furthermore, improving public transportation networks is essential to reduce the carbon footprint of individual commuters and create cleaner, more breathable cities for millions of residents struggling with air pollution.",
    translation: "Alors que la population mondiale devient de plus en plus urbanisée, les architectes et les urbanistes doivent se concentrer sur la création d'environnements durables qui minimisent la consommation d'énergie. Les bâtiments écologiques, qui utilisent l'énergie solaire et la collecte des eaux de pluie, deviennent la nouvelle norme dans la conception des métropoles modernes. De plus, l'amélioration des réseaux de transports publics est essentielle pour réduire l'empreinte carbone des navetteurs individuels et créer des villes plus propres et plus respirables pour des millions de résidents aux prises avec la pollution de l'air.",
    chunks: [
      "As the world", "population becomes", "increasingly", "urbanized,", "architects and",
      "city planners", "must focus", "on creating", "sustainable", "environments",
      "that minimize", "energy consumption.", "Green buildings,", "which utilize", "solar energy",
      "and rainwater", "harvesting,", "are becoming", "the new standard", "in design.",
      "Furthermore,", "improving public", "transportation", "is essential", "to reduce pollution."
    ],
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Cyber Warfare and National Security",
    difficulty: "advanced",
    mode: "fill-gaps",
    topic: "Technology & Politics",
    text: "In the digital age, national security is no longer confined to physical borders, as cyber warfare poses a constant threat to critical infrastructure. Hackers can target electrical grids, financial systems, and government databases, causing widespread disruption without ever firing a single shot. Consequently, intelligence agencies must develop sophisticated defense mechanisms and international cooperation protocols to detect and neutralize these invisible attacks before they can cause irreversible damage to the stability of modern society.",
    translation: "À l'ère numérique, la sécurité nationale n'est plus confinée aux frontières physiques, car la cyberguerre constitue une menace constante pour les infrastructures critiques. Les pirates peuvent cibler les réseaux électriques, les systèmes financiers et les bases de données gouvernementales, provoquant des perturbations généralisées sans jamais tirer un seul coup de feu. Par conséquent, les agences de renseignement doivent développer des mécanismes de défense sophistiqués et des protocoles de coopération internationale pour détecter et neutraliser ces attaques invisibles avant qu'elles ne puissent causer des dommages irréversibles à la stabilité de la société moderne.",
    chunks: splitWords("In the digital age, national security is no longer confined to physical borders, as cyber warfare poses a constant threat to critical infrastructure. Hackers can target electrical grids, financial systems, and government databases, causing widespread disruption without ever firing a single shot. Consequently, intelligence agencies must develop sophisticated defense mechanisms and international cooperation protocols to detect and neutralize these invisible attacks before they can cause irreversible damage to the stability of modern society."),
    gaps: {
      positions: [8, 16, 38, 51], // confined, infrastructure, sophisticated, neutralize
      distractors: ["open", "roads", "simple", "encourage", "limit", "safety"]
    },
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  },
  {
    title: "Economic Sanctions and Diplomacy",
    difficulty: "advanced",
    mode: "text-builder",
    topic: "International Relations",
    text: "Economic sanctions are frequently employed as a diplomatic tool to pressure governments into changing their policies without resorting to military intervention. While these measures can be effective in isolating regimes that violate international law, they often have unintended consequences for the civilian population. Critics argue that sanctions can lead to shortages of essential goods like medicine and food, thereby creating a humanitarian crisis that complicates the path toward a peaceful and lasting diplomatic resolution.",
    translation: "Les sanctions économiques sont fréquemment employées comme un outil diplomatique pour faire pression sur les gouvernements afin qu'ils changent leurs politiques sans recourir à l'intervention militaire. Bien que ces mesures puissent être efficaces pour isoler les régimes qui violent le droit international, elles ont souvent des conséquences imprévues pour la population civile. Les critiques soutiennent que les sanctions peuvent entraîner des pénuries de biens essentiels comme les médicaments et la nourriture, créant ainsi une crise humanitaire qui complique la voie vers une résolution diplomatique pacifique et durable.",
    chunks: [
      "Economic", "sanctions are", "frequently", "employed as", "a diplomatic tool",
      "to pressure", "governments", "into changing", "their policies", "without military",
      "intervention.", "While these", "measures can", "be effective", "in isolating",
      "regimes,", "they often", "have unintended", "consequences for", "the civilians.",
      "Critics argue", "that sanctions", "can lead to", "shortages of", "essential goods."
    ],
    timerSeconds: 180,
    scoring: {
      maxPoints: 10,
      passingScore: 7,
      penalties: { wrongAnswer: 0.5, consecutiveErrorsReset: 1 }
    }
  }
];

export const allTextBuilderLevels: TextBuilderLevel[] = [
  ...beginnerTexts.map((t, i) => ({ ...t, id: i + 1 })),
  ...intermediateTexts.map((t, i) => ({ ...t, id: beginnerTexts.length + i + 1 })),
  ...advancedTexts.map((t, i) => ({ ...t, id: beginnerTexts.length + intermediateTexts.length + i + 1 })),
];

export function getTextBuilderLevel(id: number): TextBuilderLevel | undefined {
  return allTextBuilderLevels.find(l => l.id === id);
}

export const textBuilderPhases = [
  { difficulty: "beginner" as const, name: "Débutant", icon: "📝", color: "phase-discovery", count: beginnerTexts.length },
  { difficulty: "intermediate" as const, name: "Intermédiaire", icon: "📖", color: "phase-words", count: intermediateTexts.length },
  { difficulty: "advanced" as const, name: "Avancé", icon: "🎓", color: "phase-mastery", count: advancedTexts.length },
];
