import { Component, inject, OnInit, signal, ViewEncapsulation, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs/operators";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { DrawerModule } from "primeng/drawer";
import { ButtonModule } from "primeng/button";

import { NavItem } from "./models/nav-item.interface";
import { LayoutService } from "../../core/services/layout/layout";
import { AuthService } from "../../core/services/auth/auth";
import { routes } from "../../app.routes";
import { extractSidebarItems } from "../../core/utils/extract-sidebar-items.util";

@Component({
    selector: "app-sidebar",
    imports: [CommonModule, RouterModule, NgOptimizedImage, TranslateModule, DrawerModule, ButtonModule],
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

    /**
     * Sidebar navigation items derived automatically from the route tree.
     * Any route with `data.sidebar === true` appears here — no manual editing needed.
     * To add a new feature, set `sidebar: true` in its route `data` object.
     */
    navItems: NavItem[] = extractSidebarItems(routes);

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
     * Bootstraps the default title based on the active route matching the navigation list.
     * Falls back to route `data.title` when available via Angular Router (future enhancement).
     */
    initTitle() {
        // Strip out query params and fragments to ensure accurate matching
        const currentPath = this._router.url.split("?")[0].split("#")[0];

        // Find the most specific match (longest route)
        // Sort routes by length descending so '/main/staff' matches before '/main'
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
