import { Injectable, signal, computed } from '@angular/core';
import { User, UserPermissions } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private userPermissions = signal<UserPermissions>({});

  // Signal for accessing current permissions
  permissions = this.userPermissions.asReadonly();

  constructor() {}

  /**
   * Sets the user's permissions.
   * @param permissions The object containing read/write permissions for each module.
   */
  setPermissions(permissions: UserPermissions | undefined): void {
    if (permissions) {
      this.userPermissions.set(permissions);
    } else {
      this.userPermissions.set({});
    }
  }

  /**
   * Checks if the user has read access to a specific module.
   * @param module The name of the module (e.g., 'orders', 'users').
   * @returns boolean
   */
  canRead(module: string): boolean {
    const perm = this.userPermissions()[module];
    return perm?.read || false;
  }

  /**
   * Checks if the user has write access to a specific module.
   * @param module The name of the module.
   * @returns boolean
   */
  canWrite(module: string): boolean {
    const perm = this.userPermissions()[module];
    return perm?.write || false;
  }

  /**
   * Checks if the user has administrative privileges (example logic).
   * This might need adjustment based on your specific role implementation.
   */
  hasRole(role: string, userRole: string | null): boolean {
    return userRole === role;
  }
}
