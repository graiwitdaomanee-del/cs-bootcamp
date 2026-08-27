import type { Course } from '../../types/course';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { CourseAvatar } from '../common/CourseAvatar';

export function CourseCard({
  course,
  lessonCount,
  completedCount,
  onClick,
}: {
  course: Course;
  lessonCount: number;
  completedCount: number;
  onClick?: () => void;
}) {
  const isWip = course.status === 'wip';
  const ratio = lessonCount > 0 ? completedCount / lessonCount : 0;

  return (
    <button
      onClick={isWip ? undefined : onClick}
      disabled={isWip}
      className={`flex flex-col items-start gap-3 rounded-xl border p-5 text-left shadow-ambient transition-all ${
        isWip
          ? 'cursor-not-allowed border-surface-variant bg-surface-container-low opacity-60'
          : 'border-surface-variant bg-surface-white hover:border-success-green hover:bg-success-green/5'
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <CourseAvatar course={course} />
        {isWip ? (
          <Badge tone="neutral">กำลังจัดทำ</Badge>
        ) : (
          <Badge tone="accent">{course.shortName}</Badge>
        )}
      </div>
      <div>
        <h3 className="font-display font-semibold text-on-surface">{course.title}</h3>
        <p className="mt-1 font-sans text-sm text-secondary">{course.description}</p>
      </div>
      {!isWip && lessonCount > 0 && (
        <div className="w-full">
          <div className="mb-1 flex items-center justify-between font-mono text-xs text-secondary">
            <span>ความคืบหน้า</span>
            <span>
              {completedCount}/{lessonCount} บทเรียน
            </span>
          </div>
          <ProgressBar value={ratio} tone="xp" />
        </div>
      )}
    </button>
  );
}
