import {Component, OnInit, inject, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {ApiNotification} from "../../models/notification.model";

@Component({
    selector: "app-notification-detail",
    imports: [CommonModule, TranslateModule],
    templateUrl: "./notification-detail.html",
    styleUrl: "./notification-detail.scss",
})
export class NotificationDetail implements OnInit {
    private readonly router = inject(Router);
    private readonly location = inject(Location);

    notification = signal<ApiNotification | null>(null);

    ngOnInit() {
        const routeState = this.location.getState() as {data?: ApiNotification};
        if (routeState && routeState.data) {
            this.notification.set(routeState.data);
        } else {
            this.router.navigate(["/main/notifications"]);
        }
    }

    copyToClipboard(text: string | undefined) {
        if (!text) return;
        navigator.clipboard.writeText(text);
    }
}
