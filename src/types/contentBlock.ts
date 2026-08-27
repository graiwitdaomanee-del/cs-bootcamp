export type ContentBlock =
  | { id: string; type: 'text'; text: string }
  | { id: string; type: 'image'; caption: string }
  | { id: string; type: 'video'; caption: string };
