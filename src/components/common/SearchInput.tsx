import { Icon } from './Icon';

export function SearchInput({
  value,
  onChange,
  placeholder = 'ค้นหา...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
        <Icon name="search" className="text-[18px]" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-outline-variant bg-surface-white py-2 pl-9 pr-3 font-sans text-sm text-on-surface placeholder:text-secondary focus:border-success-green focus:outline-none focus:ring-2 focus:ring-success-green/20"
      />
    </div>
  );
}
