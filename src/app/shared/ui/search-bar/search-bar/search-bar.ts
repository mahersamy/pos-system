import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit, OnDestroy {
  // ─── Configurable placeholder ────────────────────────────
  placeholder = input<string>("Search...");
  searchOnType = input<boolean>(true);

  searchChange = output<string>();
  searchEnter = output<string>();

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit() {
    if (this.searchOnType()) {
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.emitSearch();
      });
    }
  }

  emitSearch() {
    this.searchChange.emit(this.searchControl.value ?? '');
  }

  emitEnter() {
    this.searchEnter.emit(this.searchControl.value ?? '');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clear() {
    this.searchControl.setValue('');
  }
}