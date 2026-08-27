import { useMemo, useState } from 'react';
import type { SalesforceMockStep as SalesforceMockStepType } from '../../../types/step';
import { Button } from '../../common/Button';
import { CountdownTimer } from './CountdownTimer';
import { Icon } from '../../common/Icon';

type RequiredField = 'subject' | 'description' | 'priority' | 'caseType' | 'account';

export function SalesforceMockStep({
  step,
  onComplete,
}: {
  step: SalesforceMockStepType;
  onComplete: (answer: string) => void;
}) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [caseType, setCaseType] = useState('');
  const [accountQuery, setAccountQuery] = useState('');
  const [accountId, setAccountId] = useState<string | null>(null);

  const [locked, setLocked] = useState(false);
  const [expired, setExpired] = useState(false);

  const selectedAccount = step.mockAccounts.find((a) => a.id === accountId) ?? null;

  const matchingAccounts = useMemo(() => {
    const q = accountQuery.trim().toLowerCase();
    if (!q) return step.mockAccounts;
    return step.mockAccounts.filter((a) => a.merchantName.toLowerCase().includes(q));
  }, [accountQuery, step.mockAccounts]);

  const requiredFields: RequiredField[] = ['subject', 'description', 'priority', 'caseType', 'account'];
  const isComplete = requiredFields.every((field) => {
    if (field === 'subject') return subject.trim().length > 0;
    if (field === 'description') return description.trim().length > 0;
    if (field === 'priority') return priority.length > 0;
    if (field === 'caseType') return caseType.length > 0;
    if (field === 'account') return accountId !== null;
    return true;
  });

  function serialize() {
    return JSON.stringify({
      subject,
      description,
      priority,
      caseType,
      account: selectedAccount?.merchantName ?? null,
    });
  }

  function handleAutoFill() {
    setSubject(step.idealCase.subject);
    setDescription(step.idealCase.description);
    setPriority(step.idealCase.priority);
    setCaseType(step.idealCase.caseType);
    setAccountId(step.idealCase.accountId);
    setAccountQuery('');
  }

  function handleSubmit() {
    setLocked(true);
  }

  function handleExpire() {
    if (locked) return;
    setLocked(true);
    setExpired(true);
  }

  return (
    <div
      className="overflow-hidden rounded border border-[#dddbda] bg-[#f3f3f3]"
      style={{ fontFamily: "'Salesforce Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="flex items-center justify-between border-b border-[#dddbda] bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-[#00a1e0]">
            <Icon name="cases" className="text-[20px] text-white" />
          </span>
          <span className="text-[16px] font-semibold text-[#181818]">Service Cloud — เคสใหม่</span>
        </div>
        {typeof step.timeLimitSeconds === 'number' && (
          <CountdownTimer timeLimitSeconds={step.timeLimitSeconds} paused={locked} onExpire={handleExpire} />
        )}
      </div>

      <div className="space-y-3 p-4">
        {expired && (
          <div className="flex items-center gap-2 rounded border border-[#fead9a] bg-[#fef4f2] px-3 py-2 text-[13px] text-[#ba0517]">
            <Icon name="schedule" className="text-[16px]" /> หมดเวลา! ระบบส่งเคสให้อัตโนมัติด้วยข้อมูลเท่าที่กรอกไว้
          </div>
        )}

        <div className="rounded border border-[#dddbda] bg-white p-4">
          <div>
            <label className="mb-1 block text-[12px] text-[#444444]">บัญชี / ร้านค้า</label>
            {!locked ? (
              <div className="relative">
                <input
                  className="h-8 w-full rounded border border-[#dddbda] px-2 text-[13px] text-[#181818] outline-none focus:border-[#0176d3] focus:ring-1 focus:ring-[#0176d3]"
                  placeholder="ค้นหาชื่อร้านค้า..."
                  value={selectedAccount ? selectedAccount.merchantName : accountQuery}
                  onChange={(e) => {
                    setAccountQuery(e.target.value);
                    setAccountId(null);
                  }}
                />
                {!selectedAccount && accountQuery && matchingAccounts.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded border border-[#dddbda] bg-white shadow-lg">
                    {matchingAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        className="block w-full px-3 py-2 text-left text-[13px] text-[#181818] hover:bg-[#f3f3f3]"
                        onClick={() => {
                          setAccountId(acc.id);
                          setAccountQuery('');
                        }}
                      >
                        {acc.merchantName}{' '}
                        <span className="text-[12px] text-[#747474]">· {acc.businessType}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-8 rounded border border-[#dddbda] bg-[#f3f3f3] px-2 py-1 text-[13px] text-[#444444]">
                {selectedAccount?.merchantName ?? '—'}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded border border-[#dddbda] bg-white p-4">
          <div>
            <label className="mb-1 block text-[12px] text-[#444444]">หัวข้อเคส (Subject)</label>
            <input
              className="h-8 w-full rounded border border-[#dddbda] px-2 text-[13px] text-[#181818] outline-none focus:border-[#0176d3] focus:ring-1 focus:ring-[#0176d3] disabled:opacity-60"
              value={subject}
              disabled={locked}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="สรุปสั้น ๆ พร้อมเลขอ้างอิง"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] text-[#444444]">รายละเอียด (Description)</label>
            <textarea
              className="w-full rounded border border-[#dddbda] px-2 py-1.5 text-[13px] text-[#181818] outline-none focus:border-[#0176d3] focus:ring-1 focus:ring-[#0176d3] disabled:opacity-60"
              rows={4}
              value={description}
              disabled={locked}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="บริบทครบถ้วนที่เพื่อนร่วมทีมคนอื่นสามารถสานต่อได้"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[12px] text-[#444444]">ลำดับความสำคัญ (Priority)</label>
              <select
                className="h-8 w-full rounded border border-[#dddbda] px-2 text-[13px] text-[#181818] outline-none focus:border-[#0176d3] focus:ring-1 focus:ring-[#0176d3] disabled:opacity-60"
                value={priority}
                disabled={locked}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">เลือก...</option>
                {step.priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] text-[#444444]">ประเภทเคส (Case Type)</label>
              <select
                className="h-8 w-full rounded border border-[#dddbda] px-2 text-[13px] text-[#181818] outline-none focus:border-[#0176d3] focus:ring-1 focus:ring-[#0176d3] disabled:opacity-60"
                value={caseType}
                disabled={locked}
                onChange={(e) => setCaseType(e.target.value)}
              >
                <option value="">เลือก...</option>
                {step.caseTypeOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!locked && (
            <div className="flex flex-wrap gap-2 border-t border-[#dddbda] pt-4">
              <button
                disabled={!isComplete}
                onClick={handleSubmit}
                className="rounded bg-[#0176d3] px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#014486] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ส่งเคส
              </button>
              <Button variant="ghost" className="text-success-green" onClick={handleAutoFill}>
                <Icon name="auto_fix_high" className="text-[16px]" /> เติมคำตอบอัตโนมัติ (สาธิต)
              </Button>
            </div>
          )}
        </div>

        {locked && (
          <div className="space-y-2 rounded border border-[#dddbda] bg-white p-4">
            <p className="text-[13px] font-semibold text-[#181818]">
              {expired ? 'ระบบส่งเคสให้อัตโนมัติแล้ว' : 'บันทึกเคสเรียบร้อยแล้ว'}
            </p>
            <Button onClick={() => onComplete(serialize())}>ถัดไป</Button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-[12px] text-[#747474]">
          <Icon name="lock" className="text-[14px]" /> Secure Salesforce Environment
        </div>
      </div>
    </div>
  );
}
