import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-profile-skeleton',
  imports: [CommonModule, SkeletonModule],
  templateUrl: './profile-skeleton.html',
  styleUrl: './profile-skeleton.scss'
})
export class ProfileSkeleton {
  loading = input<boolean>(true);
}
