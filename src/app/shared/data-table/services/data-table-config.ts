import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataTableConfig {
  columns: WritableSignal<any[]> = signal([]);
  rows: WritableSignal<any[]> = signal([]);
}
