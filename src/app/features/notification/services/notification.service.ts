import { Injectable, PLATFORM_ID, inject, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { ApiNotification } from "../models/notification.model";
import { GlobalResponse, GlobalResponseWithCursor } from "../../../core/models/response-global.model";
import { BACKEND_ROUTE } from "../../../core/constants/backend.route";
import { environment } from "../../../../environments/environment";
import { NotificationType } from "../enums/notification.type.enum";
import { NotificationStatus } from "../enums/notification-status.enum";

@Injectable({
    providedIn: "root",
})
export class NotificationService {
    private readonly _platformId = inject(PLATFORM_ID);
    private readonly _http = inject(HttpClient);
    private readonly _messageService = inject(MessageService);

    /** Signals the latest foreground push notification to any listening component. */
    readonly liveNotification = signal<ApiNotification | null>(null);

    // ─── API Methods ────────────────────────────────────────────────────────────

    /** Fetch the paginated inbox for the current user. */
    getInbox(limit = 5, cursor = ""): Observable<GlobalResponseWithCursor<ApiNotification[]>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.notification.inbox}?limit=${limit}&cursor=${cursor}`;
        return this._http.get<GlobalResponseWithCursor<ApiNotification[]>>(url);
    }

    /** Delete a single notification by id. */
    deleteNotification(id: string): Observable<GlobalResponse<void>> {
        const url = `${environment.apiUrl}${BACKEND_ROUTE.notification.base}/${id}`;
        return this._http.delete<GlobalResponse<void>>(url);
    }

    // ─── FCM Methods ────────────────────────────────────────────────────────────

    setFcmToken(token: string): void {
        this._http
            .post(environment.apiUrl + BACKEND_ROUTE.notification.addFcmToken, { token })
            .subscribe();
    }

    listenToNotifications(): void {
        if (!isPlatformBrowser(this._platformId)) return;

        isSupported()
            .then((supported) => {
                if (!supported) return;

                const messaging = getMessaging(initializeApp(environment.firebaseConfig));

                onMessage(messaging, (payload) => {
                    const incoming: ApiNotification = {
                        _id: Date.now().toString(),
                        title:
                            payload.notification?.title ??
                            payload.data?.["title"] ??
                            "New Notification",
                        message: payload.notification?.body ?? payload.data?.["message"] ?? "",
                        type:
                            (payload.data?.["type"] as NotificationType) ??
                            NotificationType.ANNOUNCEMENT,
                        status:
                            (payload.data?.["status"] as NotificationStatus) ??
                            NotificationStatus.SENT,
                        sentAt: new Date().toISOString(),
                        metadata: payload.data as Record<string, string>,
                    };

                    this.liveNotification.set(incoming);

                    console.log(incoming);

                    this._messageService.add({
                        severity: "contrast",
                        summary: incoming.title,
                        detail: incoming.message,
                        life: 5000,
                    });
                });
            })
            .catch((error) => console.error("Error listening to notifications:", error));
    }

    /** Request FCM permission, retrieve the device token and start listening. */
    async getFcmToken(): Promise<string | void> {
        if (!isPlatformBrowser(this._platformId)) return;

        try {
            const supported = await isSupported();
            if (!supported) {
                console.warn("Firebase Messaging is not supported in this browser.");
                return;
            }

            const messaging = getMessaging(initializeApp(environment.firebaseConfig));
            const permission = await Notification.requestPermission();

            if (permission !== "granted") return;

            const swRegistration = await navigator.serviceWorker.register(
                "/firebase-messaging-sw.js"
            );

            // Wait for service worker to be ready and active
            await navigator.serviceWorker.ready;

            const token = await getToken(messaging, {
                vapidKey: environment.firebaseConfig.vapidKey,
                serviceWorkerRegistration: swRegistration,
            });

            this.setFcmToken(token);
            this.listenToNotifications();

            return token;
        } catch (error) {
            console.error("Error getting FCM token:", error);
        }
    }
}
