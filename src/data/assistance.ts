export interface AssistanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  questionType: 'cours' | 'exercice' | 'comprehension' | 'autre';
  description: string;
  imageUrl?: string;
  status: 'pending' | 'answered' | 'closed';
  createdAt: Date;
  response?: {
    text: string;
    imageUrl?: string;
    teacherName: string;
    answeredAt: Date;
  };
}

export interface AssistanceStats {
  questionsAsked: number;
  freeQuestionsRemaining: number;
  hasSubscription: boolean;
}

// Données mockées pour les demandes d'assistance
export const assistanceRequests: AssistanceRequest[] = [
  {
    id: '1',
    studentId: 'student1',
    studentName: 'Marie Dupont',
    subject: 'Mathématiques',
    questionType: 'exercice',
    description: 'Je ne comprends pas comment résoudre une équation du second degré avec discriminant négatif.',
    status: 'answered',
    createdAt: new Date(2024, 0, 15),
    response: {
      text: 'Bonjour Marie, quand le discriminant est négatif, l\'équation n\'a pas de solution dans l\'ensemble des réels ℝ. On dit que l\'équation n\'admet pas de racines réelles. Par exemple, pour x² + x + 1 = 0, Δ = 1 - 4 = -3 < 0, donc pas de solution réelle.',
      teacherName: 'M. Kouassi',
      answeredAt: new Date(2024, 0, 15, 14, 30)
    }
  },
  {
    id: '2',
    studentId: 'student1',
    studentName: 'Marie Dupont',
    subject: 'Physique-Chimie',
    questionType: 'cours',
    description: 'Quelle est la différence entre la masse et le poids d\'un corps ?',
    status: 'pending',
    createdAt: new Date(2024, 0, 18)
  },
  {
    id: '3',
    studentId: 'student2',
    studentName: 'Jean Koné',
    subject: 'SVT',
    questionType: 'comprehension',
    description: 'Comment se fait la photosynthèse chez les plantes ?',
    status: 'answered',
    createdAt: new Date(2024, 0, 14),
    response: {
      text: 'La photosynthèse est le processus par lequel les plantes vertes utilisent l\'énergie lumineuse pour transformer le CO2 et l\'eau en glucose et oxygène. Elle se déroule dans les chloroplastes grâce à la chlorophylle. L\'équation simplifiée est : 6CO2 + 6H2O + lumière → C6H12O6 + 6O2',
      teacherName: 'Mme Traoré',
      answeredAt: new Date(2024, 0, 14, 16, 0)
    }
  },
  {
    id: '4',
    studentId: 'student3',
    studentName: 'Fatou Diallo',
    subject: 'Français',
    questionType: 'exercice',
    description: 'Comment identifier le complément d\'objet direct dans une phrase ?',
    status: 'pending',
    createdAt: new Date(2024, 0, 19)
  }
];

// Stats pour l'élève connecté
export const currentStudentStats: AssistanceStats = {
  questionsAsked: 2,
  freeQuestionsRemaining: 1,
  hasSubscription: false
};

// Fonction pour obtenir les demandes d'un élève
export const getStudentRequests = (studentId: string): AssistanceRequest[] => {
  return assistanceRequests.filter(req => req.studentId === studentId);
};

// Fonction pour obtenir toutes les demandes (pour l'enseignant)
export const getAllRequests = (): AssistanceRequest[] => {
  return assistanceRequests;
};

// Fonction pour vérifier si l'élève peut poser une question
export const canAskQuestion = (stats: AssistanceStats): boolean => {
  return stats.hasSubscription || stats.freeQuestionsRemaining > 0;
};

// Identifiants enseignant mockés
export const teacherCredentials = {
  username: 'enseignant',
  password: 'demo123'
};
