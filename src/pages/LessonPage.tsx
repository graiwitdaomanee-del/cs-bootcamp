import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getLessonStatus } from '../utils/lessonAccess';
import { LessonLayout } from '../components/lesson/LessonLayout';
import { LessonBreadcrumb } from '../components/lesson/LessonBreadcrumb';
import { LessonStepContent } from '../components/lesson/LessonStepContent';
import { LessonSidePanel } from '../components/lesson/LessonSidePanel';
import { AnswerPanel } from '../components/lesson/AnswerPanel';
import { QuizGate } from '../components/lesson/QuizGate';
import { LessonCompleteModal } from '../components/lesson/LessonCompleteModal';
import { StepReviewPanel } from '../components/lesson/StepReviewPanel';
import { ContentBlocks } from '../components/lesson/ContentBlocks';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';

type Stage = 'steps' | 'quiz' | 'complete' | 'review';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const account = useCurrentUser();

  const lessons = useAppStore((s) => s.lessons);
  const courses = useAppStore((s) => s.courses);
  const knowledgeHubEntries = useAppStore((s) => s.knowledgeHubEntries);
  const progressByUser = useAppStore((s) => s.progress);
  const startLesson = useAppStore((s) => s.startLesson);
  const submitStepAnswer = useAppStore((s) => s.submitStepAnswer);

  const lesson = lessons.find((l) => l.id === lessonId) ?? null;
  const userProgress = account ? progressByUser[account.id] : undefined;

  const [stage, setStage] = useState<Stage>('steps');
  const [stepIndex, setStepIndex] = useState(0);
  const [reviewStepIndex, setReviewStepIndex] = useState(0);
  const initializedForLessonRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lesson || !account || !userProgress) return;
    if (initializedForLessonRef.current === lesson.id) return;
    initializedForLessonRef.current = lesson.id;

    const status = getLessonStatus(lesson, userProgress);
    if (status === 'available') {
      startLesson(account.id, lesson.id);
    }
    if (status === 'completed') {
      setStage('review');
      setReviewStepIndex(0);
    } else {
      const lp = userProgress.lessons[lesson.id];
      const resumeIndex = Math.min(lp?.currentStepIndex ?? 0, lesson.steps.length);
      setStepIndex(resumeIndex);
      setStage(resumeIndex >= lesson.steps.length ? 'quiz' : 'steps');
    }
  }, [lesson, account, userProgress, startLesson]);

  if (!account) {
    return <Navigate to="/" replace />;
  }
  if (!lesson || (lesson.isHidden && account.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }
  if (!userProgress) return null;

  const status = getLessonStatus(lesson, userProgress);
  if (status === 'locked') {
    return <Navigate to="/" replace />;
  }

  const lessonProgress = userProgress.lessons[lesson.id];
  const answeredIndices = new Set(
    (lessonProgress?.stepAnswers ?? [])
      .map((a) => lesson.steps.findIndex((s) => s.id === a.stepId))
      .filter((i) => i >= 0),
  );

  const sortedVisibleLessons = [...lessons].filter((l) => !l.isHidden).sort((a, b) => a.order - b.order);
  const nextLesson =
    sortedVisibleLessons.find((l) => l.order > lesson.order && l.courseId === lesson.courseId && !l.isPlaceholder) ??
    null;
  const unlockedEntriesForThisLesson = knowledgeHubEntries.filter(
    (e) => e.unlockedByLessonId === lesson.id,
  );

  function handleStepComplete(answer: string | string[]) {
    const currentStep = lesson!.steps[stepIndex];
    submitStepAnswer(account!.id, lesson!.id, currentStep.id, answer);
    const nextIndex = stepIndex + 1;
    if (nextIndex >= lesson!.steps.length) {
      setStage('quiz');
    } else {
      setStepIndex(nextIndex);
    }
  }

  function handleQuizPass() {
    setStage('complete');
  }

  function handleRetakeQuiz() {
    setStage('quiz');
  }

  const lessonCourse = courses.find((c) => c.id === lesson.courseId);

  return (
    <AppShell>
      <PageBreadcrumb
        items={[
          ...(lessonCourse ? [{ label: lessonCourse.title, to: `/course/${lessonCourse.id}` }] : []),
          { label: lesson.title },
        ]}
      />
      {stage === 'complete' ? (
        <LessonCompleteModal
          lesson={lesson}
          unlockedEntries={unlockedEntriesForThisLesson}
          nextLesson={nextLesson}
          onGoToDashboard={() => navigate(`/course/${lesson.courseId}`)}
          onGoToNext={() => (nextLesson ? navigate(`/lesson/${nextLesson.id}`) : navigate(`/course/${lesson.courseId}`))}
        />
      ) : stage === 'quiz' ? (
        <QuizGate lesson={lesson} userId={account.id} onPass={handleQuizPass} />
      ) : stage === 'review' ? (
        <LessonLayout
          topLeft={
            <div className="space-y-4">
              <LessonBreadcrumb
                totalSteps={lesson.steps.length}
                currentIndex={reviewStepIndex}
                answeredIndices={answeredIndices}
                onStepClick={setReviewStepIndex}
              />
              <ContentBlocks blocks={lesson.descriptionBlocks} />
              <LessonStepContent step={lesson.steps[reviewStepIndex]} />
            </div>
          }
          bottomLeft={<LessonSidePanel userProgress={userProgress} step={lesson.steps[reviewStepIndex]} />}
          right={
            <StepReviewPanel
              step={lesson.steps[reviewStepIndex]}
              answerRecord={lessonProgress?.stepAnswers.find(
                (a) => a.stepId === lesson.steps[reviewStepIndex].id,
              )}
              canPrev={reviewStepIndex > 0}
              canNext={reviewStepIndex < lesson.steps.length - 1}
              onPrev={() => setReviewStepIndex((i) => Math.max(0, i - 1))}
              onNext={() => setReviewStepIndex((i) => Math.min(lesson.steps.length - 1, i + 1))}
              onRetakeQuiz={handleRetakeQuiz}
            />
          }
        />
      ) : (
        <LessonLayout
          topLeft={
            <div className="space-y-4">
              <LessonBreadcrumb
                totalSteps={lesson.steps.length}
                currentIndex={stepIndex}
                answeredIndices={answeredIndices}
              />
              <ContentBlocks blocks={lesson.descriptionBlocks} />
              <LessonStepContent step={lesson.steps[stepIndex]} />
            </div>
          }
          bottomLeft={<LessonSidePanel userProgress={userProgress} step={lesson.steps[stepIndex]} />}
          right={
            <AnswerPanel
              key={lesson.steps[stepIndex].id}
              step={lesson.steps[stepIndex]}
              onComplete={handleStepComplete}
            />
          }
        />
      )}
    </AppShell>
  );
}
