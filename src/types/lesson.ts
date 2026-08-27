import type { LessonStep } from './step';
import type { ContentBlock } from './contentBlock';

export type LessonDifficulty = 'easy' | 'medium' | 'hard';

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  slug: string;
  summary: string;
  descriptionBlocks: ContentBlock[];
  tags: string[];
  difficulty: LessonDifficulty;
  isHidden: boolean;
  isPlaceholder: boolean;
  prerequisiteLessonId: string | null;
  steps: LessonStep[];
  quizConfig: {
    questionCount: number;
  };
  xpReward: number;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export type LessonInput = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;
