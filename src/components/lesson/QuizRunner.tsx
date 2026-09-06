import { useState } from 'react';
import type { RuntimeQuizQuestion } from '../../types/quiz';
import type { UserProgress } from '../../types/progress';
import { scoreQuizAnswers } from '../../utils/quizPoolBuilder';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';
import { LessonLayout } from './LessonLayout';
import { LessonBreadcrumb } from './LessonBreadcrumb';
import { LessonStepContent } from './LessonStepContent';
import { LessonSidePanel } from './LessonSidePanel';
import { AnswerPanel } from './AnswerPanel';

/** Renders a quiz question-by-question using the exact same layout as taking a lesson (incl. Knowledge Hub). */
export function QuizRunner({
  questions,
  userProgress,
  onComplete,
  passThreshold = 0.7,
}: {
  questions: RuntimeQuizQuestion[];
  userProgress: UserProgress;
  onComplete: (result: {
    score: number;
    passed: boolean;
    answers: Record<string, string | string[]>;
  }) => void;
  passThreshold?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const answeredIndices = new Set(
    questions.map((q, i) => (answers[q.id] !== undefined ? i : -1)).filter((i) => i >= 0),
  );

  function handleAnswer(answer: string | string[]) {
    const currentQuestion = questions[currentIndex];
    const nextAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(nextAnswers);

    if (currentIndex + 1 >= questions.length) {
      const score = scoreQuizAnswers(questions, nextAnswers);
      onComplete({ score, passed: score >= passThreshold, answers: nextAnswers });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  const currentQuestion = questions[currentIndex];

  return (
    <LessonLayout
      topLeft={
        <div className="space-y-4">
          <LessonBreadcrumb
            totalSteps={questions.length}
            currentIndex={currentIndex}
            answeredIndices={answeredIndices}
          />
          <p className="font-mono text-xs text-secondary">
            คำถามที่ {currentIndex + 1} จาก {questions.length}
          </p>
          {currentQuestion.sourceLessonIds.length > 1 && (
            <Badge tone="warning">
              <Icon name="shuffle" className="text-[12px]" /> รวมความรู้หลายบทเรียน
            </Badge>
          )}
          <LessonStepContent step={currentQuestion} />
        </div>
      }
      bottomLeft={<LessonSidePanel userProgress={userProgress} step={currentQuestion} />}
      right={<AnswerPanel key={currentQuestion.id} step={currentQuestion} onComplete={handleAnswer} />}
    />
  );
}
