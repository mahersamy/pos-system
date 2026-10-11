import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Order, getCreatedByName } from '../../models/order.model';
import { OrderStatus } from '../../enums/order-status.enum';
import { OrderType } from '../../enums/order-type.enum';
import { OrderApiService } from '../../services/order-api.service';
import { OrdersFacade } from '../../services/orders.facade.service';
import { ConfirmationService } from '../../../../core/services/confirmation/confirmation';

import { OrderDetailHeaderComponent, StatusAction } from './components/order-detail-header/order-detail-header.component';
import { OrderDetailMetricsComponent } from './components/order-detail-metrics/order-detail-metrics.component';
import { OrderDetailItemsComponent } from './components/order-detail-items/order-detail-items.component';
import { OrderDetailSidebarComponent } from './components/order-detail-sidebar/order-detail-sidebar.component';
import { OrderReceiptModalComponent } from './components/order-receipt-modal/order-receipt-modal.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    OrderDetailHeaderComponent,
    OrderDetailMetricsComponent,
    OrderDetailItemsComponent,
    OrderDetailSidebarComponent,
    OrderReceiptModalComponent,
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  private readonly route        = inject(ActivatedRoute);
  private readonly router       = inject(Router);
  private readonly location     = inject(Location);
  private readonly orderApi     = inject(OrderApiService);
  private readonly facade       = inject(OrdersFacade);
  private readonly confirmSvc   = inject(ConfirmationService);
  private readonly translate    = inject(TranslateService);
  private readonly destroyRef   = inject(DestroyRef);

  // ── State ────────────────────────────────────────────────────────────────────
  order           = signal<Order | null>(null);
  loading         = signal<boolean>(true);
  isError         = signal<boolean>(false);
  actionsOpen     = signal<boolean>(false);
  showReceiptModal = signal<boolean>(false);
  copiedField     = signal<string | null>(null);

  // ── Computed ─────────────────────────────────────────────────────────────────
  totalUnits = computed<number>(() => {
    const o = this.order();
    if (!o?.orderItems) return 0;
    return o.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  });

  get availableActions(): StatusAction[] {
    const current = this.order()?.status;
    const all: StatusAction[] = [
      { label: 'ORDERS.STATUS.IN_PROCESS', status: OrderStatus.IN_PROCESS, cls: 'action-btn--process' },
      { label: 'ORDERS.STATUS.READY',      status: OrderStatus.READY,      cls: 'action-btn--ready'   },
      { label: 'ORDERS.STATUS.COMPLETED',  status: OrderStatus.COMPLETED,  cls: 'action-btn--done'    },
      { label: 'ORDERS.STATUS.CANCELLED',  status: OrderStatus.CANCELLED,  cls: 'action-btn--cancel'  },
    ];
    return all.filter(a => a.status !== current);
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    const state = this.location.getState() as { order?: Order };

    if (state?.order && state.order._id === orderId) {
      this.order.set(state.order);
      this.loading.set(false);
      if (orderId) this.fetchOrder(orderId, false);
    } else if (orderId) {
      this.fetchOrder(orderId, true);
    } else {
      this.isError.set(true);
      this.loading.set(false);
    }
  }

  fetchOrder(id: string, showLoader = true): void {
    if (showLoader) {
      this.loading.set(true);
      this.isError.set(false);
    }

    this.orderApi.getOne(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.order.set(data);
          this.loading.set(false);
        },
        error: () => {
          if (showLoader) {
            this.isError.set(true);
            this.loading.set(false);
          }
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/main/orders']);
  }

  // ── Actions Dropdown ─────────────────────────────────────────────────────────
  onToggleActions(e: MouseEvent): void {
    e.stopPropagation();
    this.actionsOpen.update(v => !v);
  }

  onCloseActions(): void {
    this.actionsOpen.set(false);
  }

  onStatusChange(action: StatusAction): void {
    this.actionsOpen.set(false);
    if (action.status === OrderStatus.CANCELLED) {
      this.openCancelDialog();
    } else {
      this.openConfirmDialog(action.status);
    }
  }

  private openConfirmDialog(status: OrderStatus): void {
    const o = this.order();
    if (!o) return;

    this.confirmSvc.confirm({
      header:   this.translate.instant('ORDERS.ACTIONS.STATUS_CONFIRM_TITLE'),
      message:  this.translate.instant('ORDERS.ACTIONS.STATUS_CONFIRM_MSG'),
      type:     'discard',
      btn1Text: this.translate.instant('ORDERS.ACTIONS.CONFIRM'),
      btn2Text: this.translate.instant('COMMON.ACTIONS.CANCEL'),
      btn1Action: () => {
        this.confirmSvc.isBtn1Loading.set(true);
        this.orderApi.updateStatus(o._id, { status })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this.confirmSvc.isBtn1Loading.set(false);
              this.confirmSvc.close();
              this.order.update(curr => curr ? { ...curr, status: res.data.status || status } : null);
              this.facade.load();
            },
            error: () => { this.confirmSvc.isBtn1Loading.set(false); }
          });
      },
      btn2Action: () => this.confirmSvc.close(),
    });
  }

  private openCancelDialog(): void {
    const o = this.order();
    if (!o) return;
    let reason = '';

    this.confirmSvc.confirm({
      header:   this.translate.instant('ORDERS.ACTIONS.CANCEL_CONFIRM_TITLE'),
      message:  this.translate.instant('ORDERS.ACTIONS.CANCEL_CONFIRM_MSG'),
      type:     'delete',
      btn1Text: this.translate.instant('ORDERS.ACTIONS.MARK_CANCELLED'),
      btn2Text: this.translate.instant('COMMON.ACTIONS.CANCEL'),
      showRejectionDropdown: false,
      showDescriptionInput: true,
      onDescriptionChange: (val) => { reason = val; },
      btn1Action: () => {
        if (!reason.trim()) return;
        this.confirmSvc.isBtn1Loading.set(true);
        this.orderApi.updateStatus(o._id, { status: OrderStatus.CANCELLED, cancellationReason: reason.trim() })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.confirmSvc.isBtn1Loading.set(false);
              this.confirmSvc.close();
              this.order.update(curr => curr ? { ...curr, status: OrderStatus.CANCELLED, cancellationReason: reason.trim() } : null);
              this.facade.load();
            },
            error: () => { this.confirmSvc.isBtn1Loading.set(false); }
          });
      },
      btn2Action: () => this.confirmSvc.close(),
    });
  }

  // ── Receipt ───────────────────────────────────────────────────────────────────
  onOpenReceipt(): void  { this.showReceiptModal.set(true); }
  onCloseReceipt(): void { this.showReceiptModal.set(false); }
  onPrintReceipt(): void { window.print(); }

  // ── Copy to clipboard ─────────────────────────────────────────────────────────
  onCopyField(event: { text: string; field: string }): void {
    navigator.clipboard.writeText(event.text).then(() => {
      this.copiedField.set(event.field);
      setTimeout(() => this.copiedField.set(null), 2000);
    });
  }
}
