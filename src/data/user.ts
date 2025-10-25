
export interface ProgressStat {
  subject: string;
  completedExams: number;
  totalExams: number;
  averageScore: number;
}

export interface UserProgress {
  examHistory: {
    examId: string;
    date: string;
    score: number;
    timeSpent: number;
  }[];
  chapterProgress: {
    chapterId: string;
    completed: boolean;
    quizScore?: number;
  }[];
  statistics: {
    totalExamsCompleted: number;
    totalTimeSpent: number; // en minutes
    averageScore: number;
    subjectStats: ProgressStat[];
  };
  badges: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    dateEarned: string;
  }[];
  tokens: {
    balance: number;
    totalEarned: number;
  };
}

// Données d'exemple pour un utilisateur
export const userProgress: UserProgress = {
  examHistory: [
    {
      examId: "math-3eme-devoir1",
      date: "2024-05-15",
      score: 85,
      timeSpent: 45
    },
    {
      examId: "french-5eme-devoir1",
      date: "2024-05-10",
      score: 92,
      timeSpent: 75
    },
    {
      examId: "svt-4eme-devoir1",
      date: "2024-05-05",
      score: 78,
      timeSpent: 50
    }
  ],
  chapterProgress: [
    {
      chapterId: "math-3eme-pythagore",
      completed: true,
      quizScore: 90
    },
    {
      chapterId: "physics-1ere-newton",
      completed: false
    }
  ],
  statistics: {
    totalExamsCompleted: 3,
    totalTimeSpent: 170,
    averageScore: 85,
    subjectStats: [
      {
        subject: "math",
        completedExams: 1,
        totalExams: 1,
        averageScore: 85
      },
      {
        subject: "french",
        completedExams: 1,
        totalExams: 1,
        averageScore: 92
      },
      {
        subject: "svt",
        completedExams: 1,
        totalExams: 1,
        averageScore: 78
      }
    ]
  },
  badges: [
    {
      id: "first-quiz",
      name: "Premier Pas",
      description: "A terminé son premier quiz avec succès",
      imageUrl: "/badges/first-quiz.svg",
      dateEarned: "2024-05-05"
    },
    {
      id: "math-star",
      name: "Star des Maths",
      description: "A obtenu plus de 80% en mathématiques",
      imageUrl: "/badges/math-star.svg",
      dateEarned: "2024-05-15"
    }
  ],
  tokens: {
    balance: 15,
    totalEarned: 15
  }
};
