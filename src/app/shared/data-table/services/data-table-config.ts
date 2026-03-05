import { Injectable, signal, WritableSignal } from '@angular/core';
import { ColumnConfig } from '../models/colmun-config.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataTableConfig<T = any> {
  columns: WritableSignal<ColumnConfig[]> = signal([]);
  rows: WritableSignal<T[]> = signal([]);
  dataKey: WritableSignal<string> = signal('_id');
  loading: WritableSignal<boolean> = signal(true);
  isError: WritableSignal<boolean> = signal(false);

  isSelectable: WritableSignal<boolean> = signal(false);

  refetchEvent: Subject<void> = new Subject<void>();
}
