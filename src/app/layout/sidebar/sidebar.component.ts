import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItems } from './models/nav-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navItems: NavItems[] = [
    {
      label: 'Dashboard',
      width: 13,
      height: 13,
      alt: 'dashboard',
      src: '/images/sidebar/dashboard.avif',
      route: '/main',
    },
    {
      label: 'Menu',
      width: 12,
      height: 14,
      alt: 'menu',
      src: '/images/sidebar/menu.avif',
      route: '/menu',
    },
    {
      label: 'Staff',
      width: 16,
      height: 12,
      alt: 'staff',
      src: '/images/sidebar/staff.avif',
      route: '/staff',
    },
    {
      label: 'Inventory',
      width: 16,
      height: 16,
      alt: 'inventory',
      src: '/images/sidebar/inventory.avif',
      route: '/inventory',
    },
    {
      label: 'Reports',
      width: 10,
      height: 13,
      alt: 'reports',
      src: '/images/sidebar/reports.avif',
      route: '/reports',
    },
    {
      label: 'Orders',
      width: 14,
      height: 14,
      alt: 'orders',
      src: '/images/sidebar/orders.avif',
      route: '/orders',
    },
    {
      label: 'Reservation',
      width: 14,
      height: 14,
      alt: 'reservation',
      src: '/images/sidebar/reservation.avif',
      route: '/reservation',
    },
    {
      label: 'Profile',
      width: 16,
      height: 12,
      alt: 'profile',
      src: '/images/sidebar/staff.avif',
      route: '/profile',
    },
  ];
}
