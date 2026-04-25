import { Component, inject, OnInit, signal, ViewEncapsulation, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs/operators";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { NavItems } from "./models/nav-items";
import { LayoutService } from "../../core/services/layout/layout";
import { AuthService } from "../../core/services/auth/auth";
import { DrawerModule } from "primeng/drawer";
import { ButtonModule } from "primeng/button";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-sidebar",
    imports: [CommonModule, RouterModule, NgOptimizedImage, DrawerModule, ButtonModule, TranslateModule],
    templateUrl: "./sidebar.html",
    styleUrl: "./sidebar.scss",
    encapsulation: ViewEncapsulation.None
})
export class Sidebar implements OnInit {
    private readonly _layoutService = inject(LayoutService);
    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);
    private readonly _destroyRef = inject(DestroyRef);

    /** Controls the mobile drawer visibility */
    drawerVisible = signal(false);

    /** Called by the header hamburger button to open the mobile drawer */
    openDrawer() {
        this.drawerVisible.set(true);
    }

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

        // Listen for router events (e.g. Back button) and reactively update the title
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(() => {
                this.initTitle();
            });
    }

    /**
     * Bootstraps the default title based on the active route matching the navigation list
     */
    initTitle() {
        // Strip out query params and fragments to ensure accurate matching
        const currentPath = this._router.url.split('?')[0].split('#')[0];
        
        // Find the most specific match (longest route)
        // Sort routes by length descending so '/main/menu' matches before '/main'
        const sortedItems = [...this.navItems].sort((a, b) => b.route.length - a.route.length);
        const activeItem = sortedItems.find((item) => currentPath.includes(item.route));
        
        if (activeItem) {
            this._layoutService.setTitle(activeItem.label);
        }
    }

    /**
     * Executes the secure logout protocol via the authentication service
     */
    logout() {
        this._authService.logout();
    }
}
