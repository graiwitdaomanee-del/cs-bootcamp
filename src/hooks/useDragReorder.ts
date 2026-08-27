import { useRef } from 'react';
import type { DragEvent, HTMLAttributes } from 'react';

/**
 * Splice-based drag-and-drop reordering for a plain array (as opposed to swapping two `order` fields).
 * `dragHandleProps` goes on the small grab-handle icon (initiates the drag); `dropZoneProps` goes on
 * the whole row/card so dropping anywhere on the target row — not just its handle — completes the move.
 */
export function useDragReorder<T>(items: T[], onReorder: (next: T[]) => void) {
  const dragIndexRef = useRef<number | null>(null);

  function dragHandleProps(index: number): HTMLAttributes<HTMLSpanElement> {
    return {
      draggable: true,
      onDragStart: () => {
        dragIndexRef.current = index;
      },
    };
  }

  function dropZoneProps(index: number): HTMLAttributes<HTMLDivElement> {
    return {
      onDragOver: (e: DragEvent) => e.preventDefault(),
      onDrop: () => {
        const fromIndex = dragIndexRef.current;
        dragIndexRef.current = null;
        if (fromIndex === null || fromIndex === index) return;
        const next = [...items];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(index, 0, moved);
        onReorder(next);
      },
    };
  }

  return { dragHandleProps, dropZoneProps };
}
