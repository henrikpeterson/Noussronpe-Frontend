export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: string;
  class: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

export const friends: Friend[] = [
  {
    id: "1",
    name: "Marie Dubois",
    avatar: "MD",
    level: "3ème",
    class: "3ème A",
    status: "online"
  },
  {
    id: "2", 
    name: "Jean Martin",
    avatar: "JM",
    level: "3ème",
    class: "3ème B",
    status: "offline",
    lastSeen: "Il y a 2h"
  },
  {
    id: "3",
    name: "Sophie Bernard",
    avatar: "SB", 
    level: "4ème",
    class: "4ème A",
    status: "online"
  },
  {
    id: "4",
    name: "Lucas Petit",
    avatar: "LP",
    level: "3ème", 
    class: "3ème A",
    status: "offline",
    lastSeen: "Il y a 5min"
  },
  {
    id: "5",
    name: "Emma Moreau",
    avatar: "EM",
    level: "2nde",
    class: "2nde C", 
    status: "online"
  },
  {
    id: "6",
    name: "Hugo Leroy",
    avatar: "HL",
    level: "4ème",
    class: "4ème B",
    status: "offline", 
    lastSeen: "Il y a 1h"
  }
];

export const challengeTypes = [
  {
    id: "qcm",
    name: "QCM",
    description: "Questions à choix multiples",
    icon: "HelpCircle"
  },
  {
    id: "flashcard", 
    name: "Flashcard",
    description: "Cartes de révision rapide",
    icon: "Zap"
  },
  {
    id: "temps-limite",
    name: "Temps limité", 
    description: "Course contre la montre",
    icon: "Timer"
  },
  {
    id: "vrai-faux",
    name: "Vrai/Faux",
    description: "Questions vrai ou faux",
    icon: "CheckCircle"
  }
];