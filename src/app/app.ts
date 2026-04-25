import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NotificationBannerComponent } from "./shared/components/notification-banner/notification-banner.component";
import { ToastModule } from "primeng/toast";
import { AuthService } from "./core/services/auth/auth";
import { TranslationService } from "./core/services/translation/translation";
import { NotificationService } from "./features/notification/services/notification.service";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, NotificationBannerComponent, ToastModule],
    templateUrl: "./app.html",
    styleUrl: "./app.scss",
})
export class App implements OnInit {

    protected readonly title = signal("pos-system");
    private readonly _translationService = inject(TranslationService);
    private readonly _notificationService = inject(NotificationService);

    ngOnInit(): void {
        this._notificationService.listenToNotifications();
    }


}
