import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Button } from '../common/Button';
import { XPBadge } from '../common/XPBadge';
import { Icon } from '../common/Icon';

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium transition-all ${
          isActive
            ? 'bg-success-green/10 font-semibold text-success-green'
            : 'text-secondary hover:bg-surface-container-high'
        }`
      }
    >
      <Icon name={icon} className="text-[18px]" />
      {label}
    </NavLink>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const account = useCurrentUser();
  const logout = useAppStore((s) => s.logout);
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const progress = useAppStore((s) => (account ? s.progress[account.id] : undefined));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-surface-variant bg-surface-white shadow-ambient">
        <div className="mx-auto flex max-w-max-width flex-wrap items-center justify-between gap-y-2 px-margin-mobile py-3 md:px-margin-desktop">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-green">
              <Icon name="bolt" filled className="text-[18px] text-on-primary" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-on-surface">
              LMWN CS <span className="text-success-green">Bootcamp</span>
            </span>
          </button>

          {account && (
            <nav className="order-3 flex w-full items-center gap-1 sm:order-none sm:w-auto">
              <NavItem to="/" icon="dashboard" label="หน้าหลัก" />
              <NavItem to="/knowledge-hub" icon="lightbulb" label="คลังความรู้" />
              {account.role === 'admin' && <NavItem to="/admin/quizzes" icon="quiz" label="คลังแบบทดสอบ" />}
            </nav>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {account?.role === 'trainee' && progress && (
              <XPBadge xp={progress.xp} streakDays={progress.streakDays} />
            )}
            {account && (
              <div className="flex items-center gap-2 rounded-lg border border-outline-variant px-2.5 py-1.5">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full font-display text-xs font-bold text-on-primary"
                  style={{ backgroundColor: account.avatarColor }}
                >
                  {account.name.charAt(0)}
                </span>
                <div className="hidden leading-tight sm:block">
                  <div className="font-sans text-xs font-semibold text-on-surface">{account.name}</div>
                  <div className="font-sans text-[10px] text-secondary">{account.title}</div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className="text-xs"
              onClick={() => {
                if (confirm('รีเซ็ตข้อมูลสาธิตทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
                  resetDemoData();
                  navigate('/login');
                }
              }}
            >
              รีเซ็ตข้อมูลสาธิต
            </Button>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-max-width px-margin-mobile py-6 md:px-margin-desktop">{children}</main>
    </div>
  );
}
