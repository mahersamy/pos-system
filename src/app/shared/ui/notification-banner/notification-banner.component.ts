import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss'
})
export class NotificationBannerComponent implements OnInit {
  private readonly _notificationService = inject(NotificationService);
  public showBanner = signal(false);

  ngOnInit() {
    // Only show the banner if we haven't asked yet (permission is 'default')
    if (Notification && Notification.permission === 'default') {
      this.showBanner.set(true);
    } else if (Notification && Notification.permission === 'granted') {
      // If already granted, safely get the token silently.
      this._notificationService.getFcmToken();
    }
  }

  async onAllow() {
    this.showBanner.set(false); // Hide banner immediately
    await this._notificationService.getFcmToken();
  }

  onDismiss() {
    this.showBanner.set(false);
  }
}
