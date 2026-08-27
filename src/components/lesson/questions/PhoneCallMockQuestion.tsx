import { useState } from 'react';
import type { PhoneCallMockStep } from '../../../types/step';
import { Button } from '../../common/Button';
import { Icon } from '../../common/Icon';
import { CountdownTimer } from './CountdownTimer';

type RecordingState = 'idle' | 'recording' | 'recorded';

/** No real microphone access in this demo — recording is simulated end-to-end. */
const PLACEHOLDER_ANSWER = '[สาธิต] จำลองการบันทึกเสียง — ไม่มีไฟล์เสียงจริง';

export function PhoneCallMockQuestion({
  step,
  onComplete,
}: {
  step: PhoneCallMockStep;
  onComplete: (answer: string) => void;
}) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [submitted, setSubmitted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [expired, setExpired] = useState(false);

  function startRecording() {
    setRecordingState('recording');
  }

  function stopRecording() {
    setRecordingState('recorded');
  }

  function handleReRecord() {
    setRecordingState('idle');
  }

  function handleSubmit() {
    setLocked(true);
    setSubmitted(true);
  }

  function handleExpire() {
    if (locked) return;
    setLocked(true);
    setExpired(true);
    setSubmitted(true);
  }

  function handleAutoComplete() {
    setRecordingState('recorded');
    setLocked(true);
    setSubmitted(true);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-surface-variant shadow-ambient">
      <div className="flex items-center justify-between gap-2 bg-slate-dark px-4 py-2.5 text-white">
        <div className="flex items-center gap-2">
          <Icon name="phone_in_talk" filled className="text-[18px]" />
          <span className="font-display text-sm font-bold">สายเรียกเข้า — ร้านค้า</span>
        </div>
        {typeof step.timeLimitSeconds === 'number' && (
          <CountdownTimer timeLimitSeconds={step.timeLimitSeconds} paused={locked} onExpire={handleExpire} />
        )}
      </div>

      <div className="space-y-2 bg-surface-container-low p-4">
        {step.callerLines.map((line, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-surface-variant bg-surface-white p-3">
            <Icon name="record_voice_over" className="mt-0.5 text-secondary text-[16px]" />
            <p className="font-sans text-sm text-on-surface">{line}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 bg-surface-white p-4">
        <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-xs text-secondary">
          <Icon name="info" className="text-[14px]" /> โหมดสาธิต — ขั้นตอนนี้จำลองการอัดเสียง ไม่มีการเข้าถึงไมโครโฟนจริง
        </div>

        {expired && recordingState !== 'recorded' && (
          <div className="flex items-center gap-2 rounded-lg border border-error/20 bg-error-container px-3 py-2 text-sm text-error">
            <Icon name="schedule" className="text-[16px]" /> หมดเวลา — ไม่มีการบันทึกเสียงคำตอบ
          </div>
        )}

        {!locked && recordingState === 'idle' && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={startRecording}>
              <Icon name="mic" filled className="text-[16px]" /> เริ่มอัดเสียงคำตอบ (จำลอง)
            </Button>
            <Button variant="ghost" className="text-success-green" onClick={handleAutoComplete}>
              <Icon name="auto_fix_high" className="text-[16px]" /> ข้ามและตอบอัตโนมัติ (สาธิต)
            </Button>
          </div>
        )}

        {!locked && recordingState === 'recording' && (
          <Button variant="danger" onClick={stopRecording}>
            <Icon name="stop_circle" filled className="text-[16px] animate-pulse-danger" /> หยุดอัดเสียง
          </Button>
        )}

        {recordingState === 'recorded' && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-3">
              <Icon name="graphic_eq" className="text-[22px] text-secondary" />
              <div>
                <p className="font-sans text-sm text-on-surface">การบันทึกเสียง (ตัวอย่างสาธิต)</p>
                <p className="font-mono text-xs text-secondary">ไม่มีการบันทึกเสียงจริงในโหมดสาธิตนี้</p>
              </div>
            </div>
            {!locked && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSubmit}>ส่งคำตอบ</Button>
                <Button variant="ghost" onClick={handleReRecord}>
                  <Icon name="refresh" className="text-[16px]" /> อัดใหม่
                </Button>
              </div>
            )}
          </div>
        )}

        {submitted && (
          <div className="space-y-2 rounded-lg border border-success-green/20 bg-success-green/5 p-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-success-green">
              ตรวจสอบด้วยตนเอง (เทียบคำตอบของคุณกับแนวทางด้านล่าง)
            </p>
            <p className="font-sans text-sm text-on-surface-variant">{step.modelReplyDescription}</p>
            {step.sampleReplyKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {step.sampleReplyKeywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-[10px] text-secondary">
                    #{kw}
                  </span>
                ))}
              </div>
            )}
            <Button onClick={() => onComplete(PLACEHOLDER_ANSWER)}>ถัดไป</Button>
          </div>
        )}
      </div>
    </div>
  );
}
