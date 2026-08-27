import { createHashRouter } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursePage } from './pages/CoursePage';
import { LessonPage } from './pages/LessonPage';
import { LessonEditorPage } from './pages/LessonEditorPage';
import { AdminCourseDetailPage } from './pages/AdminCourseDetailPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { QuizPoolPage } from './pages/QuizPoolPage';
import { QuizEditorPage } from './pages/QuizEditorPage';
import { QuizPreviewPage } from './pages/QuizPreviewPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

export const router = createHashRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/course/:courseId',
    element: (
      <ProtectedRoute>
        <CoursePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lesson/:lessonId',
    element: (
      <ProtectedRoute>
        <LessonPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/knowledge-hub',
    element: (
      <ProtectedRoute>
        <KnowledgeHubPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/courses/:courseId',
    element: (
      <ProtectedRoute>
        <AdminCourseDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/lessons/new',
    element: (
      <ProtectedRoute>
        <LessonEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/lessons/:lessonId/edit',
    element: (
      <ProtectedRoute>
        <LessonEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/quizzes',
    element: (
      <ProtectedRoute>
        <QuizPoolPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/quizzes/new',
    element: (
      <ProtectedRoute>
        <QuizEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/quizzes/:quizId/edit',
    element: (
      <ProtectedRoute>
        <QuizEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/quizzes/:quizId/preview',
    element: (
      <ProtectedRoute>
        <QuizPreviewPage />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
]);
