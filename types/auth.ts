
// User roles
export enum UserRole {
  ADMIN = 'admin',
  CASHIER = 'cashier',
  KITCHEN = 'kitchen'
}

// Permissions
export const PERMISSIONS = {
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_REPORTS: 'VIEW_REPORTS',
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
  CREATE_ORDERS: 'CREATE_ORDERS',
  CANCEL_ORDERS: 'CANCEL_ORDERS',
  MODIFY_ORDERS: 'MODIFY_ORDERS',
  APPLY_DISCOUNTS: 'APPLY_DISCOUNTS',
  CLOSE_REGISTER: 'CLOSE_REGISTER',
  KITCHEN_DISPLAY: 'KITCHEN_DISPLAY',
  ACCESS_SETTINGS: 'ACCESS_SETTINGS',
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
} as const;

export type PermissionId = keyof typeof PERMISSIONS;

export interface Permission {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole | string;
  permissions: Permission[];
  isActive: boolean;
}
