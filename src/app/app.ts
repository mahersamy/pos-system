import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationBannerComponent } from './shared/ui/notification-banner/notification-banner.component';
import { ToastModule } from 'primeng/toast';
import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationBannerComponent, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  protected readonly title = signal('pos-system');
  constructor() { }
  protected readonly title = signal("pos-system");
}
