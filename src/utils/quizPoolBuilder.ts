import type { Lesson } from '../types/lesson';
import type { Quiz, RuntimeQuizQuestion } from '../types/quiz';
import { shuffle } from './shuffle';

/**
 * Assembles a fresh 2–3 question quiz for the lesson the trainee just finished.
 *
 * The candidate pool is scoped to the trainee's *unlocked knowledge*: quizzes whose tags
 * intersect the tags of the current lesson OR any lesson this trainee has already passed.
 * `completedLessons` carries that per-trainee set (derived from progress, never shown to
 * the trainee). A question is treated as "cross-lesson" — and drawn first — when its owning
 * quiz spans more than one of those known lessons, so later attempts naturally mix material.
 * The set is re-drawn and re-shuffled on every call, so no two attempts look the same.
 */
export function buildQuizForLesson(
  lesson: Lesson,
  quizzes: Quiz[],
  completedLessons: Lesson[],
): RuntimeQuizQuestion[] {
  const knowledgeLessons = [lesson, ...completedLessons.filter((l) => l.id !== lesson.id)];
  const knowledgeTags = new Set(knowledgeLessons.flatMap((l) => l.tags));

  const applicableQuizzes = quizzes.filter(
    (quiz) => !quiz.isHidden && quiz.tags.some((tag) => knowledgeTags.has(tag)),
  );

  const byId = new Map<string, RuntimeQuizQuestion>();
  for (const quiz of applicableQuizzes) {
    // Which of the trainee's known lessons this quiz spans — drives the cross-lesson bias.
    const sourceLessonIds = knowledgeLessons
      .filter((l) => l.tags.some((tag) => quiz.tags.includes(tag)))
      .map((l) => l.id);
    for (const question of quiz.questions) {
      if (!byId.has(question.id)) byId.set(question.id, { ...question, sourceLessonIds });
    }
  }
  const candidates = [...byId.values()];

  const crossLesson = shuffle(candidates.filter((q) => q.sourceLessonIds.length > 1));
  const singleLesson = shuffle(candidates.filter((q) => q.sourceLessonIds.length <= 1));

  // 2 or 3 questions, chosen at random each attempt, capped by what's actually available.
  const target = Math.random() < 0.5 ? 2 : 3;
  const questionCount = Math.min(target, candidates.length);
  const picked = [...crossLesson, ...singleLesson].slice(0, questionCount);

  return shuffle(picked);
}

export function scoreQuizAnswers(
  questions: RuntimeQuizQuestion[],
  answers: Record<string, string | string[]>,
): number {
  if (questions.length === 0) return 0;
  const correctCount = questions.filter((q) => {
    const given = answers[q.id];
    if (q.type === 'single-choice') return given === q.correctOptionId;
    if (q.type === 'multi-choice') {
      const givenSet = new Set(Array.isArray(given) ? given : []);
      const correctSet = new Set(q.correctOptionIds);
      return givenSet.size === correctSet.size && [...correctSet].every((id) => givenSet.has(id));
    }
    // free-text / salesforce-mock-timed / live-chat-mock / phone-call-mock / info: self-assessed, never fails the quiz
    return true;
  }).length;
  return correctCount / questions.length;
}
