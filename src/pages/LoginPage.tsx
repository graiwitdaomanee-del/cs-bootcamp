import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { Account } from '../types/account';
import { Icon } from '../components/common/Icon';

function AccountCard({ account, onClick }: { account: Account; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-surface-variant bg-surface-white p-4 text-left shadow-ambient transition-all hover:border-success-green hover:bg-success-green/5"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-on-primary"
        style={{ backgroundColor: account.avatarColor }}
      >
        {account.name.charAt(0)}
      </span>
      <div>
        <div className="font-display font-semibold text-on-surface">{account.name}</div>
        <div className="font-sans text-xs text-secondary">{account.title}</div>
        <div className="font-sans text-xs text-secondary">{account.email}</div>
      </div>
    </button>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const accounts = useAppStore((s) => s.accounts);
  const login = useAppStore((s) => s.login);

  const admins = accounts.filter((a) => a.role === 'admin');
  const trainees = accounts.filter((a) => a.role === 'trainee');

  function handleLogin(accountId: string) {
    login(accountId);
    navigate('/');
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-gradient-to-br from-success-green/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-gradient-to-tl from-warning-gold/20 to-transparent blur-3xl" />
      </div>

      <div className="z-10 w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-low text-success-green">
            <Icon name="bolt" filled className="text-4xl" />
          </div>
          <h1 className="font-display text-2xl font-bold text-on-surface">LMWN CS Bootcamp</h1>
          <p className="mt-2 font-sans text-sm text-secondary">
            โหมดสาธิต — คลิกเลือกบัญชีด้านล่างเพื่อเข้าสู่ระบบ ไม่ต้องใช้รหัสผ่าน
          </p>
        </div>

        <div className="rounded-xl border border-surface-variant bg-surface-white p-8 shadow-ambient">
          <div className="mb-6">
            <h2 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              ผู้ดูแลระบบ (Admin)
            </h2>
            <div className="grid gap-3">
              {admins.map((account) => (
                <AccountCard key={account.id} account={account} onClick={() => handleLogin(account.id)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              พนักงาน Training (Trainee)
            </h2>
            <div className="grid gap-3">
              {trainees.map((account) => (
                <AccountCard key={account.id} account={account} onClick={() => handleLogin(account.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
