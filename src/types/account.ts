export type Role = 'admin' | 'trainee';

export interface Account {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  avatarColor: string;
}
