import {Component, computed, input, OnInit, output, inject} from "@angular/core";
import {Router} from "@angular/router";
import {ApiNotification} from "../../models/notification.model";
import {CommonModule, DatePipe, KeyValuePipe} from "@angular/common";
import {NotificationService} from "../../services/notification.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: "app-notification-card",
    imports: [CommonModule, DatePipe, KeyValuePipe, TranslateModule],
    templateUrl: "./notification-card.html",
    styleUrl: "./notification-card.scss",
})
export class NotificationCard {
    private readonly router = inject(Router);
    private readonly _notificationService = inject(NotificationService);

    notification = input.required<ApiNotification>();

    /** Emits the notification to delete — parent decides what to do with it */
    delete = output<ApiNotification>();

    /**
     * Navigates to the detailed view of the notification, passing its data via router state.
     */
    goToDetail() {
        this.router.navigate(["/main/notifications", this.notification()._id], {
            state: {data: this.notification()},
        });
    }

    /**
     * Returns the appropriate FontAwesome icon class based on the notification type.
     * @returns {string} The CSS class for the icon.
     */
    getIconClass(): string {
        const type = this.notification().type?.toLowerCase();
        if (type === "order") return "fa-solid fa-cart-shopping";
        if (type === "payment") return "fa-solid fa-credit-card";
        if (type === "system") return "fa-solid fa-gear";
        return "fa-solid fa-bell";
    }

    /**
     * Computes the number of metadata keys attached to the notification.
     */
    metadataLength = computed(() => {
        const metadata = this.notification().metadata;
        return metadata ? Object.keys(metadata).length : 0;
    });
}
