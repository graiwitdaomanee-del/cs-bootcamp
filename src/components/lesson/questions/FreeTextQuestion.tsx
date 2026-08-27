import { useState } from 'react';
import type { FreeTextStep } from '../../../types/step';
import { Button } from '../../common/Button';
import { Icon } from '../../common/Icon';
import { CountdownTimer } from './CountdownTimer';

export function FreeTextQuestion({
  step,
  onComplete,
}: {
  step: FreeTextStep;
  onComplete: (answer: string) => void;
}) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);

  const matchedKeywords = step.sampleAnswerKeywords.filter((kw) =>
    text.toLowerCase().includes(kw.toLowerCase()),
  );
  const tooShort = text.trim().length < step.minLength;

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
      <textarea
        className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 font-sans text-sm text-on-surface focus:border-success-green focus:outline-none focus:ring-2 focus:ring-success-green/20"
        rows={5}
        placeholder="พิมพ์คำตอบของคุณ..."
        value={text}
        disabled={submitted}
        onChange={(e) => setText(e.target.value)}
      />
      {!submitted && (
        <div className="flex flex-wrap gap-2">
          <Button disabled={tooShort} onClick={() => setSubmitted(true)}>
            ส่งคำตอบ
          </Button>
          <Button variant="ghost" className="text-success-green" onClick={() => setText(step.modelAnswer)}>
            <Icon name="auto_fix_high" className="text-[16px]" /> เติมคำตอบอัตโนมัติ (สาธิต)
          </Button>
        </div>
      )}
      {tooShort && !submitted && (
        <p className="font-mono text-xs text-secondary">
          เขียนอย่างน้อย {step.minLength} ตัวอักษร ({text.trim().length}/{step.minLength})
        </p>
      )}

      {submitted && (
        <div className="space-y-3 rounded-lg border border-success-green/20 bg-success-green/5 p-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-success-green">
            {expired ? 'หมดเวลา!' : 'ตรวจสอบด้วยตนเอง'}
          </p>
          <p className="font-sans text-sm text-on-surface-variant">
            {matchedKeywords.length > 0
              ? `เยี่ยม — คำตอบของคุณครอบคลุมประเด็น: ${matchedKeywords.join(', ')}`
              : 'แบบฝึกหัดนี้ให้ตรวจสอบด้วยตนเอง ลองเทียบคำตอบของคุณกับคำตอบตัวอย่างด้านล่าง'}
          </p>
          <div>
            <p className="font-mono text-xs font-semibold text-secondary">คำตอบตัวอย่าง</p>
            <p className="mt-1 font-sans text-sm text-secondary">{step.modelAnswer}</p>
          </div>
          <Button onClick={() => onComplete(text)}>ถัดไป</Button>
        </div>
      )}
    </div>
  );
}
