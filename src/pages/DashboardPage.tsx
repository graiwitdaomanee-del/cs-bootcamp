import { AppShell } from '../components/layout/AppShell';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function DashboardPage() {
  const account = useCurrentUser();
  if (!account) return null;

  return (
    <AppShell>
      {account.role === 'admin' ? <AdminDashboard /> : <UserDashboard account={account} />}
    </AppShell>
  );
}
