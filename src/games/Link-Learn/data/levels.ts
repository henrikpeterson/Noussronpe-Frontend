export interface WordPair {
  left: string;
  right: string;
}

export interface LevelData {
  level: number;
  phase: number;
  phaseName: string;
  category: string;
  pairs: WordPair[];
  hasObstacle: boolean;
  hasNoCross: boolean;
  timerSeconds: number | null;
}

type Category = { name: string; pairs: WordPair[] };

const categories: Record<string, Category> = {
  animals: {
    name: "Animals",
    pairs: [
      { left: "Dog", right: "Chien" }, { left: "Cat", right: "Chat" }, { left: "Bird", right: "Oiseau" },
      { left: "Fish", right: "Poisson" }, { left: "Horse", right: "Cheval" }, { left: "Cow", right: "Vache" },
      { left: "Shark", right: "Requin" }, { left: "Owl", right: "Hibou" }, { left: "Bear", right: "Ours" },
      { left: "Wolf", right: "Loup" }, { left: "Rabbit", right: "Lapin" }, { left: "Frog", right: "Grenouille" },
      { left: "Snake", right: "Serpent" }, { left: "Eagle", right: "Aigle" }, { left: "Whale", right: "Baleine" },
      { left: "Turtle", right: "Tortue" }, { left: "Monkey", right: "Singe" }, { left: "Butterfly", right: "Papillon" },
    ],
  },
  objects: {
    name: "Objects",
    pairs: [
      { left: "Chair", right: "Chaise" }, { left: "Pen", right: "Stylo" }, { left: "Book", right: "Livre" },
      { left: "Table", right: "Table" }, { left: "Window", right: "Fenêtre" }, { left: "Door", right: "Porte" },
      { left: "Clock", right: "Horloge" }, { left: "Lamp", right: "Lampe" }, { left: "Key", right: "Clé" },
      { left: "Glass", right: "Verre" }, { left: "Mirror", right: "Miroir" }, { left: "Bag", right: "Sac" },
      { left: "Shoe", right: "Chaussure" }, { left: "Hat", right: "Chapeau" }, { left: "Phone", right: "Téléphone" },
    ],
  },
  places: {
    name: "Places",
    pairs: [
      { left: "Bakery", right: "Boulangerie" }, { left: "Town Hall", right: "Mairie" }, { left: "School", right: "École" },
      { left: "Library", right: "Bibliothèque" }, { left: "Hospital", right: "Hôpital" }, { left: "Airport", right: "Aéroport" },
      { left: "Beach", right: "Plage" }, { left: "Forest", right: "Forêt" }, { left: "Castle", right: "Château" },
      { left: "Bridge", right: "Pont" }, { left: "Market", right: "Marché" }, { left: "Church", right: "Église" },
      { left: "Museum", right: "Musée" }, { left: "Station", right: "Gare" }, { left: "Park", right: "Parc" },
      { left: "Pharmacy", right: "Pharmacie" },
    ],
  },
  greetings: {
    name: "Greetings",
    pairs: [
      { left: "Nice to meet you", right: "Enchanté" }, { left: "Good morning", right: "Bonjour" },
      { left: "Good evening", right: "Bonsoir" }, { left: "Goodbye", right: "Au revoir" },
      { left: "See you later", right: "À plus tard" }, { left: "How are you?", right: "Comment ça va ?" },
      { left: "Thank you", right: "Merci" }, { left: "Please", right: "S'il vous plaît" },
      { left: "You're welcome", right: "De rien" }, { left: "Excuse me", right: "Excusez-moi" },
      { left: "Have a nice day", right: "Bonne journée" }, { left: "Good night", right: "Bonne nuit" },
      { left: "Welcome", right: "Bienvenue" }, { left: "Happy birthday", right: "Bon anniversaire" },
      { left: "Cheers!", right: "Santé !" }, { left: "I'm sorry", right: "Je suis désolé" },
    ],
  },
  verbs: {
    name: "Verbs",
    pairs: [
      { left: "To jump", right: "Sauter" }, { left: "To achieve", right: "Réussir" },
      { left: "To run", right: "Courir" }, { left: "To eat", right: "Manger" },
      { left: "To sleep", right: "Dormir" }, { left: "To think", right: "Penser" },
      { left: "To write", right: "Écrire" }, { left: "To read", right: "Lire" },
      { left: "To swim", right: "Nager" }, { left: "To fly", right: "Voler" },
      { left: "To build", right: "Construire" }, { left: "To break", right: "Casser" },
      { left: "To sing", right: "Chanter" }, { left: "To dance", right: "Danser" },
      { left: "To draw", right: "Dessiner" }, { left: "To choose", right: "Choisir" },
      { left: "To begin", right: "Commencer" }, { left: "To finish", right: "Terminer" },
      { left: "To grow", right: "Grandir" }, { left: "To teach", right: "Enseigner" },
    ],
  },
  opposites: {
    name: "Opposites",
    pairs: [
      { left: "Bright", right: "Dark" }, { left: "High", right: "Low" },
      { left: "Fast", right: "Slow" }, { left: "Hot", right: "Cold" },
      { left: "Big", right: "Small" }, { left: "Happy", right: "Sad" },
      { left: "Old", right: "Young" }, { left: "Rich", right: "Poor" },
      { left: "Strong", right: "Weak" }, { left: "Loud", right: "Quiet" },
      { left: "Full", right: "Empty" }, { left: "Hard", right: "Soft" },
      { left: "Deep", right: "Shallow" }, { left: "Wide", right: "Narrow" },
      { left: "Heavy", right: "Light" }, { left: "Rough", right: "Smooth" },
      { left: "Sharp", right: "Blunt" }, { left: "Brave", right: "Coward" },
      { left: "Ancient", right: "Modern" }, { left: "Visible", right: "Invisible" },
    ],
  },
  synonyms: {
    name: "Synonyms",
    pairs: [
      { left: "Big", right: "Huge" }, { left: "Smart", right: "Intelligent" },
      { left: "Happy", right: "Joyful" }, { left: "Angry", right: "Furious" },
      { left: "Beautiful", right: "Gorgeous" }, { left: "Scared", right: "Terrified" },
      { left: "Quick", right: "Rapid" }, { left: "Hard", right: "Difficult" },
      { left: "Start", right: "Begin" }, { left: "End", right: "Finish" },
      { left: "Help", right: "Assist" }, { left: "Fix", right: "Repair" },
      { left: "Talk", right: "Speak" }, { left: "Watch", right: "Observe" },
      { left: "Create", right: "Produce" }, { left: "Brave", right: "Courageous" },
      { left: "Calm", right: "Peaceful" }, { left: "Rich", right: "Wealthy" },
      { left: "Old", right: "Ancient" }, { left: "Tiny", right: "Minuscule" },
      { left: "Odd", right: "Strange" }, { left: "Glad", right: "Pleased" },
      { left: "Sick", right: "Ill" }, { left: "Shy", right: "Timid" },
    ],
  },
  complexVerbs: {
    name: "Complex Verbs",
    pairs: [
      { left: "To overcome", right: "Surmonter" }, { left: "To withdraw", right: "Se retirer" },
      { left: "To acknowledge", right: "Reconnaître" }, { left: "To undertake", right: "Entreprendre" },
      { left: "To struggle", right: "Lutter" }, { left: "To surrender", right: "Se rendre" },
      { left: "To persuade", right: "Convaincre" }, { left: "To forbid", right: "Interdire" },
      { left: "To forgive", right: "Pardonner" }, { left: "To neglect", right: "Négliger" },
      { left: "To grasp", right: "Saisir" }, { left: "To praise", right: "Louer" },
      { left: "To threaten", right: "Menacer" }, { left: "To whisper", right: "Chuchoter" },
      { left: "To wander", right: "Errer" }, { left: "To rely on", right: "Compter sur" },
      { left: "To blame", right: "Blâmer" }, { left: "To deserve", right: "Mériter" },
      { left: "To flee", right: "Fuir" }, { left: "To seize", right: "Saisir" },
      { left: "To endure", right: "Endurer" }, { left: "To betray", right: "Trahir" },
      { left: "To cherish", right: "Chérir" }, { left: "To dwell", right: "Habiter" },
    ],
  },
  tenses: {
    name: "Tenses",
    pairs: [
      { left: "I have eaten", right: "Present Perfect" }, { left: "I was eating", right: "Past Continuous" },
      { left: "I will eat", right: "Simple Future" }, { left: "I ate", right: "Simple Past" },
      { left: "I eat", right: "Simple Present" }, { left: "I am eating", right: "Present Continuous" },
      { left: "I had eaten", right: "Past Perfect" }, { left: "I will have eaten", right: "Future Perfect" },
      { left: "I would eat", right: "Conditional" }, { left: "I will be eating", right: "Future Continuous" },
      { left: "I have been eating", right: "Present Perfect Cont." }, { left: "I had been eating", right: "Past Perfect Cont." },
      { left: "She has gone", right: "Present Perfect" }, { left: "They were playing", right: "Past Continuous" },
      { left: "He will run", right: "Simple Future" }, { left: "We walked", right: "Simple Past" },
      { left: "You speak", right: "Simple Present" }, { left: "It is raining", right: "Present Continuous" },
      { left: "She had left", right: "Past Perfect" }, { left: "They will have finished", right: "Future Perfect" },
      { left: "He would go", right: "Conditional" }, { left: "I will be running", right: "Future Continuous" },
      { left: "We have been waiting", right: "Present Perfect Cont." }, { left: "You had been studying", right: "Past Perfect Cont." },
      { left: "She is singing", right: "Present Continuous" }, { left: "They ate lunch", right: "Simple Past" },
      { left: "He has arrived", right: "Present Perfect" }, { left: "We will travel", right: "Simple Future" },
      { left: "I was reading", right: "Past Continuous" }, { left: "You had seen", right: "Past Perfect" },
      { left: "It will be snowing", right: "Future Continuous" }, { left: "She would have known", right: "Conditional Perfect" },
      { left: "They have been running", right: "Present Perfect Cont." }, { left: "He had been working", right: "Past Perfect Cont." },
      { left: "We will have left", right: "Future Perfect" }, { left: "I would play", right: "Conditional" },
      { left: "She walks", right: "Simple Present" }, { left: "He was sleeping", right: "Past Continuous" },
      { left: "You are laughing", right: "Present Continuous" }, { left: "They will have arrived", right: "Future Perfect" },
      { left: "I had finished", right: "Past Perfect" }, { left: "She will sing", right: "Simple Future" },
      { left: "We have played", right: "Present Perfect" }, { left: "He would swim", right: "Conditional" },
      { left: "They ate dinner", right: "Simple Past" }, { left: "It has stopped", right: "Present Perfect" },
      { left: "You will be dancing", right: "Future Continuous" }, { left: "I am writing", right: "Present Continuous" },
      { left: "She had been cooking", right: "Past Perfect Cont." }, { left: "We ate breakfast", right: "Simple Past" },
      { left: "He is jumping", right: "Present Continuous" }, { left: "They will go", right: "Simple Future" },
      { left: "I would have stayed", right: "Conditional Perfect" }, { left: "You have learned", right: "Present Perfect" },
      { left: "She was dancing", right: "Past Continuous" }, { left: "We had arrived", right: "Past Perfect" },
      { left: "They will be studying", right: "Future Continuous" }, { left: "He has been reading", right: "Present Perfect Cont." },
      { left: "I walked home", right: "Simple Past" }, { left: "You will have known", right: "Future Perfect" },
      { left: "She would write", right: "Conditional" }, { left: "We are learning", right: "Present Continuous" },
      { left: "They had been talking", right: "Past Perfect Cont." }, { left: "He ate quickly", right: "Simple Past" },
      { left: "I will have studied", right: "Future Perfect" }, { left: "You were running", right: "Past Continuous" },
    ],
  },
};

function pickPairs(cat: Category, count: number, usedIndices: Set<number>): { pairs: WordPair[]; newUsed: Set<number> } {
  const available = cat.pairs.map((p, i) => ({ p, i })).filter(({ i }) => !usedIndices.has(i));
  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  const newUsed = new Set(usedIndices);
  selected.forEach(({ i }) => newUsed.add(i));
  return { pairs: selected.map(({ p }) => p), newUsed };
}

function generateLevelsForPhase(
  phase: number, phaseName: string, startLevel: number, endLevel: number,
  cats: string[], pairsPerLevel: number, hasObstacle: boolean, hasNoCross: boolean, timerSeconds: number | null
): LevelData[] {
  const levels: LevelData[] = [];
  const usedMap: Record<string, Set<number>> = {};
  cats.forEach(c => usedMap[c] = new Set());

  for (let lvl = startLevel; lvl <= endLevel; lvl++) {
    const catKey = cats[(lvl - startLevel) % cats.length];
    const cat = categories[catKey];
    const { pairs, newUsed } = pickPairs(cat, pairsPerLevel, usedMap[catKey]);
    usedMap[catKey] = newUsed;
    levels.push({
      level: lvl, phase, phaseName, category: cat.name,
      pairs, hasObstacle, hasNoCross, timerSeconds,
    });
  }
  return levels;
}

// Generate deterministic levels using seeded data
function buildAllLevels(): LevelData[] {
  return [
    ...buildPhase1(),
    ...buildPhase2(),
    ...buildPhase3(),
    ...buildPhase4(),
    ...buildPhase5(),
  ];
}

function buildPhase1(): LevelData[] {
  const cats = [categories.animals, categories.objects];
  const levels: LevelData[] = [];
  for (let i = 0; i < 8; i++) {
    const cat = cats[i % 2];
    const start = i * 3;
    levels.push({
      level: i + 1, phase: 1, phaseName: "Discovery", category: cat.name,
      pairs: cat.pairs.slice(start % cat.pairs.length, (start % cat.pairs.length) + 3),
      hasObstacle: false, hasNoCross: false, timerSeconds: null,
    });
  }
  return levels;
}

function buildPhase2(): LevelData[] {
  const cats = [categories.places, categories.greetings];
  const levels: LevelData[] = [];
  for (let i = 0; i < 8; i++) {
    const cat = cats[i % 2];
    const start = i * 4;
    levels.push({
      level: i + 9, phase: 2, phaseName: "Social", category: cat.name,
      pairs: cat.pairs.slice(start % cat.pairs.length, (start % cat.pairs.length) + 4),
      hasObstacle: false, hasNoCross: false, timerSeconds: null,
    });
  }
  return levels;
}

function buildPhase3(): LevelData[] {
  const cats = [categories.verbs, categories.opposites];
  const levels: LevelData[] = [];
  for (let i = 0; i < 8; i++) {
    const cat = cats[i % 2];
    const start = i * 5;
    levels.push({
      level: i + 17, phase: 3, phaseName: "Words", category: cat.name,
      pairs: cat.pairs.slice(start % cat.pairs.length, (start % cat.pairs.length) + 5),
      hasObstacle: true, hasNoCross: false, timerSeconds: null,
    });
  }
  return levels;
}

function buildPhase4(): LevelData[] {
  const cats = [categories.synonyms, categories.complexVerbs];
  const levels: LevelData[] = [];
  for (let i = 0; i < 8; i++) {
    const cat = cats[i % 2];
    const start = i * 6;
    levels.push({
      level: i + 25, phase: 4, phaseName: "Fluency", category: cat.name,
      pairs: cat.pairs.slice(start % cat.pairs.length, (start % cat.pairs.length) + 6),
      hasObstacle: false, hasNoCross: true, timerSeconds: null,
    });
  }
  return levels;
}

function buildPhase5(): LevelData[] {
  const cat = categories.tenses;
  const levels: LevelData[] = [];
  for (let i = 0; i < 8; i++) {
    const start = i * 8;
    levels.push({
      level: i + 33, phase: 5, phaseName: "Mastery", category: cat.name,
      pairs: cat.pairs.slice(start, start + 8),
      hasObstacle: false, hasNoCross: true, timerSeconds: 60,
    });
  }
  return levels;
}

export const allLevels: LevelData[] = buildAllLevels();

export function getLevel(levelNum: number): LevelData | undefined {
  return allLevels.find(l => l.level === levelNum);
}

export const phaseInfo = [
  { phase: 1, name: "Discovery", color: "phase-discovery", levels: "1-8", icon: "🔍" },
  { phase: 2, name: "Social", color: "phase-social", levels: "9-16", icon: "💬" },
  { phase: 3, name: "Words", color: "phase-words", levels: "17-24", icon: "✏️" },
  { phase: 4, name: "Fluency", color: "phase-fluency", levels: "25-32", icon: "🎯" },
  { phase: 5, name: "Mastery", color: "phase-mastery", levels: "33-40", icon: "👑" },
];
