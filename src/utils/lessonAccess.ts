import type { Lesson } from '../types/lesson';
import type { LessonStatus, UserProgress } from '../types/progress';

export function getLessonStatus(lesson: Lesson, userProgress: UserProgress): LessonStatus {
  const stored = userProgress.lessons[lesson.id]?.status;
  if (stored === 'completed' || stored === 'in-progress') return stored;
  if (!lesson.prerequisiteLessonId) return 'available';
  return userProgress.lessons[lesson.prerequisiteLessonId]?.status === 'completed'
    ? 'available'
    : 'locked';
}

export function isKnowledgeHubEntryUnlocked(
  unlockedByLessonId: string,
  userProgress: UserProgress,
): boolean {
  const status = userProgress.lessons[unlockedByLessonId]?.status;
  return status === 'in-progress' || status === 'completed';
}
