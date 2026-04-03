import { Component, computed, input, output } from '@angular/core';
import { ApiNotification } from '../../models/notification.model';
import { CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
@Component({
  selector: 'app-notification-card',
  imports: [CommonModule, DatePipe, KeyValuePipe],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.scss',
})
export class NotificationCard {
  notification = input.required<ApiNotification>();

  /** Emits the notification to delete — parent decides what to do with it */
  delete = output<ApiNotification>();

  getIconClass(): string {
    const type = this.notification().type?.toLowerCase();
    if (type === 'order') return 'fa-solid fa-cart-shopping';
    if (type === 'payment') return 'fa-solid fa-credit-card';
    if (type === 'system') return 'fa-solid fa-gear';
    return 'fa-solid fa-bell';
  }

  metadataLength = computed(() => {
    const metadata = this.notification().metadata;
    return metadata ? Object.keys(metadata).length : 0;
  });
}
