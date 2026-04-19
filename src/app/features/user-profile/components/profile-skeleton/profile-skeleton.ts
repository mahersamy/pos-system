import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-profile-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './profile-skeleton.html',
  styleUrl: './profile-skeleton.scss'
})
export class ProfileSkeleton {
  @Input() loading: boolean = true;
}
