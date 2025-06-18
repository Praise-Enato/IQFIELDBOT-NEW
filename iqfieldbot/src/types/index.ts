export interface User {
  id: string;
  email: string;
  name: string;
  preferredFields: string[];
  totalScore: number;
  testsCompleted: number;
}

export interface Question {
  id: string;
  field: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: 'multiple_choice' | 'text' | 'number';
}

export interface TestSession {
  id: string;
  userId: string;
  field: string;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  consecutiveCorrect: number;
  startTime: Date;
  endTime?: Date;
  questions?: Question[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}