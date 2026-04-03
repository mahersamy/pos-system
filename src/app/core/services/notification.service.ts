import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BACKEND_ROUTE } from '../constants/backend.route';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { GlobalResponse } from '../models/response-global.model';
import { ApiNotification } from '../../features/notification/models/notification.model';
import { NotificationStatus } from '../../features/notification/enums/notification-status.enum';
import { NotificationType } from '../../features/notification/enums/notification.type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _http = inject(HttpClient);
  private readonly _messageService = inject(MessageService);

  /** Signals the latest foreground push notification to any listening component. */
  readonly liveNotification = signal<ApiNotification | null>(null);

  // ─── API Methods ────────────────────────────────────────────────────────────

  /** Fetch the paginated inbox for the current user. */
  getInbox(limit = 5, cursor = ''): Observable<GlobalResponse<ApiNotification[]>> {
    const url = `${environment.apiUrl}${BACKEND_ROUTE.getInbox}?limit=${limit}&cursor=${cursor}`;
    return this._http.get<GlobalResponse<ApiNotification[]>>(url);
  }

  /** Delete a single notification by id. */
  deleteNotification(id: string): Observable<GlobalResponse<void>> {
    const url = `${environment.apiUrl}${BACKEND_ROUTE.deleteNotification}/${id}`;
    return this._http.delete<GlobalResponse<void>>(url);
  }

  // ─── FCM Methods ────────────────────────────────────────────────────────────

  setFcmToken(token: string): void {
    this._http
      .post(environment.apiUrl + BACKEND_ROUTE.addFcmToken, { token })
      .subscribe();
  }

  listenToNotifications(): void {
    if (!isPlatformBrowser(this._platformId)) return;

    isSupported()
      .then(supported => {
        if (!supported) return;

        const messaging = getMessaging(initializeApp(environment.firebaseConfig));

        onMessage(messaging, (payload) => {
          const incoming: ApiNotification = {
            _id: Date.now().toString(),
            title: payload.notification?.title ?? payload.data?.['title'] ?? 'New Notification',
            message: payload.notification?.body  ?? payload.data?.['message'] ?? '',
            type: (payload.data?.['type'] as NotificationType) ?? NotificationType.ANNOUNCEMENT,
            status: (payload.data?.['status'] as NotificationStatus) ?? NotificationStatus.SENT,
            createdAt: new Date().toISOString(),
            metadata: payload.data as Record<string, string>,
          };

          this.liveNotification.set(incoming);

          this._messageService.add({
            severity: 'contrast',
            summary: incoming.title,
            detail: incoming.message,
            life: 5000,
          });
        });
      })
      .catch(error => console.error('Error listening to notifications:', error));
  }

  /** Request FCM permission, retrieve the device token and start listening. */
  async getFcmToken(): Promise<string | void> {
    if (!isPlatformBrowser(this._platformId)) return;

    try {
      const supported = await isSupported();
      if (!supported) {
        console.warn('Firebase Messaging is not supported in this browser.');
        return;
      }

      const messaging = getMessaging(initializeApp(environment.firebaseConfig));
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') return;

      const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const token = await getToken(messaging, {
        vapidKey: environment.firebaseConfig.vapidKey,
        serviceWorkerRegistration: swRegistration,
      });

      this.setFcmToken(token);
      this.listenToNotifications();

      return token;

    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }
}