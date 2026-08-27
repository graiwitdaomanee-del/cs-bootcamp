export type CourseStatus = 'active' | 'wip';

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortName: string;
  description: string;
  icon: string;
  logoUrl?: string;
  status: CourseStatus;
  order: number;
}

export type CourseInput = Omit<Course, 'id'>;
