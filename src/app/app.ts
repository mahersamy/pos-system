import {Component, inject, OnInit, signal} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {NotificationBannerComponent} from "./shared/components/notification-banner/notification-banner.component";
import {ToastModule} from "primeng/toast";
import {AuthService} from "./core/services/auth/auth";
import {TranslationService} from "./core/services/translation/translation";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, NotificationBannerComponent, ToastModule],
    templateUrl: "./app.html",
    styleUrl: "./app.scss",
})
export class App {
    protected readonly title = signal("pos-system");
    private readonly _translationService = inject(TranslationService);
}
