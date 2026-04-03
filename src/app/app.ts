import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationBannerComponent } from './shared/ui/notification-banner/notification-banner.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationBannerComponent,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('pos-system');
  constructor() {}
}
