import type { LessonStep, StepType, ChoiceOption, StepMedia, ChatMessage } from '../../types/step';
import { Button } from '../common/Button';
import { BlockEditor } from './BlockEditor';
import { ChoiceOptionsEditor } from './ChoiceOptionsEditor';
import { Icon } from '../common/Icon';
import { id as makeId } from '../../utils/id';

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

  function handleTypeChange(type: StepType) {
    onChange({ ...createDefaultStep(type, step.order), id: step.id, prompt: step.prompt });
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
            onChange={(e) => handleTypeChange(e.target.value as StepType)}
          >
            {typeOptions.map((value) => (
              <option key={value} value={value}>
                {STEP_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" className="p-1.5" onClick={onMoveUp}>
            <Icon name="keyboard_arrow_up" className="text-[16px]" />
          </Button>
          <Button variant="ghost" className="p-1.5" onClick={onMoveDown}>
            <Icon name="keyboard_arrow_down" className="text-[16px]" />
          </Button>
          {canRemove && (
            <Button variant="danger" className="p-1.5" onClick={onRemove}>
              <Icon name="delete" className="text-[16px]" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">

      <input
        className="mb-3 w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
        placeholder="ข้อความคำถาม/หัวข้อ"
        value={step.prompt}
        onChange={(e) => onChange({ ...step, prompt: e.target.value })}
      />

      <div className="mb-3 flex items-center gap-2">
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
            className="flex-1 rounded-lg border border-outline-variant bg-surface-white px-2 py-1 text-xs text-on-surface"
            placeholder="คำอธิบายสื่อ"
            value={step.media.caption}
            onChange={(e) => updateMedia({ type: step.media!.type, caption: e.target.value })}
          />
        )}
      </div>

      {step.type !== 'info' && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-outline-variant bg-surface-white px-3 py-2">
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
            ตั้งเวลาจำกัด (ไม่บังคับ)
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
      )}

      {step.type === 'info' && (
        <div className="rounded-lg border border-surface-variant bg-surface-white p-3">
          <p className="mb-2 text-xs font-semibold text-secondary">เนื้อหา (แทรกรูป/วิดีโอได้ทุกตำแหน่ง)</p>
          <BlockEditor blocks={step.bodyBlocks} onChange={(bodyBlocks) => onChange({ ...step, bodyBlocks })} />
        </div>
      )}

      {step.type === 'free-text' && (
        <div className="space-y-2">
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
            rows={2}
            placeholder="คำตอบตัวอย่าง (แสดงหลังส่งคำตอบ)"
            value={step.modelAnswer}
            onChange={(e) => onChange({ ...step, modelAnswer: e.target.value })}
          />
          <input
            type="number"
            className="w-32 rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
            placeholder="ความยาวขั้นต่ำ"
            value={step.minLength}
            onChange={(e) => onChange({ ...step, minLength: Number(e.target.value) })}
          />
        </div>
      )}

      {step.type === 'single-choice' && (
        <ChoiceOptionsEditor
          options={step.options}
          type="single-choice"
          correctOptionIds={[step.correctOptionId]}
          onChange={({ options, correctOptionIds }) =>
            onChange({ ...step, options, correctOptionId: correctOptionIds[0] ?? '' })
          }
        />
      )}

      {step.type === 'multi-choice' && (
        <ChoiceOptionsEditor
          options={step.options}
          type="multi-choice"
          correctOptionIds={step.correctOptionIds}
          onChange={({ options, correctOptionIds }) => onChange({ ...step, options, correctOptionIds })}
        />
      )}

      {step.type === 'salesforce-mock-timed' && (
        <div className="space-y-2">
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
            rows={3}
            placeholder="รายละเอียดสถานการณ์จำลอง"
            value={step.scenario}
            onChange={(e) => onChange({ ...step, scenario: e.target.value })}
          />
          <div className="rounded-lg border border-surface-variant bg-surface-white p-2">
            <p className="mb-2 text-xs font-semibold text-secondary">
              คำตอบสำหรับปุ่ม "เติมคำตอบอัตโนมัติ (สาธิต)"
            </p>
            <div className="space-y-2">
              <input
                className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-1.5 text-sm text-on-surface"
                placeholder="หัวข้อเคสที่ถูกต้อง"
                value={step.idealCase.subject}
                onChange={(e) => onChange({ ...step, idealCase: { ...step.idealCase, subject: e.target.value } })}
              />
              <textarea
                className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-1.5 text-sm text-on-surface"
                rows={2}
                placeholder="รายละเอียดเคสที่ถูกต้อง"
                value={step.idealCase.description}
                onChange={(e) => onChange({ ...step, idealCase: { ...step.idealCase, description: e.target.value } })}
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <select
                  className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1.5 text-xs text-on-surface"
                  value={step.idealCase.priority}
                  onChange={(e) => onChange({ ...step, idealCase: { ...step.idealCase, priority: e.target.value } })}
                >
                  <option value="">ลำดับความสำคัญ</option>
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
                  <option value="">ประเภทเคส</option>
                  {step.caseTypeOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-outline-variant bg-surface-white px-2 py-1.5 text-xs text-on-surface"
                  value={step.idealCase.accountId}
                  onChange={(e) => onChange({ ...step, idealCase: { ...step.idealCase, accountId: e.target.value } })}
                >
                  <option value="">บัญชี</option>
                  {step.mockAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.merchantName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-surface-variant bg-surface-white p-2">
            <p className="text-xs font-semibold text-secondary">บัญชีร้านค้าจำลอง</p>
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
                  mockAccounts: [...step.mockAccounts, { id: makeId('acc'), merchantName: '', businessType: '' }],
                })
              }
            >
              + เพิ่มบัญชีร้านค้า
            </Button>
          </div>
        </div>
      )}

      {step.type === 'live-chat-mock' && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-secondary">บทสนทนาที่มาก่อน (ลูกค้า/แอดมิน)</p>
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

          <div className="rounded-lg border border-surface-variant bg-surface-white p-2">
            <p className="mb-2 text-xs font-semibold text-secondary">
              คำตอบสำหรับปุ่ม "เติมคำตอบอัตโนมัติ (สาธิต)"
            </p>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-1.5 text-sm text-on-surface"
              rows={2}
              placeholder="ข้อความตอบกลับตัวอย่าง"
              value={step.modelReply}
              onChange={(e) => onChange({ ...step, modelReply: e.target.value })}
            />
          </div>
        </div>
      )}

      {step.type === 'phone-call-mock' && (
        <div className="space-y-2">
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-2 text-sm text-on-surface"
            rows={2}
            placeholder="รายละเอียดสถานการณ์การโทร"
            value={step.scenario}
            onChange={(e) => onChange({ ...step, scenario: e.target.value })}
          />
          <p className="text-xs font-semibold text-secondary">สิ่งที่ผู้โทรเข้าพูด (แต่ละบรรทัด)</p>
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

          <div className="rounded-lg border border-surface-variant bg-surface-white p-2">
            <p className="mb-2 text-xs font-semibold text-secondary">แนวทางคำตอบ (แสดงหลังส่งคำตอบเสียง)</p>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-surface-white px-3 py-1.5 text-sm text-on-surface"
              rows={2}
              placeholder="สิ่งที่คำตอบที่ดีควรมี"
              value={step.modelReplyDescription}
              onChange={(e) => onChange({ ...step, modelReplyDescription: e.target.value })}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
