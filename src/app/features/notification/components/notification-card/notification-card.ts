import { Component, computed, input, OnInit, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiNotification } from '../../models/notification.model';
import { CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-notification-card',
  imports: [CommonModule, DatePipe, KeyValuePipe],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.scss',
})
export class NotificationCard {
  private readonly router = inject(Router);
  private readonly _notificationService = inject(NotificationService);

  notification = input.required<ApiNotification>();

  /** Emits the notification to delete — parent decides what to do with it */
  delete = output<ApiNotification>();

  goToDetail() {
    this._notificationService.markAsRead([this.notification()._id]).subscribe({
      next: () => {
        this.router.navigate(['/main/notifications', this.notification()._id], {
          state: { data: this.notification() }
        });
      }
    });
  }

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
