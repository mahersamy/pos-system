import { NotificationStatus } from "../enums/notification-status.enum";
import { NotificationType } from "../enums/notification.type.enum";

/**
 * Shape returned by the GET /notification (getInbox) API endpoint.
 * These come from the database and always have status, type, _id, etc.
 */
export interface ApiNotification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  sentAt: string;
  metadata?: Record<string, string>;
}

/**
 * Shape used when a foreground Firebase push arrives via onMessage().
 * Firebase does NOT include status or type — they are optional here.
 * When pushed into the notifications list they get defaults.
 */
export interface PushNotification {
  title: string;
  message: string;
  type?: NotificationType;
  status?: NotificationStatus;
  metadata?: Record<string, string>;
}