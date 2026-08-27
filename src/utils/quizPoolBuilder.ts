import type { Lesson } from '../types/lesson';
import type { Quiz, RuntimeQuizQuestion } from '../types/quiz';
import { shuffle } from './shuffle';

/**
 * A quiz is eligible for a lesson when they share at least one tag — this naturally covers
 * "current lesson", "past lesson", or "multiple lessons" depending on how the quiz is tagged,
 * without the admin having to hand-pick lesson IDs.
 */
export function buildQuizForLesson(
  lesson: Lesson,
  quizzes: Quiz[],
  allLessons: Lesson[],
): RuntimeQuizQuestion[] {
  const applicableQuizzes = quizzes.filter(
    (quiz) => !quiz.isHidden && quiz.tags.some((tag) => lesson.tags.includes(tag)),
  );

  const candidates: RuntimeQuizQuestion[] = applicableQuizzes.flatMap((quiz) => {
    // Which lessons (across the whole app) currently share a tag with this quiz — used for the
    // cross-lesson "harder" bias below, computed live instead of authored.
    const sourceLessonIds = allLessons
      .filter((l) => l.tags.some((tag) => quiz.tags.includes(tag)))
      .map((l) => l.id);
    return quiz.questions.map((question) => ({ ...question, sourceLessonIds }));
  });

  // Bias toward harder, cross-lesson questions: pull as many multi-lesson
  // quiz questions as possible before topping up with single-lesson ones.
  const crossLesson = shuffle(candidates.filter((q) => q.sourceLessonIds.length > 1));
  const singleLesson = shuffle(candidates.filter((q) => q.sourceLessonIds.length <= 1));
  const questionCount = Math.min(lesson.quizConfig.questionCount, candidates.length);
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
