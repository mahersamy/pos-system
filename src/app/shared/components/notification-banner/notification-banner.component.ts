import {Component, inject, signal, effect} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NotificationService} from "../../../features/notification/services/notification.service";
import {AuthService} from "../../../core/services/auth/auth";

@Component({
    selector: "app-notification-banner",
    imports: [TranslateModule],
    templateUrl: "./notification-banner.component.html",
    styleUrl: "./notification-banner.component.scss",
})
export class NotificationBannerComponent {
    private readonly _notificationService = inject(NotificationService);
    private readonly _authService = inject(AuthService);
    public showBanner = signal(false);
    private _hasPrompted = false;
    private _showTimeout: any;
    private _hideTimeout: any;

    constructor() {
        effect(() => {
            const user = this._authService.currentUser();
            if (user && !this._hasPrompted) {
                this._hasPrompted = true;
                if (typeof Notification !== "undefined" && Notification.permission === "default") {
                    // Show banner 5 seconds after login/dashboard load
                    this._showTimeout = setTimeout(() => {
                        this.showBanner.set(true);

                        // Auto-hide after 30 seconds
                        this._hideTimeout = setTimeout(() => {
                            this.showBanner.set(false);
                        }, 30000);
                    }, 5000);
                } else if (
                    typeof Notification !== "undefined" &&
                    Notification.permission === "granted"
                ) {
                    // If already granted, safely get the token silently.
                    this._notificationService.getFcmToken();
                }
            } else if (!user) {
                clearTimeout(this._showTimeout);
                clearTimeout(this._hideTimeout);
                this.showBanner.set(false);
                this._hasPrompted = false;
            }
        });
    }

    /**
     * Handles the 'Allow' action by hiding the banner and requesting the FCM push token.
     */
    async onAllow() {
        clearTimeout(this._hideTimeout);
        this.showBanner.set(false); // Hide banner immediately
        await this._notificationService.getFcmToken();
    }

    /**
     * Handles the 'Dismiss' action by hiding the banner without requesting permissions.
     */
    onDismiss() {
        clearTimeout(this._hideTimeout);
        this.showBanner.set(false);
    }
}
