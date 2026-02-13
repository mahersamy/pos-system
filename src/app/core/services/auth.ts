import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  user,
  signOut,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PermissionsService } from './permissions.service';
import { User, UserPermissions } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly permissionsService = inject(PermissionsService);

  // Observable of the authentication state
  user$ = user(this.auth);

  // Signal to hold the current user state
  currentUser = signal<User | null>(null);

  constructor() {
    // Listen to authentication state changes automatically
    this.user$
      .pipe(
        switchMap(async (firebaseUser) => {
          if (firebaseUser) {
            return await this.updateUserState(firebaseUser);
          } else {
            return null;
          }
        }),
      )
      .subscribe((user) => {
        this.currentUser.set(user);
        if (!user) {
          this.permissionsService.setPermissions({});
        }
      });
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.permissionsService.setPermissions({});
        this.router.navigate(['/login']);
      }),
    );
  }

  private async updateUserState(firebaseUser: FirebaseUser): Promise<User> {
    const tokenResult = await firebaseUser.getIdTokenResult();
    const claims = tokenResult.claims;

    // Assuming custom claims structure: { role: string, permissions: UserPermissions }
    const role = (claims['role'] as string) || null;
    const permissions = (claims['permissions'] as UserPermissions) || {};

    this.permissionsService.setPermissions(permissions);

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      role,
      permissions,
    };
  }
}
