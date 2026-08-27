import type { Account } from './account';
import type { Course } from './course';
import type { Lesson } from './lesson';
import type { KnowledgeHubEntry } from './knowledgeHub';
import type { Quiz } from './quiz';
import type { UserProgress } from './progress';

export interface AppData {
  version: number;
  accounts: Account[];
  courses: Course[];
  lessons: Lesson[];
  knowledgeHubEntries: KnowledgeHubEntry[];
  quizzes: Quiz[];
  progress: Record<string, UserProgress>;
  currentUserId: string | null;
}
