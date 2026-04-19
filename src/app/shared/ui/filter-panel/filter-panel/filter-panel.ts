import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FilterFieldType,
  FilterFieldConfig,
  FilterOutput,
} from './../interface/filter-panel.models';

export { FilterFieldType };
export type { FilterFieldConfig, FilterOutput };

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanel implements OnInit {
  @Input() configs: FilterFieldConfig[] = [];
  @Input() searchQuery: string = '';

  @Output() applyFilter = new EventEmitter<FilterOutput>();

  readonly FilterFieldType = FilterFieldType;

  isOpen = false;
  sortDirection: 'asc' | 'desc' | null = null;
  fieldValues: Record<string, any> = {};
  activeCount = 0;

  ngOnInit() {
    this.initValues();
  }

  initValues() {
    this.fieldValues = {};
    this.configs.forEach((c) => {
      if (c.type === FilterFieldType.RANGE) {
        this.fieldValues[c.controlName] = { min: null, max: null };
      } else {
        this.fieldValues[c.controlName] = null;
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  apply() {
    const result: FilterOutput = {
      search: this.searchQuery,
      sort: this.sortDirection ?? 'asc',
    };

    
    this.configs.forEach((c) => {
  const val = this.fieldValues[c.controlName];
  if (c.type === FilterFieldType.RANGE) {
    if (val.min !== null || val.max !== null) {
      result[c.controlName] = {
        min: val.min ?? 0,
        max: val.max ?? 999999999,
      };
    }
  } else {
    if (val !== null && val !== '' && val !== undefined) {
      result[c.controlName] = val;
    }
  }
});

    this.activeCount = Object.keys(result).filter(
      (k) => k !== 'search' && k !== 'sort' && result[k] !== null,
    ).length;

    console.log('Filter output:', result);
    this.applyFilter.emit(result);
    this.isOpen = false;
  }

  reset() {
    this.initValues();
    this.sortDirection = null;
    this.activeCount = 0;
    this.applyFilter.emit({ search: this.searchQuery, sort: null });
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('app-filter-panel')) {
      this.isOpen = false;
    }
  }
}
