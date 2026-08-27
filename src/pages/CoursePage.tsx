import { Navigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { useAppStore } from '../store/useAppStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { LessonRoadmap } from '../components/dashboard/LessonRoadmap';
import { PageBreadcrumb } from '../components/common/PageBreadcrumb';
import { CourseAvatar } from '../components/common/CourseAvatar';

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const account = useCurrentUser();
  const courses = useAppStore((s) => s.courses);
  const lessons = useAppStore((s) => s.lessons);
  const progressByUser = useAppStore((s) => s.progress);

  const course = courses.find((c) => c.id === courseId) ?? null;
  const userProgress = account ? progressByUser[account.id] : undefined;

  if (!account || !userProgress) return <Navigate to="/login" replace />;
  if (!course || course.status === 'wip') return <Navigate to="/" replace />;

  const courseLessons = lessons.filter((l) => l.courseId === course.id);

  return (
    <AppShell>
      <PageBreadcrumb items={[{ label: course.title }]} />
      <div className="mb-6 flex items-center gap-3">
        <CourseAvatar course={course} />
        <div>
          <h1 className="font-display text-xl font-bold text-on-surface">{course.title}</h1>
          <p className="font-sans text-sm text-secondary">{course.description}</p>
        </div>
      </div>
      <LessonRoadmap lessons={courseLessons} userProgress={userProgress} />
    </AppShell>
  );
}
