import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/course';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CourseAvatar } from '../common/CourseAvatar';
import { Icon } from '../common/Icon';
import { CourseEditorDialog } from './CourseEditorDialog';
import { TraineeProgressTable } from './TraineeProgressTable';

export function AdminDashboard() {
  const navigate = useNavigate();
  const courses = useAppStore((s) => s.courses);
  const lessons = useAppStore((s) => s.lessons);
  const addCourse = useAppStore((s) => s.addCourse);
  const updateCourse = useAppStore((s) => s.updateCourse);

  const [editingCourse, setEditingCourse] = useState<Course | 'new' | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  function handleDrop(targetIndex: number) {
    const fromIndex = dragIndexRef.current;
    dragIndexRef.current = null;
    if (fromIndex === null || fromIndex === targetIndex) return;
    const a = sortedCourses[fromIndex];
    const b = sortedCourses[targetIndex];
    updateCourse(a.id, { order: b.order });
    updateCourse(b.id, { order: a.order });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-on-surface">Dashboard ผู้ดูแลระบบ Training CS</h1>
          <p className="mt-1 font-sans text-sm text-secondary">
            เลือกหรือสร้างคอร์สก่อน แล้วจึงจัดการบทเรียนภายในคอร์สนั้น — ลากการ์ดเพื่อจัดลำดับคอร์ส
          </p>
        </div>
        <Button onClick={() => setEditingCourse('new')}>+ สร้างคอร์สใหม่</Button>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCourses.map((course, index) => {
          const courseLessons = lessons.filter((l) => l.courseId === course.id);
          return (
            <div
              key={course.id}
              draggable
              onDragStart={() => (dragIndexRef.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="cursor-grab rounded-xl border border-surface-variant bg-surface-white p-5 shadow-ambient transition-colors hover:border-success-green/50 active:cursor-grabbing"
            >
              <div className="mb-2 flex items-start justify-between">
                <CourseAvatar course={course} />
                <div className="flex items-center gap-1.5">
                  <span title="ลากเพื่อจัดลำดับ">
                    <Icon name="drag_indicator" className="text-outline-variant" />
                  </span>
                  {course.status === 'wip' && <Badge tone="neutral">กำลังจัดทำ</Badge>}
                </div>
              </div>
              <h2 className="font-display font-semibold text-on-surface">{course.title}</h2>
              <p className="mt-1 font-sans text-sm text-secondary">{course.description}</p>
              <p className="mt-2 font-mono text-xs text-secondary">{courseLessons.length} บทเรียน</p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="primary"
                  className="flex-1 text-xs"
                  onClick={() => navigate(`/admin/courses/${course.id}`)}
                >
                  จัดการบทเรียน
                </Button>
                <Button variant="secondary" className="text-xs" onClick={() => setEditingCourse(course)}>
                  แก้ไขคอร์ส
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-secondary">
        ความคืบหน้าของพนักงาน Training
      </h2>
      <TraineeProgressTable />

      {editingCourse && (
        <CourseEditorDialog
          course={editingCourse === 'new' ? null : editingCourse}
          nextOrder={courses.length + 1}
          onSave={(input) => {
            if (editingCourse === 'new') {
              addCourse(input);
            } else {
              updateCourse(editingCourse.id, input);
            }
            setEditingCourse(null);
          }}
          onClose={() => setEditingCourse(null)}
        />
      )}
    </div>
  );
}
