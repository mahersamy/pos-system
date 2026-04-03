import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'main',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'staff',
        loadComponent: () => import('./features/staff/components/staff-list/staff-list').then((m) => m.StaffList),
      },
      {
        path: 'notification',
        loadComponent: () => import('./features/notification/pages/notification-list/notification-list').then((m) => m.NotificationList),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
