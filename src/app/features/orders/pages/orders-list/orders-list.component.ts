import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrdersFacade } from '../../services/orders.facade.service';
import { FilterPanel, FilterConfig, FilterFieldType, FilterOutput } from '../../../../shared/components/filter-panel/filter-panel/filter-panel';
import { Pagination, PageChangeEvent } from '../../../../shared/components/pagination/pagination';
import { OrdersListCard } from '../../components/orders-list-card/orders-list-card';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule, RouterLink, TranslateModule, FilterPanel, Pagination, OrdersListCard, SearchBar],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  public facade = inject(OrdersFacade);
  private translate = inject(TranslateService);
  public searchQuery = signal('');

  public filterConfigs: FilterConfig[] = [
    {
      label: this.translate.instant('ORDERS.FILTER.ORDER_TYPE'),
      controlName: 'orderType',
      type: FilterFieldType.SELECT,
      select_list: [
        { label: this.translate.instant('ORDERS.FILTER.ALL_TYPES'), value: null },
        { label: this.translate.instant('ORDERS.TYPE.DINE_IN'), value: 'dine_in' },
        { label: this.translate.instant('ORDERS.TYPE.DELIVERY'), value: 'delivery' }
      ]
    },
    {
      label: this.translate.instant('ORDERS.FILTER.STATUS_LABEL'),
      controlName: 'status',
      type: FilterFieldType.SELECT,
      select_list: [
        { label: this.translate.instant('ORDERS.FILTER.ALL_STATUSES'), value: null },
        { label: this.translate.instant('ORDERS.STATUS.IN_PROCESS'), value: 'in_process' },
        { label: this.translate.instant('ORDERS.STATUS.READY'), value: 'ready' },
        { label: this.translate.instant('ORDERS.STATUS.COMPLETED'), value: 'completed' },
        { label: this.translate.instant('ORDERS.STATUS.CANCELLED'), value: 'cancelled' }
      ]
    }
  ];

  ngOnInit(): void {
    this.facade.load();
  }

  onSearch(term: string): void {
    this.searchQuery.set(term);
    this.facade.setFilter({ search: term, sort: 'desc' });
  }

  onFilter(filter: FilterOutput): void {
    this.searchQuery.set(filter.search || '');
    this.facade.setFilter(filter);
  }

  onPageChange(event: PageChangeEvent): void {
    this.facade.setPagination(event.page, event.limit);
  }
}
