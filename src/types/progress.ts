export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface StepAnswerRecord {
  stepId: string;
  answer: string | string[];
  isCorrect?: boolean;
  answeredAt: string;
}

export interface QuizAttemptRecord {
  attemptedAt: string;
  questionIds: string[];
  answers: Record<string, string | string[]>;
  score: number;
  passed: boolean;
}

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  currentStepIndex: number;
  stepAnswers: StepAnswerRecord[];
  quizAttempts: QuizAttemptRecord[];
  startedAt?: string;
  completedAt?: string;
}

export interface UserProgress {
  userId: string;
  xp: number;
  streakDays: number;
  lessons: Record<string, LessonProgress>;
  lastActiveAt: string;
}
