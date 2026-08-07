import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PageChangeEvent {
  page: number;
  limit: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  currentPage = input(1);
  totalPages = input(1);
  total = input(0);
  limit = input(10);

  pageChange = output<PageChangeEvent>();

  readonly limitOptions = [10, 25, 50, 100];

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | '...')[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  // ─── Getters for display ──────────────────────────────────────────────────
  fromEntry = computed(() => (this.currentPage() - 1) * this.limit() + 1);
  
  toEntry = computed(() => Math.min(this.currentPage() * this.limit(), this.total()));

  // ─── Actions ──────────────────────────────────────────────────────────────
  goToPage(page: number | '...') {
    if (page === '...' || page === this.currentPage()) return;
    this.pageChange.emit({ page: page as number, limit: this.limit() });
  }

  prev() {
    if (this.currentPage() > 1) {
      this.pageChange.emit({ page: this.currentPage() - 1, limit: this.limit() });
    }
  }

  next() {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit({ page: this.currentPage() + 1, limit: this.limit() });
    }
  }

  onLimitChange(newLimit: number) {
    this.pageChange.emit({ page: 1, limit: Number(newLimit) });
  }

  isEllipsis(page: number | '...'): boolean {
    return page === '...';
  }
}