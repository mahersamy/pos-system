import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { ApiNotification } from '../../models/notification.model';
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
    this._notificationService.getInbox().subscribe({
      next: (response) => this.notifications.set(response.data),
    });
  }

  markAllAsRead(): void {
    this.notifications.update(current =>
      current.map(n => ({ ...n, status: 'read' as ApiNotification['status'] }))
    );
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
