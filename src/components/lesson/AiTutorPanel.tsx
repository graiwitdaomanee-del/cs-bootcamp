import { useEffect, useRef, useState } from 'react';
import type { ChatTurn } from '../../types/tutor';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

function TurnBubble({ turn }: { turn: ChatTurn }) {
  if (turn.role === 'divider') {
    return (
      <div className="my-1 flex items-center gap-2 py-1">
        <span className="h-px flex-1 bg-surface-variant" />
        <span className="max-w-[70%] truncate font-mono text-[10px] text-secondary">{turn.text}</span>
        <span className="h-px flex-1 bg-surface-variant" />
      </div>
    );
  }

  const isTrainee = turn.role === 'trainee';
  return (
    <div className={`flex ${isTrainee ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 font-sans text-xs leading-relaxed ${
          isTrainee
            ? 'bg-success-green/10 text-on-surface'
            : 'bg-surface-container-low text-on-surface-variant'
        }`}
      >
        {!isTrainee && (
          <span className="mb-0.5 flex items-center gap-1 font-mono text-[10px] font-semibold text-success-green">
            <Icon name="psychology" filled className="text-[12px]" /> ติวเตอร์
          </span>
        )}
        <span className="whitespace-pre-wrap">{turn.text}</span>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-xl bg-surface-container-low px-3 py-2 font-mono text-[11px] text-secondary">
        กำลังพิมพ์<span className="animate-pulse-danger">…</span>
      </div>
    </div>
  );
}

export function AiTutorPanel({
  turns,
  isTyping,
  active,
  onSend,
}: {
  turns: ChatTurn[];
  isTyping: boolean;
  /** Whether the tutor tab is the visible one — used to re-pin the scroll when it reappears. */
  active: boolean;
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    // Toggling `hidden` on the parent can reset scrollTop, so re-pin to the bottom whenever
    // the log grows or the tab becomes visible again.
    if (el && active) el.scrollTop = el.scrollHeight;
  }, [turns, isTyping, active]);

  function submit() {
    const text = draft.trim();
    if (!text || isTyping) return;
    onSend(text);
    setDraft('');
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={logRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {turns.map((turn) => (
          <TurnBubble key={turn.id} turn={turn} />
        ))}
        {isTyping && <TypingBubble />}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="พิมพ์สิ่งที่คุณกำลังคิด... (Enter ส่ง / Shift+Enter ขึ้นบรรทัดใหม่)"
          className="min-h-0 w-full flex-1 resize-none rounded-lg border border-outline-variant bg-surface-white px-3 py-2 font-sans text-sm text-on-surface placeholder:text-secondary focus:border-success-green focus:outline-none focus:ring-2 focus:ring-success-green/20"
        />
        <Button onClick={submit} disabled={!draft.trim() || isTyping} className="shrink-0 px-3">
          <Icon name="send" className="text-[16px]" />
        </Button>
      </div>
      <p className="mt-1 font-mono text-[10px] text-secondary">ติวเตอร์จำลอง — ชวนคิด ไม่เฉลยคำตอบ</p>
    </div>
  );
}
