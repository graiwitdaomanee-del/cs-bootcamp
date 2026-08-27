import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Lesson, LessonDifficulty } from '../types/lesson';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { AppShell } from '../components/layout/AppShell';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CourseAvatar } from '../components/common/CourseAvatar';
import { CourseEditorDialog } from '../components/dashboard/CourseEditorDialog';
import { ConfirmDialog } from '../components/dashboard/ConfirmDialog';
import { Icon } from '../components/common/Icon';

const DIFFICULTY_CONFIG: Record<LessonDifficulty, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  easy: { label: 'ง่าย', tone: 'success' },
  medium: { label: 'ปานกลาง', tone: 'warning' },
  hard: { label: 'ยาก', tone: 'danger' },
};

export function AdminCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const account = useCurrentUser();

  const courses = useAppStore((s) => s.courses);
  const lessons = useAppStore((s) => s.lessons);
  const updateCourse = useAppStore((s) => s.updateCourse);
  const deleteCourse = useAppStore((s) => s.deleteCourse);
  const toggleHideLesson = useAppStore((s) => s.toggleHideLesson);
  const deleteLesson = useAppStore((s) => s.deleteLesson);
  const updateLesson = useAppStore((s) => s.updateLesson);

  const [editingCourse, setEditingCourse] = useState(false);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);
  const [deletingCourse, setDeletingCourse] = useState(false);
  const dragIndexRef = useRef<number | null>(null);

  if (!account || account.role !== 'admin') return <Navigate to="/" replace />;

  const course = courses.find((c) => c.id === courseId);
  if (!course) return <Navigate to="/" replace />;

  const courseLessons = [...lessons].filter((l) => l.courseId === course.id).sort((a, b) => a.order - b.order);

  function handleDrop(targetIndex: number) {
    const fromIndex = dragIndexRef.current;
    dragIndexRef.current = null;
    if (fromIndex === null || fromIndex === targetIndex) return;
    const a = courseLessons[fromIndex];
    const b = courseLessons[targetIndex];
    updateLesson(a.id, { order: b.order });
    updateLesson(b.id, { order: a.order });
  }

  return (
    <AppShell>
      <PageBreadcrumb items={[{ label: course.title }]} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CourseAvatar course={course} />
          <div>
            <h1 className="font-display text-xl font-bold text-on-surface">{course.title}</h1>
            <p className="text-sm text-secondary">{course.description}</p>
            {course.status === 'wip' && <Badge tone="neutral">กำลังจัดทำ</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs" onClick={() => setEditingCourse(true)}>
            แก้ไขคอร์ส
          </Button>
          <Button variant="danger" className="text-xs" onClick={() => setDeletingCourse(true)}>
            ลบคอร์ส
          </Button>
          <Button className="text-xs" onClick={() => navigate(`/admin/lessons/new?courseId=${course.id}`)}>
            + เพิ่มบทเรียน
          </Button>
        </div>
      </div>

      {courseLessons.length === 0 ? (
        <p className="rounded-xl border border-dashed border-outline-variant bg-surface-white p-6 text-sm text-secondary">
          ยังไม่มีบทเรียนในคอร์สนี้ — กด "+ เพิ่มบทเรียน" เพื่อเริ่มสร้างบทเรียนแรก
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-secondary">ลากรายการเพื่อจัดลำดับบทเรียน</p>
          {courseLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              draggable
              onDragStart={() => (dragIndexRef.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="flex cursor-grab items-center gap-4 rounded-xl border border-surface-variant bg-surface-white p-4 active:cursor-grabbing"
            >
              <span className="text-outline-variant" title="ลากเพื่อจัดลำดับ">
                <Icon name="drag_indicator" />
              </span>
              <span className="w-6 text-center text-sm font-mono text-secondary">{lesson.order}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-semibold text-on-surface">{lesson.title}</h3>
                  <Badge tone={DIFFICULTY_CONFIG[lesson.difficulty].tone}>
                    {DIFFICULTY_CONFIG[lesson.difficulty].label}
                  </Badge>
                  {lesson.isPlaceholder && <Badge tone="neutral">ตัวอย่าง</Badge>}
                  {lesson.isHidden && <Badge tone="warning">ซ่อนอยู่</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-secondary">{lesson.summary}</p>
                <div className="mt-1 flex items-center gap-1 font-mono text-xs text-secondary">
                  <span>{lesson.steps.length} ขั้นตอน ·</span>
                  <Icon name="bolt" filled className="text-warning-gold text-[14px]" /> {lesson.xpReward} XP ·
                  <Icon name="schedule" className="text-[14px]" /> {lesson.estimatedMinutes} นาที
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="secondary" className="text-xs" onClick={() => navigate(`/lesson/${lesson.id}`)}>
                  ทดสอบ/พรีวิว
                </Button>
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() => navigate(`/admin/lessons/${lesson.id}/edit`)}
                >
                  แก้ไข
                </Button>
                <Button variant="secondary" className="text-xs" onClick={() => toggleHideLesson(lesson.id)}>
                  {lesson.isHidden ? 'เลิกซ่อน' : 'ซ่อน'}
                </Button>
                <Button variant="danger" className="text-xs" onClick={() => setDeletingLesson(lesson)}>
                  ลบ
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCourse && (
        <CourseEditorDialog
          course={course}
          nextOrder={course.order}
          onSave={(input) => {
            updateCourse(course.id, input);
            setEditingCourse(false);
          }}
          onClose={() => setEditingCourse(false)}
        />
      )}

      {deletingLesson && (
        <ConfirmDialog
          title="ลบบทเรียนนี้หรือไม่?"
          message={`การลบ "${deletingLesson.title}" จะเป็นการลบถาวรและไม่สามารถย้อนกลับได้`}
          confirmLabel="ลบ"
          danger
          onConfirm={() => {
            deleteLesson(deletingLesson.id);
            setDeletingLesson(null);
          }}
          onCancel={() => setDeletingLesson(null)}
        />
      )}

      {deletingCourse && (
        <ConfirmDialog
          title="ลบคอร์สนี้หรือไม่?"
          message={`การลบ "${course.title}" จะลบบทเรียนทั้งหมด ${courseLessons.length} บทเรียนในคอร์สนี้ไปด้วย และไม่สามารถย้อนกลับได้`}
          confirmLabel="ลบคอร์ส"
          danger
          onConfirm={() => {
            deleteCourse(course.id);
            navigate('/');
          }}
          onCancel={() => setDeletingCourse(false)}
        />
      )}
    </AppShell>
  );
}
