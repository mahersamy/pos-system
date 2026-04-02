import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PermissionsService } from './permissions.service';
import { User, UserPermissions } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ResponseGlobal } from '../models/response-global.model';

export interface AuthResponse {
  credential: {
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly permissionsService = inject(PermissionsService);
  private readonly platformId = inject(PLATFORM_ID);

  // Signal to hold the current user state
  currentUser = signal<any>({});

  private readonly tokenKey = 'auth_token';


  login(email: string, password: string): Observable<ResponseGlobal<AuthResponse>> {
    const loginUrl = `${environment.apiUrl}/api/v1/auth/login`;
    return this.http
      .post<ResponseGlobal<AuthResponse>>(loginUrl, { email, password })
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  register(email: string, password: string): Observable<ResponseGlobal<AuthResponse>> {
    const registerUrl = `${environment.apiUrl}/api/v1/auth/register`;
    return this.http.post<ResponseGlobal<AuthResponse>>(registerUrl, { email, password })
    .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  // logout(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.removeItem(this.tokenKey);
  //   }
  //   this.currentUser.set(null);
  //   this.permissionsService.setPermissions({});
  //   this.router.navigate(['/login']);
  // }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getLoggedUserProfile(): Observable<ResponseGlobal<User>> {
    const url = `${environment.apiUrl}/api/v1/users/profile`;
    return this.http.get<ResponseGlobal<User>>(url).pipe(tap((response) => {
      this.currentUser.set(response.data);
      this.permissionsService.setPermissions(response.data.permissions || {});
    }));
  }

  private handleAuthResponse(response: ResponseGlobal<AuthResponse>): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, response.data.credential.accessToken);
    }
    this.getLoggedUserProfile();
  }
}
