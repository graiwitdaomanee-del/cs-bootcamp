export interface KnowledgeHubEntry {
  id: string;
  title: string;
  body: string;
  tags: string[];
  unlockedByLessonId: string;
}

export type KnowledgeHubEntryInput = Omit<KnowledgeHubEntry, 'id'>;
