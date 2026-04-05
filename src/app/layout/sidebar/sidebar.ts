import {Component, inject, OnInit} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {RouterModule, Router} from "@angular/router";
import {NavItems} from "./models/nav-items";
import {LayoutService} from "../../core/services/layout/layout";
import {AuthService} from "../../core/services/auth/auth";

@Component({
    selector: "app-sidebar",
    imports: [RouterModule, NgOptimizedImage],
    templateUrl: "./sidebar.html",
    styleUrl: "./sidebar.scss",
})
export class Sidebar implements OnInit {
    private readonly _layoutService = inject(LayoutService);
    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);

    /** Main navigation configuration for the sidebar menu */
    navItems: NavItems[] = [
        {
            label: "Dashboard",
            width: 13,
            height: 13,
            alt: "dashboard",
            src: "/images/sidebar/dashboard.avif",
            route: "/main",
        },
        {
            label: "Menu",
            width: 12,
            height: 14,
            alt: "menu",
            src: "/images/sidebar/menu.avif",
            route: "/main/menu",
        },
        {
            label: "Staff",
            width: 16,
            height: 12,
            alt: "staff",
            src: "/images/sidebar/staff.avif",
            route: "/main/staff",
        },
        {
            label: "Inventory",
            width: 16,
            height: 16,
            alt: "inventory",
            src: "/images/sidebar/inventory.avif",
            route: "/inventory",
        },
        {
            label: "Reports",
            width: 10,
            height: 13,
            alt: "reports",
            src: "/images/sidebar/reports.avif",
            route: "/reports",
        },
        {
            label: "Orders",
            width: 14,
            height: 14,
            alt: "orders",
            src: "/images/sidebar/orders.avif",
            route: "/orders",
        },
        {
            label: "Reservation",
            width: 14,
            height: 14,
            alt: "reservation",
            src: "/images/sidebar/reservation.avif",
            route: "/reservation",
        },
    ];

    ngOnInit() {
        this.initTitle();
    }

    /**
     * Bootstraps the default title based on the active route matching the navigation list
     */
    initTitle() {
        const currentRoute = this._router.url;
        const activeItem = this.navItems.find((item) => currentRoute.includes(item.route));
        if (activeItem) {
            this._layoutService.setTitle(activeItem.label);
        }
    }

    /**
     * Broadcasts a layout title update dynamically directly triggered from the sidebar
     * @param {string} newTitle - The newly selected target view string identifier
     */
    updateTitle(newTitle: string) {
        this._layoutService.setTitle(newTitle);
    }

    /**
     * Executes the secure logout protocol via the authentication service
     */
    logout() {
        this._authService.logout();
    }
}
