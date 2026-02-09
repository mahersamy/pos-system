import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Inventory', icon: 'inventory', route: '/inventory' },
    { label: 'Orders', icon: 'orders', route: '/orders' },
    { label: 'Customers', icon: 'people', route: '/customers' },
    { label: 'Reports', icon: 'analytics', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];
}
