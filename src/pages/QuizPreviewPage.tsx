import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { RuntimeQuizQuestion } from '../types/quiz';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { AppShell } from '../components/layout/AppShell';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Icon } from '../components/common/Icon';
import { QuizRunner } from '../components/lesson/QuizRunner';

export function QuizPreviewPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const account = useCurrentUser();

  const quizzes = useAppStore((s) => s.quizzes);
  const allLessons = useAppStore((s) => s.lessons);
  const userProgress = useAppStore((s) => (account ? s.progress[account.id] : undefined));

  const [runKey, setRunKey] = useState(0);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  if (!account || account.role !== 'admin') return <Navigate to="/" replace />;

  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz || !userProgress) return <Navigate to="/admin/quizzes" replace />;

  const matchingLessonIds = allLessons
    .filter((l) => l.tags.some((tag) => quiz.tags.includes(tag)))
    .map((l) => l.id);
  const previewQuestions: RuntimeQuizQuestion[] = quiz.questions.map((q) => ({
    ...q,
    sourceLessonIds: matchingLessonIds,
  }));

  return (
    <AppShell>
      <PageBreadcrumb
        items={[{ label: 'คลังแบบทดสอบ', to: '/admin/quizzes' }, { label: `พรีวิว: ${quiz.title}` }]}
      />

      {!result && (
        <>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-success-green/20 bg-success-green/5 px-3 py-2 text-sm text-success-green">
            <Icon name="visibility" className="text-[18px]" /> โหมดพรีวิวสำหรับผู้ดูแลระบบ — คำตอบจะไม่ถูกบันทึกลงในความคืบหน้าจริง
          </div>
          <QuizRunner
            key={runKey}
            questions={previewQuestions}
            userProgress={userProgress}
            onComplete={({ score, passed }) => setResult({ score, passed })}
          />
        </>
      )}

      {result && (
        <div className="mx-auto max-w-3xl space-y-4">
          <div
            className={`space-y-3 rounded-xl border p-5 ${
              result.passed ? 'border-success-green/20 bg-success-green/10' : 'border-error/20 bg-error-container'
            }`}
          >
            <div className="flex items-center gap-3">
              <Badge tone={result.passed ? 'success' : 'danger'}>คะแนน {Math.round(result.score * 100)}%</Badge>
              <span className="text-sm font-semibold text-on-surface">
                {result.passed ? 'ผ่าน (พรีวิว)' : 'ไม่ผ่าน (พรีวิว)'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setResult(null);
                  setRunKey((k) => k + 1);
                }}
              >
                ลองใหม่
              </Button>
              <Button onClick={() => navigate('/admin/quizzes')}>กลับไปคลังแบบทดสอบ</Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
