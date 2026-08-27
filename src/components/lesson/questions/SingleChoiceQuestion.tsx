import { useState } from 'react';
import type { SingleChoiceStep } from '../../../types/step';
import { Button } from '../../common/Button';
import { Icon } from '../../common/Icon';
import { CountdownTimer } from './CountdownTimer';

export function SingleChoiceQuestion({
  step,
  onComplete,
}: {
  step: SingleChoiceStep;
  onComplete: (answer: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);

  const isCorrect = selected === step.correctOptionId;

  function handleExpire() {
    if (submitted) return;
    setExpired(true);
    setSubmitted(true);
  }

  return (
    <div className="space-y-3">
      {typeof step.timeLimitSeconds === 'number' && !submitted && (
        <CountdownTimer timeLimitSeconds={step.timeLimitSeconds} paused={submitted} onExpire={handleExpire} variant="plain" />
      )}
      <div className="space-y-2">
        {step.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && opt.id === step.correctOptionId;
          const showWrong = submitted && isSelected && !isCorrect;
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 font-sans text-sm transition-colors ${
                showCorrect
                  ? 'border-success-green/40 bg-success-green/10 text-success-green'
                  : showWrong
                    ? 'border-error/40 bg-error-container text-on-error-container'
                    : isSelected
                      ? 'border-success-green bg-success-green/5 text-on-surface'
                      : 'border-surface-variant bg-surface-white text-on-surface-variant hover:border-outline'
              }`}
            >
              <input
                type="radio"
                className="accent-success-green"
                checked={isSelected}
                disabled={submitted}
                onChange={() => setSelected(opt.id)}
              />
              {opt.label}
            </label>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex flex-wrap gap-2">
          <Button disabled={!selected} onClick={() => setSubmitted(true)}>
            ส่งคำตอบ
          </Button>
          <Button variant="ghost" className="text-success-green" onClick={() => setSelected(step.correctOptionId)}>
            <Icon name="auto_fix_high" className="text-[16px]" /> เติมคำตอบอัตโนมัติ (สาธิต)
          </Button>
        </div>
      )}

      {submitted && (
        <div
          className={`space-y-2 rounded-lg border p-3 ${
            isCorrect ? 'border-success-green/20 bg-success-green/10' : 'border-error/20 bg-error-container'
          }`}
        >
          <p className={`font-sans text-sm font-semibold ${isCorrect ? 'text-success-green' : 'text-error'}`}>
            {expired ? 'หมดเวลา!' : isCorrect ? 'ถูกต้อง!' : 'ยังไม่ถูกต้อง'}
          </p>
          <p className="font-sans text-sm text-secondary">{step.explanation}</p>
          <Button onClick={() => onComplete(selected ?? '')}>ถัดไป</Button>
        </div>
      )}
    </div>
  );
}
