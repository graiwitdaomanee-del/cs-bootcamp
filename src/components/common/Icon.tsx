export function Icon({
  name,
  filled = false,
  className = 'text-[20px]',
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${filled ? 'fill' : ''} ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
