import {Component, computed, effect, inject, OnInit, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NotificationService} from "../../services/notification.service";
import {ApiNotification} from "../../models/notification.model";
import {NotificationCard} from "../../components/notification-card/notification-card";
import {TranslateModule} from "@ngx-translate/core";
import {Loading} from "../../../../shared/directives/loading/loading";
import {SkeletonModule} from "primeng/skeleton";

@Component({
    selector: "app-notification-list",
    imports: [CommonModule, NotificationCard, TranslateModule, Loading, SkeletonModule],
    templateUrl: "./notification-list.html",
    styleUrl: "./notification-list.scss",
})
export class NotificationList implements OnInit {
    private readonly _notificationService = inject(NotificationService);

    readonly notifications = signal<ApiNotification[]>([]);
    readonly activeTab = signal<"all" | "unread">("all");

    cursor = signal<string>("");
    hasMore = signal<boolean>(true);
    isLoading = signal<boolean>(false);

    readonly filteredNotifications = computed(() => {
        const list = this.notifications();
        return this.activeTab() === "all" ? list : list.filter((n) => n.status !== "read");
    });

    readonly unreadCount = computed(
        () => this.notifications().filter((n) => n.status !== "read").length
    );

    constructor() {
        // Prepend live push notifications to the top of the list
        effect(() => {
            const live = this._notificationService.liveNotification();
            if (live) {
                this.notifications.update((current) => [live, ...current]);
            }
        });
    }

    ngOnInit(): void {
        this.loadNotifications();
    }

    /**
     * Fetches the inbox notifications using the current cursor for pagination.
     * Updates the notifications list, next cursor, and 'hasMore' flag.
     */
    loadNotifications(): void {
        this.isLoading.set(true);
        this._notificationService.getInbox(20, this.cursor()).subscribe({
            next: (response) => {
                this.notifications.set([...this.notifications(), ...response.data]);
                this.cursor.set(response.nextCursor);
                this.hasMore.set(response.hasMore);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
            },
        });
    }

    /**
     * Optimistically marks all locally loaded notifications as read.
     */
    markAllAsRead(): void {
        this.notifications.update((current) =>
            current.map((n) => ({...n, status: "read" as ApiNotification["status"]}))
        );
    }

    /**
     * Performance optimization: tracks items in the *ngFor or @for loop by their unique ID.
     * @param index Array index
     * @param item Notification object
     * @returns {string} The unique identifier of the notification
     */
    trackById(index: number, item: ApiNotification): string {
        return item._id;
    }

    /**
     * Optimistic delete — remove from UI immediately,
     * then send the HTTP request in the background.
     * If the request fails the global error interceptor shows a toast.
     */
    deleteNotification(notification: ApiNotification): void {
        // 1. Remove from UI right away (optimistic)
        this.notifications.update((current) => current.filter((n) => n._id !== notification._id));

        // 2. Send request in background — no need to wait
        this._notificationService.deleteNotification(notification._id).subscribe();
    }
}
