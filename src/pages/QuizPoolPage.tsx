import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/dashboard/ConfirmDialog';
import { Icon } from '../components/common/Icon';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import type { Quiz } from '../types/quiz';

export function QuizPoolPage() {
  const account = useCurrentUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const quizzes = useAppStore((s) => s.quizzes);
  const lessons = useAppStore((s) => s.lessons);
  const deleteQuiz = useAppStore((s) => s.deleteQuiz);
  const toggleHideQuiz = useAppStore((s) => s.toggleHideQuiz);

  const [deletingQuiz, setDeletingQuiz] = useState<Quiz | null>(null);

  if (!account || account.role !== 'admin') return <Navigate to="/" replace />;

  const filterLessonId = searchParams.get('lessonId');
  const filterLesson = lessons.find((l) => l.id === filterLessonId);

  const visibleQuizzes = filterLesson
    ? quizzes.filter((q) => q.tags.some((tag) => filterLesson.tags.includes(tag)))
    : quizzes;
  const sortedQuizzes = [...visibleQuizzes].sort((a, b) => a.title.localeCompare(b.title));

  function matchingLessonsFor(quiz: Quiz) {
    return lessons.filter((l) => l.tags.some((tag) => quiz.tags.includes(tag)));
  }

  return (
    <AppShell>
      <PageBreadcrumb items={[{ label: 'คลังแบบทดสอบ' }]} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-xl font-bold text-on-surface">
            <Icon name="quiz" filled className="text-success-green text-2xl" /> คลังแบบทดสอบ (Quiz Pool)
          </h1>
          <p className="mt-1 text-sm text-secondary">
            แบบทดสอบทั้งหมดที่หมุนเวียนอยู่ในระบบ — เลือกได้ว่าจะให้ปรากฏหลังบทเรียนใดบ้าง
          </p>
        </div>
        <Button
          onClick={() =>
            navigate(filterLessonId ? `/admin/quizzes/new?lessonId=${filterLessonId}` : '/admin/quizzes/new')
          }
        >
          + สร้างแบบทดสอบใหม่
        </Button>
      </div>

      {filterLesson && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success-green/20 bg-success-green/5 px-3 py-2 text-sm text-success-green">
          กำลังกรองเฉพาะแบบทดสอบที่ปรากฏหลังบทเรียน "{filterLesson.title}"
          <button className="ml-auto text-xs underline" onClick={() => setSearchParams({})}>
            ล้างตัวกรอง
          </button>
        </div>
      )}

      {sortedQuizzes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-outline-variant bg-surface-white p-6 text-sm text-secondary">
          ยังไม่มีแบบทดสอบ{filterLesson ? 'สำหรับบทเรียนนี้' : ''}
        </p>
      ) : (
        <div className="space-y-2">
          {sortedQuizzes.map((quiz) => (
            <div key={quiz.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-surface-variant bg-surface-white p-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-on-surface">{quiz.title}</h3>
                  {quiz.isHidden && <Badge tone="warning">ซ่อนอยู่</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {quiz.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-success-green/10 px-2 py-0.5 font-mono text-[11px] text-success-green"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="mt-1 font-mono text-xs text-secondary">
                  {quiz.questions.length} คำถาม ·{' '}
                  {(() => {
                    const matching = matchingLessonsFor(quiz);
                    if (matching.length === 0) return 'ยังไม่มีบทเรียนที่จับคู่ได้';
                    if (matching.length > 1) return `ใช้กับ ${matching.length} บทเรียน (คำถามยาก)`;
                    return `ใช้กับ: ${matching[0].title}`;
                  })()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="text-xs" onClick={() => navigate(`/admin/quizzes/${quiz.id}/preview`)}>
                  ทดสอบ/พรีวิว
                </Button>
                <Button variant="secondary" className="text-xs" onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}>
                  แก้ไข
                </Button>
                <Button variant="secondary" className="text-xs" onClick={() => toggleHideQuiz(quiz.id)}>
                  {quiz.isHidden ? 'เลิกซ่อน' : 'ซ่อน'}
                </Button>
                <Button variant="danger" className="text-xs" onClick={() => setDeletingQuiz(quiz)}>
                  ลบ
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingQuiz && (
        <ConfirmDialog
          title="ลบแบบทดสอบนี้หรือไม่?"
          message={`การลบ "${deletingQuiz.title}" จะเป็นการลบถาวรและไม่สามารถย้อนกลับได้`}
          confirmLabel="ลบ"
          danger
          onConfirm={() => {
            deleteQuiz(deletingQuiz.id);
            setDeletingQuiz(null);
          }}
          onCancel={() => setDeletingQuiz(null)}
        />
      )}
    </AppShell>
  );
}
