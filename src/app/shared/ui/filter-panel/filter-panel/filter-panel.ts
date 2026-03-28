import {
  Component, Input, Output, EventEmitter,
  OnInit, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Field Types ─────────────────────────────────────────
export enum FilterFieldType {
  SELECT = 'SELECT',
  TEXT   = 'TEXT',
  RANGE  = 'RANGE',
  DATE   = 'DATE',
}

// ─── Field Config  ─────────
export interface FilterFieldConfig {
  type: FilterFieldType;
  controlName: string;       
  label: string;             
  placeholder?: string;
  // SELECT 
  typeSelect?: 'single' | 'multi';
  select_list?: { label: string; value: any }[];
  // RANGE
  rangeMin?: number;
  rangeMax?: number;
}

// ─── Output object ───────────────────────────────────────
export interface FilterOutput {
  search: string;
  sort: 'asc' | 'desc' | null;
  [key: string]: any;        // dynamic filter keys
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanel implements OnInit {
  @Input() configs: FilterFieldConfig[] = [];
  @Input() searchQuery: string = '';   // passed in from parent (search bar)

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
    this.configs.forEach(c => {
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
      sort: this.sortDirection,
    };

    this.configs.forEach(c => {
      const val = this.fieldValues[c.controlName];
      if (val !== null && val !== '' && val !== undefined) {
        result[c.controlName] = val;
      }
    });

    // count active filters (excluding search & sort)
    this.activeCount = Object.keys(result).filter(
      k => k !== 'search' && k !== 'sort' && result[k] !== null
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
