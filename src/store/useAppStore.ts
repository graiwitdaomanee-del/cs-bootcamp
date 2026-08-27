import { create } from 'zustand';
import type { AppData } from '../types/appData';
import type { Lesson, LessonInput } from '../types/lesson';
import type { Course, CourseInput } from '../types/course';
import type { Quiz, QuizInput } from '../types/quiz';
import type { KnowledgeHubEntry, KnowledgeHubEntryInput } from '../types/knowledgeHub';
import type { LessonProgress, QuizAttemptRecord, UserProgress } from '../types/progress';
import { buildSeedAppData } from '../data/seed/buildSeed';
import { id as makeId } from '../utils/id';

function emptyLessonProgress(lessonId: string): LessonProgress {
  return {
    lessonId,
    status: 'available',
    currentStepIndex: 0,
    stepAnswers: [],
    quizAttempts: [],
  };
}

function ensureUserProgress(progress: Record<string, UserProgress>, userId: string): UserProgress {
  return (
    progress[userId] ?? {
      userId,
      xp: 0,
      streakDays: 0,
      lessons: {},
      lastActiveAt: new Date().toISOString(),
    }
  );
}

interface AppState extends AppData {
  login: (userId: string) => void;
  logout: () => void;
  addLesson: (input: LessonInput) => void;
  updateLesson: (lessonId: string, patch: Partial<Lesson>) => void;
  toggleHideLesson: (lessonId: string) => void;
  deleteLesson: (lessonId: string) => void;
  addCourse: (input: CourseInput) => Course;
  updateCourse: (courseId: string, patch: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addQuiz: (input: QuizInput) => void;
  updateQuiz: (quizId: string, patch: Partial<Quiz>) => void;
  toggleHideQuiz: (quizId: string) => void;
  deleteQuiz: (quizId: string) => void;
  addKnowledgeHubEntry: (input: KnowledgeHubEntryInput) => void;
  updateKnowledgeHubEntry: (entryId: string, patch: Partial<KnowledgeHubEntry>) => void;
  deleteKnowledgeHubEntry: (entryId: string) => void;
  startLesson: (userId: string, lessonId: string) => void;
  submitStepAnswer: (
    userId: string,
    lessonId: string,
    stepId: string,
    answer: string | string[],
  ) => void;
  submitQuizAttempt: (
    userId: string,
    lessonId: string,
    attempt: QuizAttemptRecord,
  ) => void;
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  ...buildSeedAppData(),

    login: (userId) => set({ currentUserId: userId }),

    logout: () => set({ currentUserId: null }),

    addLesson: (input) => {
      const now = new Date().toISOString();
      const newLesson: Lesson = { ...input, id: makeId('lesson'), createdAt: now, updatedAt: now };
      set((state) => ({ lessons: [...state.lessons, newLesson] }));
    },

    updateLesson: (lessonId, patch) => {
      const now = new Date().toISOString();
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, ...patch, updatedAt: now } : lesson,
        ),
      }));
    },

    toggleHideLesson: (lessonId) => {
      const now = new Date().toISOString();
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, isHidden: !lesson.isHidden, updatedAt: now }
            : lesson,
        ),
      }));
    },

    deleteLesson: (lessonId) => {
      set((state) => ({ lessons: state.lessons.filter((lesson) => lesson.id !== lessonId) }));
    },

    addCourse: (input) => {
      const newCourse: Course = { ...input, id: makeId('course') };
      set((state) => ({ courses: [...state.courses, newCourse] }));
      return newCourse;
    },

    updateCourse: (courseId, patch) => {
      set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId ? { ...course, ...patch } : course,
        ),
      }));
    },

    deleteCourse: (courseId) => {
      set((state) => ({
        courses: state.courses.filter((course) => course.id !== courseId),
        lessons: state.lessons.filter((lesson) => lesson.courseId !== courseId),
      }));
    },

    addQuiz: (input) => {
      const now = new Date().toISOString();
      const newQuiz: Quiz = { ...input, id: makeId('quiz'), createdAt: now, updatedAt: now };
      set((state) => ({ quizzes: [...state.quizzes, newQuiz] }));
    },

    updateQuiz: (quizId, patch) => {
      const now = new Date().toISOString();
      set((state) => ({
        quizzes: state.quizzes.map((quiz) =>
          quiz.id === quizId ? { ...quiz, ...patch, updatedAt: now } : quiz,
        ),
      }));
    },

    toggleHideQuiz: (quizId) => {
      const now = new Date().toISOString();
      set((state) => ({
        quizzes: state.quizzes.map((quiz) =>
          quiz.id === quizId ? { ...quiz, isHidden: !quiz.isHidden, updatedAt: now } : quiz,
        ),
      }));
    },

    deleteQuiz: (quizId) => {
      set((state) => ({ quizzes: state.quizzes.filter((quiz) => quiz.id !== quizId) }));
    },

    addKnowledgeHubEntry: (input) => {
      const newEntry: KnowledgeHubEntry = { ...input, id: makeId('kh') };
      set((state) => ({ knowledgeHubEntries: [...state.knowledgeHubEntries, newEntry] }));
    },

    updateKnowledgeHubEntry: (entryId, patch) => {
      set((state) => ({
        knowledgeHubEntries: state.knowledgeHubEntries.map((entry) =>
          entry.id === entryId ? { ...entry, ...patch } : entry,
        ),
      }));
    },

    deleteKnowledgeHubEntry: (entryId) => {
      set((state) => ({
        knowledgeHubEntries: state.knowledgeHubEntries.filter((entry) => entry.id !== entryId),
      }));
    },

    startLesson: (userId, lessonId) => {
      set((state) => {
        const userProgress = ensureUserProgress(state.progress, userId);
        const existing = userProgress.lessons[lessonId];
        if (existing && existing.status !== 'available') {
          return state;
        }
        const now = new Date().toISOString();
        const updatedLessonProgress: LessonProgress = {
          ...(existing ?? emptyLessonProgress(lessonId)),
          status: 'in-progress',
          startedAt: existing?.startedAt ?? now,
        };
        return {
          progress: {
            ...state.progress,
            [userId]: {
              ...userProgress,
              lastActiveAt: now,
              lessons: { ...userProgress.lessons, [lessonId]: updatedLessonProgress },
            },
          },
        };
      });
    },

    submitStepAnswer: (userId, lessonId, stepId, answer) => {
      set((state) => {
        const lesson = state.lessons.find((l) => l.id === lessonId);
        const userProgress = ensureUserProgress(state.progress, userId);
        const lessonProgress = userProgress.lessons[lessonId] ?? emptyLessonProgress(lessonId);
        const step = lesson?.steps.find((s) => s.id === stepId);

        let isCorrect: boolean | undefined;
        if (step?.type === 'single-choice') {
          isCorrect = answer === step.correctOptionId;
        } else if (step?.type === 'multi-choice') {
          const given = new Set(Array.isArray(answer) ? answer : [answer]);
          const correct = new Set(step.correctOptionIds);
          isCorrect = given.size === correct.size && [...correct].every((o) => given.has(o));
        }

        const now = new Date().toISOString();
        const nextStepAnswers = [
          ...lessonProgress.stepAnswers.filter((a) => a.stepId !== stepId),
          { stepId, answer, isCorrect, answeredAt: now },
        ];
        const stepArrayIndex = lesson?.steps.findIndex((s) => s.id === stepId) ?? -1;
        const nextIndex = Math.max(lessonProgress.currentStepIndex, stepArrayIndex + 1);

        const updatedLessonProgress: LessonProgress = {
          ...lessonProgress,
          status: 'in-progress',
          stepAnswers: nextStepAnswers,
          currentStepIndex: nextIndex,
        };

        return {
          progress: {
            ...state.progress,
            [userId]: {
              ...userProgress,
              lastActiveAt: now,
              lessons: { ...userProgress.lessons, [lessonId]: updatedLessonProgress },
            },
          },
        };
      });
    },

    submitQuizAttempt: (userId, lessonId, attempt) => {
      set((state) => {
        const lesson = state.lessons.find((l) => l.id === lessonId);
        const userProgress = ensureUserProgress(state.progress, userId);
        const lessonProgress = userProgress.lessons[lessonId] ?? emptyLessonProgress(lessonId);
        const now = new Date().toISOString();

        const updatedLessonProgress: LessonProgress = {
          ...lessonProgress,
          quizAttempts: [...lessonProgress.quizAttempts, attempt],
          status: attempt.passed ? 'completed' : lessonProgress.status,
          completedAt: attempt.passed ? now : lessonProgress.completedAt,
        };

        const xpGain = attempt.passed ? lesson?.xpReward ?? 0 : 0;

        return {
          progress: {
            ...state.progress,
            [userId]: {
              ...userProgress,
              xp: userProgress.xp + xpGain,
              lastActiveAt: now,
              lessons: { ...userProgress.lessons, [lessonId]: updatedLessonProgress },
            },
          },
        };
      });
    },

    resetDemoData: () => set(buildSeedAppData()),
}));
