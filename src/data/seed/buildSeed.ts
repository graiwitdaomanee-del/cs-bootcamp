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
  const ployProgress: UserProgress = {
    userId: ACCOUNT_IDS.ploy,
    xp: 220,
    streakDays: 3,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.welcome]: completedLessonProgress(LESSON_IDS.welcome, [
        'q-welcome-1',
        'q-welcome-2',
        'q-welcome-3',
        'q-welcome-4',
      ]),
      [LESSON_IDS.orderComplaint]: completedLessonProgress(LESSON_IDS.orderComplaint, [
        'q-order-1',
        'q-order-2',
        'q-order-3',
        'q-order-4',
      ]),
    },
  };

  const beamProgress: UserProgress = emptyUserProgress(ACCOUNT_IDS.beam);
  const adminProgress: UserProgress = emptyUserProgress(ACCOUNT_IDS.admin);

  const nanProgress: UserProgress = {
    userId: ACCOUNT_IDS.nan,
    xp: 640,
    streakDays: 7,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.welcome]: completedLessonProgress(LESSON_IDS.welcome, [
        'q-welcome-1',
        'q-welcome-2',
        'q-welcome-3',
        'q-welcome-4',
      ]),
      [LESSON_IDS.orderComplaint]: completedLessonProgress(LESSON_IDS.orderComplaint, [
        'q-order-1',
        'q-order-2',
        'q-order-3',
        'q-order-4',
      ]),
      [LESSON_IDS.menuSetup]: completedLessonProgress(LESSON_IDS.menuSetup, [
        'q-menu-1',
        'q-menu-2',
        'q-menu-3',
        'q-menu-4',
      ]),
      [LESSON_IDS.adsPayout]: completedLessonProgress(LESSON_IDS.adsPayout, [
        'q-ads-1',
        'q-ads-2',
        'q-ads-3',
        'q-ads-4',
      ]),
    },
  };

  const ohmProgress: UserProgress = {
    userId: ACCOUNT_IDS.ohm,
    xp: 20,
    streakDays: 1,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.welcome]: inProgressLessonProgress(LESSON_IDS.welcome, 1),
    },
  };

  const fahProgress: UserProgress = {
    userId: ACCOUNT_IDS.fah,
    xp: 100,
    streakDays: 2,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.salesforceCase]: {
        lessonId: LESSON_IDS.salesforceCase,
        status: 'completed',
        currentStepIndex: 0,
        stepAnswers: [],
        quizAttempts: [
          {
            attemptedAt: PAST_TIMESTAMP,
            questionIds: ['q-sf-1', 'q-sf-2', 'q-sf-3', 'q-sf-4', 'q-sf-5'],
            answers: {},
            score: 0.4,
            passed: false,
          },
          {
            attemptedAt: PAST_TIMESTAMP,
            questionIds: ['q-sf-1', 'q-sf-2', 'q-sf-3', 'q-sf-4', 'q-sf-5'],
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

  const gapProgress: UserProgress = {
    userId: ACCOUNT_IDS.gap,
    xp: 480,
    streakDays: 12,
    lastActiveAt: PAST_TIMESTAMP,
    lessons: {
      [LESSON_IDS.liveChat]: completedLessonProgress(LESSON_IDS.liveChat, [
        'q-chat-1',
        'q-chat-2',
        'q-chat-3',
        'q-chat-4',
      ]),
      [LESSON_IDS.wmaAdvanced]: completedLessonProgress(LESSON_IDS.wmaAdvanced, [
        'q-wmaadv-1',
        'q-wmaadv-2',
        'q-wmaadv-3',
      ]),
      [LESSON_IDS.posBasics]: completedLessonProgress(LESSON_IDS.posBasics, [
        'q-pos-1',
        'q-pos-2',
        'q-pos-3',
        'q-pos-4',
      ]),
      [LESSON_IDS.hardwareBasics]: inProgressLessonProgress(LESSON_IDS.hardwareBasics, 2),
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
