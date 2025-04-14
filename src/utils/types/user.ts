import type { UserRow } from '@march1-org/db-template/users';

export type UserResult = Omit<
  UserRow,
  'createdAt' | 'updatedAt' | 'deletedAt'
> & {
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};
