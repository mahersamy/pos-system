import {Component, inject, OnInit} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {RouterModule, Router} from "@angular/router";
import {NavItems} from "./models/nav-items";
import {LayoutService} from "../../core/services/layout/layout";

@Component({
    selector: "app-sidebar",
    standalone: true,
    imports: [RouterModule, NgOptimizedImage],
    templateUrl: "./sidebar.component.html",
    styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent implements OnInit {
    layoutService = inject(LayoutService);
    router = inject(Router);

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
        {
            label: "Profile",
            width: 16,
            height: 12,
            alt: "profile",
            src: "/images/sidebar/staff.avif",
            route: "/main/profile",
        },
    ];

    ngOnInit() {
        this.initTitle();
    }

    initTitle() {
        const currentRoute = this.router.url;
        const activeItem = this.navItems.find((item) => currentRoute.includes(item.route));
        if (activeItem) {
            this.layoutService.setTitle(activeItem.label);
        }
    }

    updateTitle(newTitle: string) {
        this.layoutService.setTitle(newTitle);
    }
}
