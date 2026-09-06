/** A single line in the mock AI tutor conversation. */
export interface ChatTurn {
  id: string;
  /** `divider` marks a step boundary; it carries a short label, not a message. */
  role: 'trainee' | 'tutor' | 'divider';
  text: string;
  /** Epoch ms, for ordering only. Not persisted — the whole conversation resets on reload. */
  ts: number;
}
