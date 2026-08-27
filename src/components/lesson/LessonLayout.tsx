import type { ReactNode } from 'react';

export function LessonLayout({
  topLeft,
  bottomLeft,
  right,
}: {
  topLeft: ReactNode;
  bottomLeft: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:h-[calc(100vh-9rem)] lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="order-1 overflow-y-auto rounded-xl border border-surface-variant bg-surface-white p-5 shadow-ambient lg:order-none lg:col-start-1 lg:row-start-1">
        {topLeft}
      </div>
      <div className="order-3 overflow-hidden rounded-xl border border-surface-variant bg-surface-white p-5 shadow-ambient lg:order-none lg:col-start-1 lg:row-start-2">
        {bottomLeft}
      </div>
      <div className="order-2 overflow-y-auto rounded-xl border border-surface-variant bg-surface-white p-5 shadow-ambient lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {right}
      </div>
    </div>
  );
}
