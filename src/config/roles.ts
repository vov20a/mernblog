export type RolesType = {
  User: 'User';
  Author: 'Author';
  Admin: 'Admin';
};

export const ROLES: RolesType = {
  User: 'User',
  Author: 'Author',
  Admin: 'Admin',
} as const;
