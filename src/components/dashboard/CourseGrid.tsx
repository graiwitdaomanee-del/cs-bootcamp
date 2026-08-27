import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { getLessonStatus } from '../../utils/lessonAccess';
import type { UserProgress } from '../../types/progress';
import { CourseCard } from './CourseCard';

export function CourseGrid({ userProgress }: { userProgress: UserProgress }) {
  const navigate = useNavigate();
  const courses = useAppStore((s) => s.courses);
  const lessons = useAppStore((s) => s.lessons);

  const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedCourses.map((course) => {
        const courseLessons = lessons.filter((l) => l.courseId === course.id && !l.isHidden);
        const completedCount = courseLessons.filter(
          (l) => getLessonStatus(l, userProgress) === 'completed',
        ).length;
        return (
          <CourseCard
            key={course.id}
            course={course}
            lessonCount={courseLessons.length}
            completedCount={completedCount}
            onClick={() => navigate(`/course/${course.id}`)}
          />
        );
      })}
    </div>
  );
}
