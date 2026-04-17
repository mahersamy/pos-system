import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { ApiNotification } from '../../models/notification.model';
import { NotificationType } from '../../enums/notification.type.enum';
import { NotificationStatus } from '../../enums/notification-status.enum';
import { NotificationCard } from '../../components/notification-card/notification-card';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, NotificationCard],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
})
export class NotificationList implements OnInit {
  private readonly _notificationService = inject(NotificationService);

  readonly notifications = signal<ApiNotification[]>([]);
  readonly activeTab = signal<'all' | 'unread'>('all');

  cursor = signal<string>('');
  hasMore = signal<boolean>(true);
  loading = signal<boolean>(false);

  readonly filteredNotifications = computed(() => {
    const list = this.notifications();
    return this.activeTab() === 'all'
      ? list
      : list.filter(n => n.status !== 'read');
  });

  readonly unreadCount = computed(() =>
    this.notifications().filter(n => n.status !== 'read').length
  );

  constructor() {
    // Prepend live push notifications to the top of the list
    effect(() => {
      const live = this._notificationService.liveNotification();
      if (live) {
        this.notifications.update(current => [live, ...current]);
      }
    });
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this._notificationService.getInbox(20, this.cursor()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.notifications.set([...this.notifications(), ...response.data]);
        this.cursor.set(response.nextCursor);
        this.hasMore.set(response.hasMore);
      },
    });
  }

  markAllAsRead(): void {
    this.loading.set(true);
    this._notificationService.markAsRead(this.notifications().map(n => n._id)).subscribe({
      next: () => {
        this.loading.set(false);
        this.notifications.set(this.notifications().map(n => ({ ...n, status: 'read' as ApiNotification['status'] })));
      }
    });
  }

  /**
   * Optimistic delete — remove from UI immediately,
   * then send the HTTP request in the background.
   * If the request fails the global error interceptor shows a toast.
   */
  deleteNotification(notification: ApiNotification): void {
    // 1. Remove from UI right away (optimistic)
    this.notifications.update(current =>
      current.filter(n => n._id !== notification._id)
    );

    // 2. Send request in background — no need to wait
    this._notificationService.deleteNotification(notification._id).subscribe();
  }
}
