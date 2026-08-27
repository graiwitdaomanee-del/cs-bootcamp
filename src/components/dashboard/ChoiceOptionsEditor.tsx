import type { ChoiceOption } from '../../types/step';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { id as makeId } from '../../utils/id';

export function ChoiceOptionsEditor({
  options,
  type,
  correctOptionIds,
  onChange,
}: {
  options: ChoiceOption[];
  type: 'single-choice' | 'multi-choice';
  correctOptionIds: string[];
  onChange: (next: { options: ChoiceOption[]; correctOptionIds: string[] }) => void;
}) {
  function updateLabel(index: number, label: string) {
    onChange({
      options: options.map((o, i) => (i === index ? { ...o, label } : o)),
      correctOptionIds,
    });
  }

  function removeOption(optionId: string) {
    onChange({
      options: options.filter((o) => o.id !== optionId),
      correctOptionIds: correctOptionIds.filter((id) => id !== optionId),
    });
  }

  function addOption() {
    onChange({ options: [...options, { id: makeId('opt'), label: '' }], correctOptionIds });
  }

  function toggleCorrect(optionId: string) {
    if (type === 'single-choice') {
      onChange({ options, correctOptionIds: [optionId] });
    } else {
      const isCorrect = correctOptionIds.includes(optionId);
      const next = isCorrect ? correctOptionIds.filter((id) => id !== optionId) : [...correctOptionIds, optionId];
      onChange({ options, correctOptionIds: next });
    }
  }

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={opt.id} className="flex items-center gap-2">
          <input
            type={type === 'single-choice' ? 'radio' : 'checkbox'}
            className="accent-success-green"
            checked={correctOptionIds.includes(opt.id)}
            onChange={() => toggleCorrect(opt.id)}
          />
          <input
            className="flex-1 rounded-lg border border-outline-variant bg-surface-white px-3 py-1.5 font-sans text-sm text-on-surface focus:border-success-green focus:outline-none"
            placeholder={`ตัวเลือกที่ ${i + 1}`}
            value={opt.label}
            onChange={(e) => updateLabel(i, e.target.value)}
          />
          <Button variant="ghost" className="p-1.5" onClick={() => removeOption(opt.id)}>
            <Icon name="close" className="text-[16px]" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" className="text-xs" onClick={addOption}>
        + เพิ่มตัวเลือก
      </Button>
    </div>
  );
}
