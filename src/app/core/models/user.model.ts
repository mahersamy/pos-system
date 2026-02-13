export interface Permission {
  read: boolean;
  write: boolean;
}

export interface UserPermissions {
  [module: string]: Permission;
}

export interface User {
  uid: string;
  email: string;
  role: string | null;
  permissions?: UserPermissions;
}
