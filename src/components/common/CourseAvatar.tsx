import type { Course } from '../../types/course';

export function CourseAvatar({ course, className }: { course: Course; className?: string }) {
  if (course.logoUrl) {
    return (
      <img
        src={course.logoUrl}
        alt={course.title}
        className={className ?? 'h-10 w-10 rounded-lg object-cover'}
      />
    );
  }
  return <span className={className ?? 'text-3xl'}>{course.icon}</span>;
}
