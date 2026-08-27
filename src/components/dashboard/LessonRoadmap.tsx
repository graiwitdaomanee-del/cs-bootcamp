import { useNavigate } from 'react-router-dom';
import type { Lesson } from '../../types/lesson';
import type { UserProgress } from '../../types/progress';
import { getLessonStatus } from '../../utils/lessonAccess';
import { LessonCard } from './LessonCard';

export function LessonRoadmap({
  lessons,
  userProgress,
}: {
  lessons: Lesson[];
  userProgress: UserProgress;
}) {
  const navigate = useNavigate();
  const visibleLessons = lessons.filter((l) => !l.isHidden).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      {visibleLessons.map((lesson) => {
        const status = getLessonStatus(lesson, userProgress);
        return (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            status={status}
            onClick={() => navigate(`/lesson/${lesson.id}`)}
          />
        );
      })}
    </div>
  );
}
