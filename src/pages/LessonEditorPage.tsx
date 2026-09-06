import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Lesson, LessonInput, LessonDifficulty } from '../types/lesson';
import type { LessonStep, StepType } from '../types/step';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/common/Button';
import { BlockEditor } from '../components/dashboard/BlockEditor';
import { StepEditor, createDefaultStep } from '../components/dashboard/StepEditor';
import { AddBlockPalette } from '../components/dashboard/AddBlockPalette';
import { TagInput } from '../components/dashboard/TagInput';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';
import { EditorIssuesPanel } from '../components/dashboard/EditorIssuesPanel';
import { useDragReorder } from '../hooks/useDragReorder';
import { getStepIssues } from '../utils/stepValidation';

const DIFFICULTY_LABELS: Record<LessonDifficulty, string> = {
  easy: 'ง่าย',
  medium: 'ปานกลาง',
  hard: 'ยาก',
};

function emptyLessonInput(order: number, courseId: string): LessonInput {
  return {
    courseId,
    order,
    title: '',
    slug: '',
    summary: '',
    descriptionBlocks: [],
    tags: [],
    difficulty: 'easy',
    isHidden: false,
    isPlaceholder: false,
    prerequisiteLessonId: null,
    steps: [createDefaultStep('info', 1)],
    quizConfig: { questionCount: 5 },
    xpReward: 100,
    estimatedMinutes: 10,
  };
}

export function LessonEditorPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const account = useCurrentUser();

  const allLessons = useAppStore((s) => s.lessons);
  const courses = useAppStore((s) => s.courses);
  const addLesson = useAppStore((s) => s.addLesson);
  const updateLesson = useAppStore((s) => s.updateLesson);

  const lesson: Lesson | null = lessonId ? allLessons.find((l) => l.id === lessonId) ?? null : null;
  const initialCourseId = searchParams.get('courseId');

  const [form, setForm] = useState<LessonInput>(
    lesson
      ? {
          courseId: lesson.courseId,
          order: lesson.order,
          title: lesson.title,
          slug: lesson.slug,
          summary: lesson.summary,
          descriptionBlocks: lesson.descriptionBlocks,
          tags: lesson.tags,
          difficulty: lesson.difficulty,
          isHidden: lesson.isHidden,
          isPlaceholder: lesson.isPlaceholder,
          prerequisiteLessonId: lesson.prerequisiteLessonId,
          steps: lesson.steps,
          quizConfig: lesson.quizConfig,
          xpReward: lesson.xpReward,
          estimatedMinutes: lesson.estimatedMinutes,
        }
      : emptyLessonInput(allLessons.length + 1, initialCourseId ?? courses[0]?.id ?? ''),
  );
  const [saveErrors, setSaveErrors] = useState<string[]>([]);

  const { dragHandleProps, dropZoneProps } = useDragReorder(form.steps, (next: LessonStep[]) =>
    setForm((f) => ({ ...f, steps: next.map((s, i) => ({ ...s, order: i + 1 })) })),
  );

  if (!account || account.role !== 'admin') return <Navigate to="/" replace />;
  if (lessonId && !lesson) return <Navigate to="/" replace />;

  function updateStep(index: number, next: LessonStep) {
    setForm((f) => ({ ...f, steps: f.steps.map((s, i) => (i === index ? next : s)) }));
  }

  function removeStep(index: number) {
    setForm((f) => ({ ...f, steps: f.steps.filter((_, i) => i !== index) }));
  }

  function addStep(type: StepType) {
    setForm((f) => ({ ...f, steps: [...f.steps, createDefaultStep(type, f.steps.length + 1)] }));
  }

  function moveStep(index: number, dir: -1 | 1) {
    setForm((f) => {
      const next = [...f.steps];
      const target = index + dir;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, steps: next.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  }

  function handleSave() {
    const errs: string[] = [];
    if (!form.title.trim()) errs.push('ยังไม่ได้กรอกชื่อบทเรียน');
    if (!form.courseId) errs.push('ยังไม่ได้เลือกคอร์ส');
    form.steps.forEach((step, i) => {
      getStepIssues(step).forEach((issue) => errs.push(`ขั้นตอนที่ ${i + 1}: ${issue}`));
    });
    if (errs.length > 0) {
      setSaveErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaveErrors([]);
    const slug = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleaned: LessonInput = { ...form, slug };
    if (lesson) {
      updateLesson(lesson.id, cleaned);
    } else {
      addLesson(cleaned);
    }
    navigate(`/admin/courses/${cleaned.courseId}`);
  }

  const otherLessons = allLessons.filter((l) => l.id !== lesson?.id);
  const activeCourse = courses.find((c) => c.id === form.courseId);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <PageBreadcrumb
          items={[
            ...(activeCourse ? [{ label: activeCourse.title, to: `/admin/courses/${activeCourse.id}` }] : []),
            { label: lesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่' },
          ]}
        />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-xl font-bold text-on-surface">
            {lesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่'}
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate(`/admin/courses/${form.courseId}`)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>บันทึกบทเรียน</Button>
          </div>
        </div>

        <EditorIssuesPanel
          errors={saveErrors}
          onDismiss={() => setSaveErrors([])}
          className="mb-6"
        />

        <div className="space-y-6">
          <section className="rounded-xl border border-surface-variant bg-surface-white p-6">
            <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
              ข้อมูลทั่วไป
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary">คอร์ส</label>
                <select
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary">ระดับความยาก</label>
                <select
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value as LessonDifficulty })}
                >
                  {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-secondary">ชื่อบทเรียน</label>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-secondary">สรุปย่อ</label>
                <input
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-secondary">
                  แท็ก (ใช้จับคู่กับแบบทดสอบที่มีแท็กเดียวกัน)
                </label>
                <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary">ลำดับ</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary">XP ที่ได้รับ</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.xpReward}
                  onChange={(e) => setForm({ ...form, xpReward: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary">เวลาโดยประมาณ (นาที)</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.estimatedMinutes}
                  onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary">บทเรียนที่ต้องเรียนจบก่อน</label>
                <select
                  className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
                  value={form.prerequisiteLessonId ?? ''}
                  onChange={(e) => setForm({ ...form, prerequisiteLessonId: e.target.value || null })}
                >
                  <option value="">ไม่มี</option>
                  {otherLessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-6">
              <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={form.isHidden}
                  onChange={(e) => setForm({ ...form, isHidden: e.target.checked })}
                />
                ซ่อนจากพนักงาน Training
              </label>
              <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={form.isPlaceholder}
                  onChange={(e) => setForm({ ...form, isPlaceholder: e.target.checked })}
                />
                เป็นเนื้อหาตัวอย่าง (กำลังจัดทำ)
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-surface-variant bg-surface-white p-6">
            <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
              รายละเอียดบทเรียน
            </h2>
            <p className="mb-3 text-xs text-secondary">
              แทรกข้อความ รูปภาพ หรือวิดีโอได้ทุกตำแหน่งตามลำดับที่ต้องการ
            </p>
            <BlockEditor
              blocks={form.descriptionBlocks}
              onChange={(descriptionBlocks) => setForm({ ...form, descriptionBlocks })}
            />
          </section>

          <section className="rounded-xl border border-surface-variant bg-surface-white p-6">
            <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
              เงื่อนไขแบบทดสอบท้ายบท
            </h2>
            <div className="mb-3 flex items-center gap-2">
              <label className="text-xs text-secondary">จำนวนคำถาม</label>
              <input
                type="number"
                className="w-20 rounded-lg border border-outline-variant bg-surface-white px-2 py-1 text-sm text-on-surface"
                value={form.quizConfig.questionCount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quizConfig: { ...form.quizConfig, questionCount: Number(e.target.value) },
                  })
                }
              />
            </div>
            <p className="text-xs text-secondary">
              ตัวคำถามที่จะสุ่มใช้มาจากแบบทดสอบ (Quiz) ที่ถูกกำหนดให้ปรากฏหลังบทเรียนนี้ —{' '}
              {lesson ? (
                <Link to={`/admin/quizzes?lessonId=${lesson.id}`} className="text-success-green hover:underline">
                  จัดการแบบทดสอบที่ปรากฏหลังบทเรียนนี้
                </Link>
              ) : (
                'บันทึกบทเรียนนี้ก่อน แล้วไปกำหนดแบบทดสอบได้ที่หน้าคลังแบบทดสอบ'
              )}
            </p>
          </section>

          <section className="rounded-xl border border-surface-variant bg-surface-white p-6">
            <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
              ขั้นตอนบทเรียน ({form.steps.length})
            </h2>
            <div className="space-y-4">
              {form.steps.map((step, index) => (
                <StepEditor
                  key={step.id}
                  step={step}
                  onChange={(next) => updateStep(index, next)}
                  onRemove={() => removeStep(index)}
                  onMoveUp={() => moveStep(index, -1)}
                  onMoveDown={() => moveStep(index, 1)}
                  canRemove={form.steps.length > 1}
                  dragHandleProps={dragHandleProps(index)}
                  dropZoneProps={dropZoneProps(index)}
                />
              ))}
            </div>
            <div className="mt-4 border-t border-surface-variant pt-4">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                เพิ่มขั้นตอนใหม่
              </p>
              <AddBlockPalette onAdd={addStep} />
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => navigate(`/admin/courses/${form.courseId}`)}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave}>บันทึกบทเรียน</Button>
        </div>
      </div>
    </AppShell>
  );
}
