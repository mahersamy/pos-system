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
    { label: 'Dashboard', icon: 'dashboard', route: '/main/dashboard' },
    { label: 'Inventory', icon: 'inventory', route: '/main/inventory' },
    { label: 'Orders', icon: 'orders', route: '/main/orders' },
    { label: 'Customers', icon: 'people', route: '/main/customers' },
    { label: 'Staff', icon: 'analytics', route: '/main/staff' },
    { label: 'Settings', icon: 'settings', route: '/main/settings' },
  ];
}
