import { useState } from 'react';
import type { MultiChoiceStep } from '../../../types/step';
import { Button } from '../../common/Button';
import { Icon } from '../../common/Icon';
import { CountdownTimer } from './CountdownTimer';

export function MultiChoiceQuestion({
  step,
  onComplete,
}: {
  step: MultiChoiceStep;
  onComplete: (answer: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);

  function handleExpire() {
    if (submitted) return;
    setExpired(true);
    setSubmitted(true);
  }

  const correctSet = new Set(step.correctOptionIds);
  const isFullyCorrect =
    selected.size === correctSet.size && [...correctSet].every((id) => selected.has(id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {typeof step.timeLimitSeconds === 'number' && !submitted && (
        <CountdownTimer timeLimitSeconds={step.timeLimitSeconds} paused={submitted} onExpire={handleExpire} variant="plain" />
      )}
      <div className="space-y-2">
        {step.options.map((opt) => {
          const isSelected = selected.has(opt.id);
          const isCorrectOpt = correctSet.has(opt.id);
          let stateClass = 'border-surface-variant bg-surface-white text-on-surface-variant hover:border-outline';
          if (submitted) {
            if (isCorrectOpt && isSelected) stateClass = 'border-success-green/40 bg-success-green/10 text-success-green';
            else if (isCorrectOpt && !isSelected) stateClass = 'border-warning-gold/40 bg-warning-gold/10 text-tertiary';
            else if (!isCorrectOpt && isSelected) stateClass = 'border-error/40 bg-error-container text-on-error-container';
          } else if (isSelected) {
            stateClass = 'border-success-green bg-success-green/5 text-on-surface';
          }
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 font-sans text-sm transition-colors ${stateClass}`}
            >
              <input
                type="checkbox"
                className="accent-success-green"
                checked={isSelected}
                disabled={submitted}
                onChange={() => toggle(opt.id)}
              />
              {opt.label}
            </label>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex flex-wrap gap-2">
          <Button disabled={selected.size === 0} onClick={() => setSubmitted(true)}>
            ส่งคำตอบ
          </Button>
          <Button variant="ghost" className="text-success-green" onClick={() => setSelected(new Set(step.correctOptionIds))}>
            <Icon name="auto_fix_high" className="text-[16px]" /> เติมคำตอบอัตโนมัติ (สาธิต)
          </Button>
        </div>
      )}

      {submitted && (
        <div
          className={`space-y-2 rounded-lg border p-3 ${
            isFullyCorrect ? 'border-success-green/20 bg-success-green/10' : 'border-warning-gold/30 bg-warning-gold/10'
          }`}
        >
          <p className={`font-sans text-sm font-semibold ${isFullyCorrect ? 'text-success-green' : 'text-tertiary'}`}>
            {expired ? 'หมดเวลา!' : isFullyCorrect ? 'ถูกต้องทั้งหมด!' : 'ถูกต้องบางส่วน — ดูจุดที่ไฮไลต์ด้านบน'}
          </p>
          <p className="font-sans text-sm text-secondary">{step.explanation}</p>
          <Button onClick={() => onComplete([...selected])}>ถัดไป</Button>
        </div>
      )}
    </div>
  );
}
