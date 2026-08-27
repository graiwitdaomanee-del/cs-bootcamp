import { useState } from 'react';
import type { LiveChatMockStep } from '../../../types/step';
import { Button } from '../../common/Button';
import { Icon } from '../../common/Icon';
import { CountdownTimer } from './CountdownTimer';

export function LiveChatMockQuestion({
  step,
  onComplete,
}: {
  step: LiveChatMockStep;
  onComplete: (answer: string) => void;
}) {
  const [reply, setReply] = useState('');
  const [sent, setSent] = useState(false);
  const [expired, setExpired] = useState(false);

  const matchedKeywords = step.sampleReplyKeywords.filter((kw) =>
    reply.toLowerCase().includes(kw.toLowerCase()),
  );

  function handleExpire() {
    if (sent) return;
    setExpired(true);
    setSent(true);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-surface-variant shadow-ambient">
      <div className="flex items-center gap-2 bg-success-green px-4 py-2.5 text-on-primary">
        <Icon name="forum" filled className="text-[18px]" />
        <span className="font-display text-sm font-bold">Live Chat — ร้านค้า</span>
        {typeof step.timeLimitSeconds === 'number' && !sent && (
          <div className="ml-auto">
            <CountdownTimer timeLimitSeconds={step.timeLimitSeconds} paused={sent} onExpire={handleExpire} />
          </div>
        )}
      </div>

      <div className="space-y-2 bg-surface-container-low p-4">
        {step.openingMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 font-sans text-sm ${
                msg.sender === 'agent'
                  ? 'rounded-br-sm bg-success-green text-on-primary'
                  : 'rounded-bl-sm border border-surface-variant bg-surface-white text-on-surface'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {sent && (
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-success-green px-4 py-2 font-sans text-sm text-on-primary">
              {reply}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 bg-surface-white p-4">
        {!sent ? (
          <>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 font-sans text-sm text-on-surface focus:border-success-green focus:outline-none focus:ring-2 focus:ring-success-green/20"
              rows={3}
              placeholder="พิมพ์ข้อความตอบกลับร้านค้า..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button disabled={!reply.trim()} onClick={() => setSent(true)}>
                ส่งข้อความ
              </Button>
              <Button variant="ghost" className="text-success-green" onClick={() => setReply(step.modelReply)}>
                <Icon name="auto_fix_high" className="text-[16px]" /> เติมคำตอบอัตโนมัติ (สาธิต)
              </Button>
            </div>
          </>
        ) : (
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
              <p className="mt-1 font-sans text-sm text-secondary">{step.modelReply}</p>
            </div>
            <Button onClick={() => onComplete(reply)}>ถัดไป</Button>
          </div>
        )}
      </div>
    </div>
  );
}
