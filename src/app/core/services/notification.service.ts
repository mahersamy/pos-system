import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BACKEND_ROUTE } from '../constants/backend.route';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _platformId = inject(PLATFORM_ID);
  private _httpService = inject(HttpClient);

  setFcmToken(token: string) {
    this._httpService.post(environment.apiUrl+BACKEND_ROUTE.addFcmToken, { token }).subscribe({
      next: () => {
        console.log('FCM Token set successfully');
      },
      error: (error) => {
        console.error('Error setting FCM Token', error);
      }
    });
  }

  listenToNotifications() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    isSupported().then(supported => {
      if (!supported) {
        console.warn('Firebase Messaging is not supported in this browser.');
        return;
      }

      const app = initializeApp(environment.firebaseConfig);
      const messaging = getMessaging(app);

      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // TODO: Handle the foreground notification here (e.g., show a toast or alert)
      });
    }).catch(error => {
      console.error('Error listening to notifications', error);
    });
  }

  async getFcmToken(): Promise<string | void> {
    // 1. Prevent execution on the SSR server
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    try {
      // 2. Ensure the browser supports Firebase Messaging
      const supported = await isSupported();
      if (!supported) {
        console.warn('Firebase Messaging is not supported in this browser.');
        return;
      }
      

      // 3. Initialize lazily so we don't crash the server during class instantiation
      const app = initializeApp(environment.firebaseConfig);
      const messaging = getMessaging(app);

      // 4. Request Permission
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        console.log('Permission denied');
        return;
      }

      // 5. Register SW to bypass auto-registration SSR bug
      const swRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

      const token = await getToken(messaging, {
        vapidKey: environment.firebaseConfig.vapidKey,
        serviceWorkerRegistration: swRegistration
      });

      this.setFcmToken(token);

      console.log('FCM Token:', token);
      return token;

    } catch (error) {
      console.error('Error getting token', error);
    }
  }
}