import type { AppData } from '../../types/appData';
import type { UserProgress, LessonProgress } from '../../types/progress';
import { seedAccounts, ACCOUNT_IDS } from './users.seed';
import { seedCourses } from './courses.seed';
import { seedLessons, LESSON_IDS } from './lessons.seed';
import { seedKnowledgeHubEntries } from './knowledgeHub.seed';
import { seedQuizzes } from './quizzes.seed';

const PAST_TIMESTAMP = '2026-05-28T09:00:00.000Z';

function completedLessonProgress(lessonId: string, xpQuestionIds: string[]): LessonProgress {
  return {
    lessonId,
    status: 'completed',
    currentStepIndex: 0,
    stepAnswers: [],
    quizAttempts: [
      {
        attemptedAt: PAST_TIMESTAMP,
        questionIds: xpQuestionIds,
        answers: {},
        score: 0.8,
        passed: true,
      },
    ],
    startedAt: PAST_TIMESTAMP,
    completedAt: PAST_TIMESTAMP,
  };
}

function emptyUserProgress(userId: string): UserProgress {
  return {
    userId,
    xp: 0,
    streakDays: 0,
    lessons: {},
    lastActiveAt: PAST_TIMESTAMP,
  };
}

function inProgressLessonProgress(lessonId: string, currentStepIndex: number): LessonProgress {
  return {
    lessonId,
    status: 'in-progress',
    currentStepIndex,
    stepAnswers: [],
    quizAttempts: [],
    startedAt: PAST_TIMESTAMP,
  };
}

export function buildSeedAppData(): AppData {
  // Ploy — just started Course 1, two lessons done.
  const ployProgress: UserProgress = {
    userId: ACCOUNT_IDS.ploy,
    xp: 210,
    streakDays: 3,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.mo1]: completedLessonProgress(LESSON_IDS.mo1, [
        'q-mo1-1',
        'q-mo1-2',
        'q-mo1-3',
        'q-mo1-4',
        'q-mo1-5',
      ]),
      [LESSON_IDS.mo2]: completedLessonProgress(LESSON_IDS.mo2, [
        'q-mo2-1',
        'q-mo2-2',
        'q-mo2-3',
        'q-mo2-4',
        'q-mo2-5',
      ]),
    },
  };

  const beamProgress: UserProgress = emptyUserProgress(ACCOUNT_IDS.beam);
  const adminProgress: UserProgress = emptyUserProgress(ACCOUNT_IDS.admin);

  // Nan — steady through the first four lessons of Course 1.
  const nanProgress: UserProgress = {
    userId: ACCOUNT_IDS.nan,
    xp: 460,
    streakDays: 7,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.mo1]: completedLessonProgress(LESSON_IDS.mo1, ['q-mo1-1', 'q-mo1-2', 'q-mo1-3']),
      [LESSON_IDS.mo2]: completedLessonProgress(LESSON_IDS.mo2, ['q-mo2-1', 'q-mo2-2', 'q-mo2-3']),
      [LESSON_IDS.mo3]: completedLessonProgress(LESSON_IDS.mo3, [
        'q-mo3-1',
        'q-mo3-2',
        'q-mo3-3',
        'q-mo3-4',
      ]),
      [LESSON_IDS.mo4]: completedLessonProgress(LESSON_IDS.mo4, [
        'q-mo4-1',
        'q-mo4-2',
        'q-mo4-3',
        'q-mo4-4',
      ]),
    },
  };

  // Ohm — brand new, mid-way through the first lesson.
  const ohmProgress: UserProgress = {
    userId: ACCOUNT_IDS.ohm,
    xp: 0,
    streakDays: 1,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.mo1]: inProgressLessonProgress(LESSON_IDS.mo1, 2),
    },
  };

  // Fah — jumped straight into the POS course, one lesson done (with a retry).
  const fahProgress: UserProgress = {
    userId: ACCOUNT_IDS.fah,
    xp: 100,
    streakDays: 2,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.wp1]: {
        lessonId: LESSON_IDS.wp1,
        status: 'completed',
        currentStepIndex: 0,
        stepAnswers: [],
        quizAttempts: [
          {
            attemptedAt: PAST_TIMESTAMP,
            questionIds: ['q-wp1-1', 'q-wp1-2', 'q-wp1-3', 'q-wp1-4', 'q-wp1-5'],
            answers: {},
            score: 0.4,
            passed: false,
          },
          {
            attemptedAt: PAST_TIMESTAMP,
            questionIds: ['q-wp1-1', 'q-wp1-2', 'q-wp1-3', 'q-wp1-4', 'q-wp1-5'],
            answers: {},
            score: 0.8,
            passed: true,
          },
        ],
        startedAt: PAST_TIMESTAMP,
        completedAt: PAST_TIMESTAMP,
      },
    },
  };

  // Gap — the cohort's front-runner: through Course 1's first three lessons and
  // into the POS course, on a 12-day streak.
  const gapProgress: UserProgress = {
    userId: ACCOUNT_IDS.gap,
    xp: 560,
    streakDays: 12,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.mo1]: completedLessonProgress(LESSON_IDS.mo1, ['q-mo1-1', 'q-mo1-2', 'q-mo1-3']),
      [LESSON_IDS.mo2]: completedLessonProgress(LESSON_IDS.mo2, ['q-mo2-1', 'q-mo2-2', 'q-mo2-3']),
      [LESSON_IDS.mo3]: completedLessonProgress(LESSON_IDS.mo3, ['q-mo3-1', 'q-mo3-2', 'q-mo3-3']),
      [LESSON_IDS.wp1]: completedLessonProgress(LESSON_IDS.wp1, ['q-wp1-1', 'q-wp1-2', 'q-wp1-3']),
      [LESSON_IDS.wp2]: completedLessonProgress(LESSON_IDS.wp2, ['q-wp2-1', 'q-wp2-2', 'q-wp2-3']),
      [LESSON_IDS.fs1]: inProgressLessonProgress(LESSON_IDS.fs1, 2),
    },
  };

  return {
    version: 1,
    accounts: seedAccounts,
    courses: seedCourses,
    lessons: seedLessons,
    knowledgeHubEntries: seedKnowledgeHubEntries,
    quizzes: seedQuizzes,
    progress: {
      [ACCOUNT_IDS.ploy]: ployProgress,
      [ACCOUNT_IDS.beam]: beamProgress,
      [ACCOUNT_IDS.admin]: adminProgress,
      [ACCOUNT_IDS.nan]: nanProgress,
      [ACCOUNT_IDS.ohm]: ohmProgress,
      [ACCOUNT_IDS.fah]: fahProgress,
      [ACCOUNT_IDS.gap]: gapProgress,
    },
    currentUserId: null,
  };
}
