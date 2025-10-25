export interface Reward {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ChallengeReward {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: Reward;
  completed: boolean;
  category: 'quiz' | 'chapters' | 'battles';
  color: string;
}

export const rewards: Reward[] = [
  {
    id: 'tshirt-educ',
    name: 'T-shirt éducatif',
    description: 'Un magnifique t-shirt aux couleurs de l\'excellence',
    imageUrl: '/rewards/tshirt.svg'
  },
  {
    id: 'cap-winner',
    name: 'Casquette Champion',
    description: 'Une casquette pour les vrais champions',
    imageUrl: '/rewards/cap.svg'
  },
  {
    id: 'book-science',
    name: 'Livre de Sciences',
    description: 'Un livre éducatif de qualité',
    imageUrl: '/rewards/book.svg'
  },
  {
    id: 'novel-classic',
    name: 'Roman classique',
    description: 'Un roman pour développer ta culture',
    imageUrl: '/rewards/novel.svg'
  },
  {
    id: 'annales-bac',
    name: 'Annales du BAC',
    description: 'Collection complète des annales',
    imageUrl: '/rewards/annales.svg'
  },
  {
    id: 'tokens-100',
    name: '100 Jetons bonus',
    description: '100 jetons supplémentaires pour tes révisions',
    imageUrl: '/rewards/tokens.svg'
  }
];

// Simulation d'une base de données locale
let challengesRewards: ChallengeReward[] = [
  {
    id: 'challenge-quiz-500',
    title: 'Maître des Quiz',
    description: 'Compléter 500 quiz',
    target: 500,
    current: 127,
    reward: rewards[0], // T-shirt
    completed: false,
    category: 'quiz',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'challenge-chapters-20',
    title: 'Expert des Chapitres',
    description: 'Réviser 20 chapitres',
    target: 20,
    current: 8,
    reward: rewards[2], // Livre
    completed: false,
    category: 'chapters',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'challenge-battles-10',
    title: 'Guerrier Invincible',
    description: 'Battre 10 adversaires d\'affilée en mode défi',
    target: 10,
    current: 3,
    reward: rewards[1], // Casquette
    completed: false,
    category: 'battles',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'challenge-quiz-100',
    title: 'Apprenti Quiz',
    description: 'Compléter 100 quiz',
    target: 100,
    current: 127,
    reward: rewards[5], // 100 jetons
    completed: true,
    category: 'quiz',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'challenge-chapters-50',
    title: 'Sage des Savoirs',
    description: 'Réviser 50 chapitres',
    target: 50,
    current: 8,
    reward: rewards[4], // Annales
    completed: false,
    category: 'chapters',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'challenge-battles-25',
    title: 'Légende des Défis',
    description: 'Battre 25 adversaires d\'affilée',
    target: 25,
    current: 3,
    reward: rewards[3], // Roman
    completed: false,
    category: 'battles',
    color: 'from-red-500 to-red-600'
  }
];

// Données utilisateur pour les challenges
export interface UserChallengeData {
  selectedChallengeId: string | null;
  completedChallenges: string[];
  claimedRewards: string[];
  totalChallengesCompleted: number;
}

let userChallengeData: UserChallengeData = {
  selectedChallengeId: null,
  completedChallenges: ['challenge-quiz-100'],
  claimedRewards: [],
  totalChallengesCompleted: 1
};

export const getChallengesRewards = () => challengesRewards;

export const getSelectedChallenge = () => {
  if (!userChallengeData.selectedChallengeId) return null;
  return challengesRewards.find(c => c.id === userChallengeData.selectedChallengeId);
};

export const selectChallenge = (challengeId: string) => {
  userChallengeData.selectedChallengeId = challengeId;
  return challengesRewards.find(c => c.id === challengeId);
};

export const updateChallengeProgress = (challengeId: string, newCurrent: number) => {
  const challenge = challengesRewards.find(c => c.id === challengeId);
  if (challenge) {
    challenge.current = newCurrent;
    if (newCurrent >= challenge.target && !challenge.completed) {
      challenge.completed = true;
      userChallengeData.completedChallenges.push(challengeId);
      userChallengeData.totalChallengesCompleted++;
    }
  }
  return challenge;
};

export const claimReward = (challengeId: string) => {
  if (!userChallengeData.claimedRewards.includes(challengeId)) {
    userChallengeData.claimedRewards.push(challengeId);
  }
};

export const getUserChallengeData = () => userChallengeData;

export const getTotalChallengesCompleted = () => userChallengeData.totalChallengesCompleted;
