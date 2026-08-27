import { useAppStore } from '../store/useAppStore';

export function useCurrentUser() {
  const currentUserId = useAppStore((s) => s.currentUserId);
  const accounts = useAppStore((s) => s.accounts);
  const account = accounts.find((a) => a.id === currentUserId) ?? null;
  return account;
}
