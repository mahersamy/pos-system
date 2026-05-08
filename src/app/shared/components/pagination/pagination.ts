// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-pagination',
// //   imports: [],
// //   templateUrl: './pagination.html',
// //   styleUrl: './pagination.scss',
// // })
// // export class Pagination {

// // }

// import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// export interface PageChangeEvent {
//   page: number;
//   limit: number;
// }

// @Component({
//   selector: 'app-pagination',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './pagination.html',
//   styleUrl: './pagination.scss',
// })
// export class Pagination implements OnChanges {
//   @Input() currentPage: number = 1;
//   @Input() totalPages: number = 1;
//   @Input() total: number = 0;
//   @Input() limit: number = 10;

//   @Output() pageChange = new EventEmitter<PageChangeEvent>();

//   readonly limitOptions = [10, 25, 50, 100];
//   pages: (number | '...')[] = [];

//   ngOnChanges() {
//     this.buildPages();
//   }

//   // ─── Build page number array with ellipsis ────────────────────────────────
//   buildPages() {
//     const total = this.totalPages;
//     const current = this.currentPage;
//     const pages: (number | '...')[] = [];

//     if (total <= 7) {
//       for (let i = 1; i <= total; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       if (current > 3) pages.push('...');
//       const start = Math.max(2, current - 1);
//       const end = Math.min(total - 1, current + 1);
//       for (let i = start; i <= end; i++) pages.push(i);
//       if (current < total - 2) pages.push('...');
//       pages.push(total);
//     }

//     this.pages = pages;
//   }

//   // ─── Getters for display ──────────────────────────────────────────────────
//   get fromEntry(): number {
//     return (this.currentPage - 1) * this.limit + 1;
//   }

//   get toEntry(): number {
//     return Math.min(this.currentPage * this.limit, this.total);
//   }

//   // ─── Actions ──────────────────────────────────────────────────────────────
//   goToPage(page: number | '...') {
//     if (page === '...' || page === this.currentPage) return;
//     this.pageChange.emit({ page: page as number, limit: this.limit });
//   }

//   prev() {
//     if (this.currentPage > 1) {
//       this.pageChange.emit({ page: this.currentPage - 1, limit: this.limit });
//     }
//   }

//   next() {
//     if (this.currentPage < this.totalPages) {
//       this.pageChange.emit({ page: this.currentPage + 1, limit: this.limit });
//     }
//   }

//   onLimitChange(newLimit: number) {
//     this.pageChange.emit({ page: 1, limit: Number(newLimit) });
//   }

//   isEllipsis(page: number | '...'): boolean {
//     return page === '...';
//   }
// }



import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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
export class Pagination implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() total: number = 0;
  @Input() limit: number = 10;

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  readonly limitOptions = [10, 25, 50, 100];
  pages: (number | '...')[] = [];

  ngOnChanges() {
    this.buildPages();
  }

  // ─── Build page number array with ellipsis ────────────────────────────────
  buildPages() {
    const total = this.totalPages;
    const current = this.currentPage;
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

    this.pages = pages;
  }

  // ─── Getters for display ──────────────────────────────────────────────────
  get fromEntry(): number {
    return (this.currentPage - 1) * this.limit + 1;
  }

  get toEntry(): number {
    return Math.min(this.currentPage * this.limit, this.total);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  goToPage(page: number | '...') {
    if (page === '...' || page === this.currentPage) return;
    this.pageChange.emit({ page: page as number, limit: this.limit });
  }

  prev() {
    if (this.currentPage > 1) {
      this.pageChange.emit({ page: this.currentPage - 1, limit: this.limit });
    }
  }

  next() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit({ page: this.currentPage + 1, limit: this.limit });
    }
  }

  onLimitChange(newLimit: number) {
    this.pageChange.emit({ page: 1, limit: Number(newLimit) });
  }

  isEllipsis(page: number | '...'): boolean {
    return page === '...';
  }
}