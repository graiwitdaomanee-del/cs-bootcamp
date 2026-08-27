import type { Account } from '../../types/account';

export const ACCOUNT_IDS = {
  admin: 'admin-nueng',
  ploy: 'trainee-ploy',
  beam: 'trainee-beam',
  nan: 'trainee-nan',
  ohm: 'trainee-ohm',
  fah: 'trainee-fah',
  gap: 'trainee-gap',
} as const;

export const seedAccounts: Account[] = [
  {
    id: ACCOUNT_IDS.admin,
    name: 'Nueng',
    email: 'nueng@lmwn.com',
    role: 'admin',
    title: 'ผู้ดูแลระบบ Training CS',
    avatarColor: '#06c755',
  },
  {
    id: ACCOUNT_IDS.ploy,
    name: 'Ploy',
    email: 'ploy@lmwn.com',
    role: 'trainee',
    title: 'พนักงาน Training CS',
    avatarColor: '#3a9c89',
  },
  {
    id: ACCOUNT_IDS.beam,
    name: 'Beam',
    email: 'beam@lmwn.com',
    role: 'trainee',
    title: 'พนักงาน Training CS',
    avatarColor: '#f4743b',
  },
  {
    id: ACCOUNT_IDS.nan,
    name: 'Nan',
    email: 'nan@lmwn.com',
    role: 'trainee',
    title: 'พนักงาน Training CS',
    avatarColor: '#8b5cf6',
  },
  {
    id: ACCOUNT_IDS.ohm,
    name: 'Ohm',
    email: 'ohm@lmwn.com',
    role: 'trainee',
    title: 'พนักงาน Training CS',
    avatarColor: '#0ea5e9',
  },
  {
    id: ACCOUNT_IDS.fah,
    name: 'Fah',
    email: 'fah@lmwn.com',
    role: 'trainee',
    title: 'พนักงาน Training CS',
    avatarColor: '#e879f9',
  },
  {
    id: ACCOUNT_IDS.gap,
    name: 'Gap',
    email: 'gap@lmwn.com',
    role: 'trainee',
    title: 'พนักงาน Training CS',
    avatarColor: '#eab308',
  },
];
