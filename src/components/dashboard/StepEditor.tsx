import { useState } from 'react';
import type { LessonStep, StepType, ChoiceOption, StepMedia, ChatMessage } from '../../types/step';
import { Button } from '../common/Button';
import { BlockEditor } from './BlockEditor';
import { ChoiceOptionsEditor } from './ChoiceOptionsEditor';
import { Icon } from '../common/Icon';
import { id as makeId } from '../../utils/id';
import { getStepIssues } from '../../utils/stepValidation';

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  info: 'ข้อมูล (Info)',
  'free-text': 'พิมพ์คำตอบ (Free Text)',
  'single-choice': 'เลือกคำตอบเดียว (Single Choice)',
  'multi-choice': 'เลือกได้หลายคำตอบ (Multi Choice)',
  'salesforce-mock-timed': 'จำลอง Salesforce (จับเวลา)',
  'live-chat-mock': 'จำลอง Live Chat',
  'phone-call-mock': 'จำลองสายโทรเข้า (อัดเสียง)',
};

export const STEP_TYPE_ICONS: Record<StepType, string> = {
  info: 'article',
  'free-text': 'edit_note',
  'single-choice': 'quiz',
  'multi-choice': 'quiz',
  'salesforce-mock-timed': 'web_asset',
  'live-chat-mock': 'forum',
  'phone-call-mock': 'phone_in_talk',
};

export function defaultOptions(): ChoiceOption[] {
  return [
    { id: makeId('opt'), label: '' },
    { id: makeId('opt'), label: '' },
  ];
}

export function createDefaultStep(type: StepType, order: number): LessonStep {
  const base = { id: makeId('step'), order, prompt: '', helperText: '' };
  switch (type) {
    case 'info':
      return { ...base, type, bodyBlocks: [] };
    case 'free-text':
      return { ...base, type, minLength: 10, sampleAnswerKeywords: [], modelAnswer: '' };
    case 'single-choice': {
      const options = defaultOptions();
      return { ...base, type, options, correctOptionId: options[0].id, explanation: '' };
    }
    case 'multi-choice': {
      const options = defaultOptions();
      return { ...base, type, options, correctOptionIds: [], explanation: '' };
    }
    case 'salesforce-mock-timed':
      return {
        ...base,
        type,
        scenario: '',
        timeLimitSeconds: 180,
        priorityOptions: ['Low', 'Medium', 'High', 'Urgent'],
        caseTypeOptions: ['Order Issue', 'Payout Discrepancy'],
        mockAccounts: [{ id: makeId('acc'), merchantName: '', businessType: '' }],
        idealCase: { subject: '', description: '', priority: '', caseType: '', accountId: '' },
      };
    case 'live-chat-mock':
      return {
        ...base,
        type,
        openingMessages: [{ id: makeId('msg'), sender: 'customer', text: '' }],
        modelReply: '',
        sampleReplyKeywords: [],
      };
    case 'phone-call-mock':
      return {
        ...base,
        type,
        scenario: '',
        callerLines: [''],
        modelReplyDescription: '',
        sampleReplyKeywords: [],
      };
  }
}

/** True when the author has typed something into this step that a type switch would discard. */
function stepIsDirty(step: LessonStep): boolean {
  if (step.prompt.trim() || (step.helperText ?? '').trim()) return true;
  switch (step.type) {
    case 'info':
      return step.bodyBlocks.some((b) => (b.type === 'text' ? b.text.trim() : b.caption.trim()));
    case 'free-text':
      return step.modelAnswer.trim().length > 0 || step.sampleAnswerKeywords.length > 0;
    case 'single-choice':
    case 'multi-choice':
      return step.options.some((o) => o.label.trim()) || step.explanation.trim().length > 0;
    case 'live-chat-mock':
      return step.openingMessages.some((m) => m.text.trim()) || step.modelReply.trim().length > 0;
    case 'phone-call-mock':
      return (
        step.scenario.trim().length > 0 ||
        step.callerLines.some((l) => l.trim()) ||
        step.modelReplyDescription.trim().length > 0
      );
    case 'salesforce-mock-timed':
      return (
        step.scenario.trim().length > 0 ||
        step.mockAccounts.some((a) => a.merchantName.trim() || a.businessType.trim()) ||
        step.idealCase.subject.trim().length > 0 ||
        step.idealCase.description.trim().length > 0
      );
  }
}

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface focus:border-success-green focus:outline-none focus:ring-2 focus:ring-success-green/20';

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-surface-variant bg-surface-white p-3">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-secondary">{label}</p>
      {hint && <p className="mt-0.5 font-sans text-[11px] text-secondary">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function StepEditor({
  step,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canRemove,
  allowedTypes,
  dragHandleProps,
  dropZoneProps,
}: {
  step: LessonStep;
  onChange: (step: LessonStep) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canRemove: boolean;
  allowedTypes?: StepType[];
  dragHandleProps?: React.HTMLAttributes<HTMLSpanElement>;
  dropZoneProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const typeOptions = allowedTypes ?? (Object.keys(STEP_TYPE_LABELS) as StepType[]);
  const issues = getStepIssues(step);
  const [showIssues, setShowIssues] = useState(false);
  const [pendingType, setPendingType] = useState<StepType | null>(null);

  function applyTypeChange(type: StepType) {
    onChange({ ...createDefaultStep(type, step.order), id: step.id, prompt: step.prompt });
    setPendingType(null);
  }

  function handleTypeSelect(type: StepType) {
    if (type === step.type) return;
    if (stepIsDirty(step)) setPendingType(type);
    else applyTypeChange(type);
  }

  function updateMedia(media: StepMedia | undefined) {
    onChange({ ...step, media } as LessonStep);
  }

  function updateChatMessage(messages: ChatMessage[], index: number, patch: Partial<ChatMessage>) {
    return messages.map((m, i) => (i === index ? { ...m, ...patch } : m));
  }

  return (
    <div
      className="overflow-hidden rounded-xl border-l-4 border-l-success-green border-y border-r border-y-surface-variant border-r-surface-variant bg-surface-white shadow-ambient"
      {...dropZoneProps}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-variant bg-surface-bright px-4 py-3">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <span
              className="cursor-grab text-outline-variant active:cursor-grabbing"
              title="ลากเพื่อจัดลำดับ"
              {...dragHandleProps}
            >
              <Icon name="drag_indicator" />
            </span>
          )}
          <Icon name={STEP_TYPE_ICONS[step.type]} className="text-secondary" />
          <select
            className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1 font-sans text-xs text-on-surface"
            value={step.type}
            onChange={(e) => handleTypeSelect(e.target.value as StepType)}
          >
            {typeOptions.map((value) => (
              <option key={value} value={value}>
                {STEP_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
          {issues.length > 0 && (
            <button
              type="button"
              onClick={() => setShowIssues((v) => !v)}
              className="flex items-center gap-1 rounded-full bg-warning-gold/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-tertiary"
            >
              <Icon name="warning" filled className="text-[12px]" />
              {issues.length} จุดที่ต้องแก้
              <Icon name={showIssues ? 'expand_less' : 'expand_more'} className="text-[12px]" />
            </button>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" className="p-1.5" onClick={onMoveUp} title="เลื่อนขึ้น">
            <Icon name="keyboard_arrow_up" className="text-[16px]" />
          </Button>
          <Button variant="ghost" className="p-1.5" onClick={onMoveDown} title="เลื่อนลง">
            <Icon name="keyboard_arrow_down" className="text-[16px]" />
          </Button>
          {canRemove && (
            <Button variant="danger" className="p-1.5" onClick={onRemove} title="ลบขั้นตอนนี้">
              <Icon name="delete" className="text-[16px]" />
            </Button>
          )}
        </div>
      </div>

      {pendingType && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-warning-gold/40 bg-warning-gold/10 px-4 py-2.5">
          <p className="font-sans text-xs text-on-surface-variant">
            เปลี่ยนเป็น "{STEP_TYPE_LABELS[pendingType]}" จะล้างข้อมูลที่กรอกไว้ในขั้นตอนนี้
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => setPendingType(null)}>
              ยกเลิก
            </Button>
            <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => applyTypeChange(pendingType)}>
              เปลี่ยนชนิด
            </Button>
          </div>
        </div>
      )}

      {showIssues && issues.length > 0 && (
        <ul className="border-b border-surface-variant bg-warning-gold/5 px-4 py-2.5 font-sans text-xs text-on-surface-variant">
          {issues.map((issue) => (
            <li key={issue} className="flex gap-1.5 py-0.5">
              <span className="text-tertiary">•</span>
              {issue}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3 p-4">
        <FieldGroup
          label={step.type === 'info' ? 'หัวข้อ' : 'โจทย์ / คำถาม'}
          hint={step.type === 'info' ? undefined : 'ข้อความที่ trainee เห็นทางซ้ายของหน้าจอ'}
        >
          <input
            className={inputClass}
            placeholder={step.type === 'info' ? 'หัวข้อของเนื้อหานี้' : 'พิมพ์โจทย์หรือคำถาม'}
            value={step.prompt}
            onChange={(e) => onChange({ ...step, prompt: e.target.value })}
          />
          {step.type !== 'info' && (
            <input
              className={`${inputClass} mt-2`}
              placeholder="คำใบ้/คำแนะนำเพิ่มเติม (ไม่บังคับ)"
              value={step.helperText ?? ''}
              onChange={(e) => onChange({ ...step, helperText: e.target.value })}
            />
          )}
        </FieldGroup>

        {step.type === 'info' && (
          <FieldGroup label="เนื้อหา" hint="แทรกข้อความ รูปภาพ หรือวิดีโอได้ทุกตำแหน่ง">
            <BlockEditor blocks={step.bodyBlocks} onChange={(bodyBlocks) => onChange({ ...step, bodyBlocks })} />
          </FieldGroup>
        )}

        {step.type === 'free-text' && (
          <FieldGroup label="สิ่งที่แสดงหลังตอบ" hint="ไม่ตรวจอัตโนมัติ — trainee เทียบคำตอบตัวเองกับตัวอย่างนี้">
            <textarea
              className={inputClass}
              rows={2}
              placeholder="คำตอบตัวอย่าง (แสดงหลังส่งคำตอบ)"
              value={step.modelAnswer}
              onChange={(e) => onChange({ ...step, modelAnswer: e.target.value })}
            />
            <label className="mt-2 block font-sans text-[11px] text-secondary">ความยาวขั้นต่ำ (ตัวอักษร)</label>
            <input
              type="number"
              min={1}
              className={`${inputClass} mt-1 w-32`}
              value={step.minLength}
              onChange={(e) => onChange({ ...step, minLength: Number(e.target.value) })}
            />
          </FieldGroup>
        )}

        {step.type === 'single-choice' && (
          <>
            <FieldGroup label="ตัวเลือกคำตอบ" hint="กดปุ่มวงกลมหน้าตัวเลือกเพื่อทำเครื่องหมายว่าเป็นคำตอบที่ถูก">
              <ChoiceOptionsEditor
                options={step.options}
                type="single-choice"
                correctOptionIds={[step.correctOptionId]}
                onChange={({ options, correctOptionIds }) =>
                  onChange({ ...step, options, correctOptionId: correctOptionIds[0] ?? '' })
                }
              />
            </FieldGroup>
            <FieldGroup label="คำอธิบายเฉลย" hint="แสดงหลัง trainee ตอบ อธิบายว่าทำไมคำตอบนี้ถูก">
              <textarea
                className={inputClass}
                rows={2}
                placeholder="อธิบายเหตุผลของคำตอบที่ถูก"
                value={step.explanation}
                onChange={(e) => onChange({ ...step, explanation: e.target.value })}
              />
            </FieldGroup>
          </>
        )}

        {step.type === 'multi-choice' && (
          <>
            <FieldGroup label="ตัวเลือกคำตอบ" hint="ติ๊กช่องหน้าตัวเลือกทุกข้อที่เป็นคำตอบที่ถูก (ถูกเมื่อเลือกครบตรงกันพอดี)">
              <ChoiceOptionsEditor
                options={step.options}
                type="multi-choice"
                correctOptionIds={step.correctOptionIds}
                onChange={({ options, correctOptionIds }) => onChange({ ...step, options, correctOptionIds })}
              />
            </FieldGroup>
            <FieldGroup label="คำอธิบายเฉลย" hint="แสดงหลัง trainee ตอบ อธิบายว่าทำไมชุดคำตอบนี้ถูก">
              <textarea
                className={inputClass}
                rows={2}
                placeholder="อธิบายเหตุผลของชุดคำตอบที่ถูก"
                value={step.explanation}
                onChange={(e) => onChange({ ...step, explanation: e.target.value })}
              />
            </FieldGroup>
          </>
        )}

        {step.type === 'live-chat-mock' && (
          <>
            <FieldGroup label="บทสนทนาที่มาก่อน" hint="ข้อความจากลูกค้า/แอดมิน ที่ trainee เห็นก่อนพิมพ์ตอบ">
              <div className="space-y-2">
                {step.openingMessages.map((msg, i) => (
                  <div key={msg.id} className="flex items-center gap-2">
                    <select
                      className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1.5 text-xs text-on-surface"
                      value={msg.sender}
                      onChange={(e) =>
                        onChange({
                          ...step,
                          openingMessages: updateChatMessage(step.openingMessages, i, {
                            sender: e.target.value as ChatMessage['sender'],
                          }),
                        })
                      }
                    >
                      <option value="customer">ลูกค้า</option>
                      <option value="agent">แอดมิน</option>
                    </select>
                    <input
                      className="flex-1 rounded-lg border border-outline-variant bg-surface-white px-3 py-1.5 text-sm text-on-surface"
                      placeholder="ข้อความ"
                      value={msg.text}
                      onChange={(e) =>
                        onChange({
                          ...step,
                          openingMessages: updateChatMessage(step.openingMessages, i, { text: e.target.value }),
                        })
                      }
                    />
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() =>
                        onChange({
                          ...step,
                          openingMessages: step.openingMessages.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      <Icon name="close" className="text-[16px]" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() =>
                    onChange({
                      ...step,
                      openingMessages: [
                        ...step.openingMessages,
                        { id: makeId('msg'), sender: 'customer', text: '' },
                      ],
                    })
                  }
                >
                  + เพิ่มข้อความ
                </Button>
              </div>
            </FieldGroup>
            <FieldGroup label="สิ่งที่แสดงหลังตอบ" hint="ข้อความตอบกลับตัวอย่าง (ไม่ตรวจอัตโนมัติ)">
              <textarea
                className={inputClass}
                rows={2}
                placeholder="ข้อความตอบกลับตัวอย่าง"
                value={step.modelReply}
                onChange={(e) => onChange({ ...step, modelReply: e.target.value })}
              />
            </FieldGroup>
          </>
        )}

        {step.type === 'phone-call-mock' && (
          <>
            <FieldGroup label="สถานการณ์การโทร" hint="บริบทของสายที่โทรเข้ามา">
              <textarea
                className={inputClass}
                rows={2}
                placeholder="รายละเอียดสถานการณ์การโทร"
                value={step.scenario}
                onChange={(e) => onChange({ ...step, scenario: e.target.value })}
              />
            </FieldGroup>
            <FieldGroup label="สิ่งที่ผู้โทรเข้าพูด" hint="ใส่ทีละบรรทัด">
              <div className="space-y-2">
                {step.callerLines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-lg border border-outline-variant bg-surface-white px-3 py-1.5 text-sm text-on-surface"
                      placeholder="ข้อความที่ผู้โทรเข้าพูด"
                      value={line}
                      onChange={(e) =>
                        onChange({
                          ...step,
                          callerLines: step.callerLines.map((l, idx) => (idx === i ? e.target.value : l)),
                        })
                      }
                    />
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() =>
                        onChange({ ...step, callerLines: step.callerLines.filter((_, idx) => idx !== i) })
                      }
                    >
                      <Icon name="close" className="text-[16px]" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() => onChange({ ...step, callerLines: [...step.callerLines, ''] })}
                >
                  + เพิ่มบรรทัด
                </Button>
              </div>
            </FieldGroup>
            <FieldGroup label="สิ่งที่แสดงหลังตอบ" hint="แนวทางคำตอบที่ดี (ไม่ตรวจอัตโนมัติ)">
              <textarea
                className={inputClass}
                rows={2}
                placeholder="สิ่งที่คำตอบที่ดีควรมี"
                value={step.modelReplyDescription}
                onChange={(e) => onChange({ ...step, modelReplyDescription: e.target.value })}
              />
            </FieldGroup>
          </>
        )}

        {step.type === 'salesforce-mock-timed' && (
          <>
            <FieldGroup label="สถานการณ์จำลอง" hint="บริบทของเคสที่ trainee ต้องบันทึก">
              <textarea
                className={inputClass}
                rows={3}
                placeholder="รายละเอียดสถานการณ์จำลอง"
                value={step.scenario}
                onChange={(e) => onChange({ ...step, scenario: e.target.value })}
              />
            </FieldGroup>

            <FieldGroup label="บัญชีร้านค้าจำลอง" hint="ตั้งชื่อร้านก่อน แล้วค่อยเลือกร้านที่ถูกต้องในช่อง 'คำตอบที่ถูก' ด้านล่าง">
              <div className="space-y-2">
                {step.mockAccounts.map((acc, i) => (
                  <div key={acc.id} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-lg border border-outline-variant bg-surface-white px-2 py-1 text-xs text-on-surface"
                      placeholder="ชื่อร้านค้า"
                      value={acc.merchantName}
                      onChange={(e) => {
                        const mockAccounts = step.mockAccounts.map((a, idx) =>
                          idx === i ? { ...a, merchantName: e.target.value } : a,
                        );
                        onChange({ ...step, mockAccounts });
                      }}
                    />
                    <input
                      className="w-28 rounded-lg border border-outline-variant bg-surface-white px-2 py-1 text-xs text-on-surface"
                      placeholder="ประเภทธุรกิจ"
                      value={acc.businessType}
                      onChange={(e) => {
                        const mockAccounts = step.mockAccounts.map((a, idx) =>
                          idx === i ? { ...a, businessType: e.target.value } : a,
                        );
                        onChange({ ...step, mockAccounts });
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() =>
                    onChange({
                      ...step,
                      mockAccounts: [
                        ...step.mockAccounts,
                        { id: makeId('acc'), merchantName: '', businessType: '' },
                      ],
                    })
                  }
                >
                  + เพิ่มบัญชีร้านค้า
                </Button>
              </div>
            </FieldGroup>

            <FieldGroup
              label="คำตอบที่ถูก"
              hint='ใช้เทียบกับสิ่งที่ trainee กรอก และเป็นคำตอบของปุ่ม "เติมคำตอบอัตโนมัติ (สาธิต)"'
            >
              <div className="space-y-2">
                <input
                  className={inputClass}
                  placeholder="หัวข้อเคสที่ถูกต้อง"
                  value={step.idealCase.subject}
                  onChange={(e) => onChange({ ...step, idealCase: { ...step.idealCase, subject: e.target.value } })}
                />
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="รายละเอียดเคสที่ถูกต้อง"
                  value={step.idealCase.description}
                  onChange={(e) =>
                    onChange({ ...step, idealCase: { ...step.idealCase, description: e.target.value } })
                  }
                />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <select
                    className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1.5 text-xs text-on-surface"
                    value={step.idealCase.priority}
                    onChange={(e) => onChange({ ...step, idealCase: { ...step.idealCase, priority: e.target.value } })}
                  >
                    <option value="">ลำดับความสำคัญ…</option>
                    {step.priorityOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1.5 text-xs text-on-surface"
                    value={step.idealCase.caseType}
                    onChange={(e) => onChange({ ...step, idealCase: { ...step.idealCase, caseType: e.target.value } })}
                  >
                    <option value="">ประเภทเคส…</option>
                    {step.caseTypeOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1.5 text-xs text-on-surface"
                    value={step.idealCase.accountId}
                    onChange={(e) =>
                      onChange({ ...step, idealCase: { ...step.idealCase, accountId: e.target.value } })
                    }
                  >
                    <option value="">เลือกบัญชีร้านค้า…</option>
                    {step.mockAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.merchantName || '(ยังไม่ได้ตั้งชื่อ)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FieldGroup>
          </>
        )}

        <FieldGroup label="สื่อประกอบ (ไม่บังคับ)" hint="บทเรียนนี้ไม่ได้อัปโหลดไฟล์จริง — ใส่คำบรรยายว่าเป็นภาพ/วิดีโออะไร">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1 text-xs text-on-surface"
              value={step.media?.type ?? ''}
              onChange={(e) => {
                const value = e.target.value as '' | 'image' | 'video';
                updateMedia(value ? { type: value, caption: step.media?.caption ?? '' } : undefined);
              }}
            >
              <option value="">ไม่มีสื่อประกอบ</option>
              <option value="image">รูปภาพ (ตัวอย่าง)</option>
              <option value="video">วิดีโอ (ตัวอย่าง)</option>
            </select>
            {step.media && (
              <input
                className="min-w-[12rem] flex-1 rounded-lg border border-outline-variant bg-surface-white px-2 py-1 text-xs text-on-surface"
                placeholder="คำบรรยายสื่อ"
                value={step.media.caption}
                onChange={(e) => updateMedia({ type: step.media!.type, caption: e.target.value })}
              />
            )}
          </div>
        </FieldGroup>

        {step.type !== 'info' && (
          <FieldGroup label="จับเวลา (ไม่บังคับ)" hint="เมื่อเปิด จะมีเคาน์ดาวน์และส่งคำตอบอัตโนมัติเมื่อหมดเวลา">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-secondary">
                <input
                  type="checkbox"
                  checked={typeof step.timeLimitSeconds === 'number'}
                  onChange={(e) =>
                    onChange({
                      ...step,
                      timeLimitSeconds: e.target.checked ? (step.timeLimitSeconds ?? 60) : undefined,
                    })
                  }
                />
                ตั้งเวลาจำกัด
              </label>
              {typeof step.timeLimitSeconds === 'number' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    className="w-24 rounded-lg border border-outline-variant bg-surface-white px-2 py-1 text-xs text-on-surface"
                    value={step.timeLimitSeconds}
                    onChange={(e) => onChange({ ...step, timeLimitSeconds: Number(e.target.value) })}
                  />
                  <span className="text-xs text-secondary">วินาที</span>
                </div>
              )}
            </div>
          </FieldGroup>
        )}
      </div>
    </div>
  );
}
