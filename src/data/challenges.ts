export interface Challenge {
  id: string;
  from: string;
  to: string;
  subject: string;
  level: string;
  type: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  message?: string;
}

// Simulation d'une base de données locale
let challenges: Challenge[] = [
  {
    id: '1',
    from: 'Aminata Diallo',
    to: 'user', // Utilisateur actuel
    subject: 'Mathématiques',
    level: 'Terminale',
    type: 'QCM',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    message: 'Je te défie sur les probabilités !'
  },
  {
    id: '2',
    from: 'Moussa Traoré',
    to: 'user',
    subject: 'Physique',
    level: 'Première',
    type: 'Temps limité',
    status: 'pending',
    createdAt: '2024-01-14T16:45:00Z',
    message: 'Prêt pour un défi en électricité ?'
  }
];

export const getChallenges = () => challenges;

export const getPendingChallenges = () => 
  challenges.filter(challenge => challenge.status === 'pending' && challenge.to === 'user');

export const addChallenge = (challenge: Omit<Challenge, 'id' | 'createdAt' | 'status'>) => {
  const newChallenge: Challenge = {
    ...challenge,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  challenges.push(newChallenge);
  return newChallenge;
};

export const updateChallengeStatus = (challengeId: string, status: Challenge['status']) => {
  const index = challenges.findIndex(c => c.id === challengeId);
  if (index !== -1) {
    challenges[index].status = status;
    return challenges[index];
  }
  return null;
};

export const getPendingChallengesCount = () => getPendingChallenges().length;