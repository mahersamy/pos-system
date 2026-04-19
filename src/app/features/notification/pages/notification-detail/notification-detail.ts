import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiNotification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-detail.html',
  styleUrl: './notification-detail.scss',
})
export class NotificationDetail implements OnInit {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  notification: ApiNotification | null = null;

  ngOnInit() {
    const routeState = this.location.getState() as { data?: ApiNotification };
    if (routeState && routeState.data) {
      this.notification = routeState.data;
    } else {
      this.router.navigate(['/main/notifications']);
    }
  }

  copyToClipboard(text: string | undefined) {
    if (!text) return;
    navigator.clipboard.writeText(text);
  }
}
