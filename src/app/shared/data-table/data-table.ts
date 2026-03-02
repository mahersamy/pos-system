import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DataTableConfig } from './services/data-table-config';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-data-table',
  imports: [TableModule, SkeletonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  protected readonly _dataTableConfig = inject(DataTableConfig);

  selectedItems!: any;
}
