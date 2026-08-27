import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const account = useCurrentUser();
  if (!account) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
