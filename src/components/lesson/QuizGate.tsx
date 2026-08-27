import { useState } from 'react';
import type { Lesson } from '../../types/lesson';
import type { RuntimeQuizQuestion } from '../../types/quiz';
import { buildQuizForLesson } from '../../utils/quizPoolBuilder';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';
import { QuizRunner } from './QuizRunner';

const PASS_THRESHOLD = 0.7;

export function QuizGate({
  lesson,
  userId,
  onPass,
}: {
  lesson: Lesson;
  userId: string;
  onPass: () => void;
}) {
  const quizzes = useAppStore((s) => s.quizzes);
  const allLessons = useAppStore((s) => s.lessons);
  const userProgress = useAppStore((s) => s.progress[userId]);
  const submitQuizAttempt = useAppStore((s) => s.submitQuizAttempt);

  const [questions, setQuestions] = useState<RuntimeQuizQuestion[]>(() =>
    buildQuizForLesson(lesson, quizzes, allLessons),
  );
  const [attemptKey, setAttemptKey] = useState(0);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  function handleComplete({
    score,
    passed,
    answers,
  }: {
    score: number;
    passed: boolean;
    answers: Record<string, string | string[]>;
  }) {
    submitQuizAttempt(userId, lesson.id, {
      attemptedAt: new Date().toISOString(),
      questionIds: questions.map((q) => q.id),
      answers,
      score,
      passed,
    });
    setResult({ score, passed });
  }

  function handleRetry() {
    setQuestions(buildQuizForLesson(lesson, quizzes, allLessons));
    setAttemptKey((k) => k + 1);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      {!result && (
        <QuizRunner
          key={attemptKey}
          questions={questions}
          userProgress={userProgress}
          onComplete={handleComplete}
          passThreshold={PASS_THRESHOLD}
        />
      )}

      {result && (
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-xl border border-surface-variant bg-surface-white p-5 shadow-ambient">
            <div className="mb-1 flex items-center gap-2">
              <Icon name="theater_comedy" filled className="text-success-green text-xl" />
              <h2 className="font-display text-lg font-bold text-on-surface">แบบทดสอบสวมบทบาท (Role Play Quiz)</h2>
            </div>
            <p className="font-sans text-sm text-secondary">
              คำถามยากขึ้น ผสมความรู้จากหลายบทเรียนที่คุณเรียนมาจนถึงตอนนี้ ทำคะแนนให้ได้ {Math.round(PASS_THRESHOLD * 100)}%+ เพื่อผ่านบทเรียนนี้
            </p>
          </div>
          <div
            className={`space-y-3 rounded-xl border p-5 shadow-ambient ${
              result.passed ? 'border-success-green/20 bg-success-green/10' : 'border-error/20 bg-error-container'
            }`}
          >
            <div className="flex items-center gap-3">
              <Badge tone={result.passed ? 'success' : 'danger'}>
                คะแนน {Math.round(result.score * 100)}%
              </Badge>
              <span className="font-sans text-sm font-semibold text-on-surface">
                {result.passed
                  ? 'คุณผ่านแล้ว!'
                  : `ต้องได้ ${Math.round(PASS_THRESHOLD * 100)}% ขึ้นไปจึงจะผ่าน — ลองอีกครั้ง`}
              </span>
            </div>
            {result.passed ? (
              <Button onClick={onPass}>
                จบบทเรียน <Icon name="check_circle" filled className="text-[16px]" />
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleRetry}>
                ทำแบบทดสอบใหม่ (คำถามชุดใหม่)
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
