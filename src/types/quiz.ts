import type { LessonStep } from './step';

/** A quiz question can be any lesson step format (choice, free-text, salesforce mock, live chat mock). */
export type QuizQuestion = LessonStep;

export interface Quiz {
  id: string;
  title: string;
  /** Topic tags shared with Lesson.tags — a quiz is eligible after any lesson sharing a tag. */
  tags: string[];
  questions: QuizQuestion[];
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuizInput = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>;

/** A question enriched at build-time with which lesson(s) currently share a tag with its owning quiz. */
export type RuntimeQuizQuestion = QuizQuestion & { sourceLessonIds: string[] };
