import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Quiz, QuizInput, QuizQuestion } from '../types/quiz';
import type { StepType } from '../types/step';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { AppShell } from '../components/layout/AppShell';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';
import { Button } from '../components/common/Button';
import { StepEditor, createDefaultStep } from '../components/dashboard/StepEditor';
import { AddBlockPalette } from '../components/dashboard/AddBlockPalette';
import { TagInput } from '../components/dashboard/TagInput';
import { Icon } from '../components/common/Icon';
import { useDragReorder } from '../hooks/useDragReorder';

const QUIZ_QUESTION_TYPES: StepType[] = [
  'single-choice',
  'multi-choice',
  'free-text',
  'salesforce-mock-timed',
  'live-chat-mock',
  'phone-call-mock',
];

function emptyQuizInput(initialLessonTags: string[]): QuizInput {
  return {
    title: '',
    tags: initialLessonTags,
    questions: [createDefaultStep('single-choice', 1)],
    isHidden: false,
  };
}

export function QuizEditorPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const account = useCurrentUser();

  const quizzes = useAppStore((s) => s.quizzes);
  const lessons = useAppStore((s) => s.lessons);
  const addQuiz = useAppStore((s) => s.addQuiz);
  const updateQuiz = useAppStore((s) => s.updateQuiz);

  const quiz: Quiz | null = quizId ? quizzes.find((q) => q.id === quizId) ?? null : null;
  const initialLessonId = searchParams.get('lessonId');
  const initialLesson = lessons.find((l) => l.id === initialLessonId);

  const [form, setForm] = useState<QuizInput>(
    quiz
      ? {
          title: quiz.title,
          tags: quiz.tags,
          questions: quiz.questions,
          isHidden: quiz.isHidden,
        }
      : emptyQuizInput(initialLesson?.tags ?? []),
  );

  if (!account || account.role !== 'admin') return <Navigate to="/" replace />;
  if (quizId && !quiz) return <Navigate to="/admin/quizzes" replace />;

  const matchingLessons = lessons.filter((l) => l.tags.some((tag) => form.tags.includes(tag)));

  function updateQuestion(index: number, next: QuizQuestion) {
    setForm((f) => ({ ...f, questions: f.questions.map((q, i) => (i === index ? next : q)) }));
  }

  function removeQuestion(index: number) {
    setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== index) }));
  }

  function addQuestion(type: StepType) {
    setForm((f) => ({
      ...f,
      questions: [...f.questions, createDefaultStep(type, f.questions.length + 1)],
    }));
  }

  function moveQuestion(index: number, dir: -1 | 1) {
    setForm((f) => {
      const next = [...f.questions];
      const target = index + dir;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, questions: next.map((q, i) => ({ ...q, order: i + 1 })) };
    });
  }

  function reorderQuestions(next: QuizQuestion[]) {
    setForm((f) => ({ ...f, questions: next.map((q, i) => ({ ...q, order: i + 1 })) }));
  }

  const { dragHandleProps, dropZoneProps } = useDragReorder(form.questions, reorderQuestions);

  function handleSave() {
    if (!form.title.trim()) {
      alert('กรุณากรอกชื่อแบบทดสอบ');
      return;
    }
    if (form.tags.length === 0) {
      alert('กรุณาเพิ่มอย่างน้อย 1 แท็กเพื่อให้แบบทดสอบนี้จับคู่กับบทเรียนได้');
      return;
    }
    if (quiz) {
      updateQuiz(quiz.id, form);
    } else {
      addQuiz(form);
    }
    navigate('/admin/quizzes');
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <PageBreadcrumb
          items={[
            { label: 'คลังแบบทดสอบ', to: '/admin/quizzes' },
            { label: quiz ? 'แก้ไขแบบทดสอบ' : 'สร้างแบบทดสอบใหม่' },
          ]}
        />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-xl font-bold text-on-surface">
            {quiz ? 'แก้ไขแบบทดสอบ' : 'สร้างแบบทดสอบใหม่'}
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/admin/quizzes')}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>บันทึกแบบทดสอบ</Button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-surface-variant bg-surface-white p-6">
            <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
              ข้อมูลทั่วไป
            </h2>
            <label className="mb-1 block text-xs font-semibold text-secondary">ชื่อแบบทดสอบ</label>
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="เช่น ทบทวนรวม: น้ำเสียง + เคสร้องเรียนออเดอร์"
            />
          </section>

          <section className="rounded-xl border border-surface-variant bg-surface-white p-6">
            <h2 className="mb-1 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
              แท็ก (ปรากฏหลังบทเรียนที่มีแท็กเดียวกัน)
            </h2>
            <p className="mb-3 text-xs text-secondary">
              ใส่ได้มากกว่า 1 แท็ก — แบบทดสอบที่จับคู่ได้กับหลายบทเรียนพร้อมกันจะถูกจัดเป็นคำถามยาก/รวมความรู้หลายบทเรียนโดยอัตโนมัติ
            </p>
            <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
            <div className="mt-3">
              <p className="mb-1.5 font-mono text-xs font-semibold text-secondary">บทเรียนที่จับคู่ได้ตอนนี้</p>
              {matchingLessons.length === 0 ? (
                <p className="text-xs text-secondary">ยังไม่มีบทเรียนที่มีแท็กตรงกัน</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {matchingLessons.map((l) => (
                    <span
                      key={l.id}
                      className="rounded-full border border-outline-variant px-2 py-1 text-xs text-on-surface-variant"
                    >
                      {l.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-surface-variant bg-surface-white p-6">
            <h2 className="mb-1 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
              คำถาม ({form.questions.length})
            </h2>
            <p className="mb-3 flex items-center gap-1 text-xs text-secondary">
              ลากไอคอน <Icon name="drag_indicator" className="text-[14px]" /> เพื่อจัดลำดับคำถาม
            </p>
            <div className="space-y-4">
              {form.questions.map((question, index) => (
                <StepEditor
                  key={question.id}
                  step={question}
                  onChange={(next) => updateQuestion(index, next)}
                  onRemove={() => removeQuestion(index)}
                  onMoveUp={() => moveQuestion(index, -1)}
                  onMoveDown={() => moveQuestion(index, 1)}
                  canRemove={form.questions.length > 1}
                  allowedTypes={QUIZ_QUESTION_TYPES}
                  dragHandleProps={dragHandleProps(index)}
                  dropZoneProps={dropZoneProps(index)}
                />
              ))}
            </div>
            <div className="mt-4 border-t border-surface-variant pt-4">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                เพิ่มคำถามใหม่
              </p>
              <AddBlockPalette allowedTypes={QUIZ_QUESTION_TYPES} onAdd={addQuestion} />
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate('/admin/quizzes')}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave}>บันทึกแบบทดสอบ</Button>
        </div>
      </div>
    </AppShell>
  );
}
