import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Order } from '../../models/order.model';
import { OrderStatus } from '../../enums/order-status.enum';
import { OrdersFacade } from '../../services/orders.facade.service';
import { ConfirmationService } from '../../../../core/services/confirmation/confirmation';

interface StatusAction {
  label: string;
  status: OrderStatus;
  cls: string;
}

@Component({
  selector: 'app-orders-list-card',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './orders-list-card.html',
  styleUrl: './orders-list-card.scss'
})
export class OrdersListCard {
  order = input.required<Order>();

  private readonly facade            = inject(OrdersFacade);
  private readonly confirmSvc        = inject(ConfirmationService);
  private readonly translate         = inject(TranslateService);
  private readonly destroyRef        = inject(DestroyRef);

  /** Controls visibility of the quick-action dropdown */
  actionsOpen = signal(false);
  /** Cancellation reason — collected inline when cancelling */
  cancelReason = signal('');

  // ── Status display helpers ──────────────────────────────────────────────────
  get statusKey(): string {
    const map: Record<string, string> = {
      in_process: 'ORDERS.STATUS.IN_PROCESS',
      ready:      'ORDERS.STATUS.READY',
      completed:  'ORDERS.STATUS.COMPLETED',
      cancelled:  'ORDERS.STATUS.CANCELLED',
    };
    return map[this.order().status] ?? 'ORDERS.STATUS.IN_PROCESS';
  }

  get typeKey(): string {
    return this.order().orderType === 'delivery'
      ? 'ORDERS.TYPE.DELIVERY'
      : 'ORDERS.TYPE.DINE_IN';
  }

  get statusClass(): string {
    const map: Record<string, string> = {
      in_process: 'status-badge status-badge--process',
      ready:      'status-badge status-badge--ready',
      completed:  'status-badge status-badge--completed',
      cancelled:  'status-badge status-badge--cancelled',
    };
    return map[this.order().status] ?? 'status-badge';
  }

  // ── Available next-state transitions ────────────────────────────────────────
  get availableActions(): StatusAction[] {
    const all: StatusAction[] = [
      { label: 'ORDERS.STATUS.IN_PROCESS', status: OrderStatus.IN_PROCESS, cls: 'action-btn--process' },
      { label: 'ORDERS.STATUS.READY',      status: OrderStatus.READY,      cls: 'action-btn--ready'   },
      { label: 'ORDERS.STATUS.COMPLETED',  status: OrderStatus.COMPLETED,  cls: 'action-btn--done'    },
      { label: 'ORDERS.STATUS.CANCELLED',  status: OrderStatus.CANCELLED,  cls: 'action-btn--cancel'  },
    ];
    // exclude current status from available actions
    return all.filter(a => a.status !== this.order().status);
  }

  toggleActions(e: MouseEvent): void {
    e.stopPropagation();
    this.actionsOpen.update(v => !v);
    this.cancelReason.set('');
  }

  closeActions(): void {
    this.actionsOpen.set(false);
    this.cancelReason.set('');
  }

  // ── Status change entry point ───────────────────────────────────────────────
  requestStatusChange(action: StatusAction, e: MouseEvent): void {
    e.stopPropagation();
    this.actionsOpen.set(false);

    if (action.status === OrderStatus.CANCELLED) {
      this.openCancelDialog();
    } else {
      this.openConfirmDialog(action.status);
    }
  }

  // ── Regular status confirm dialog ───────────────────────────────────────────
  private openConfirmDialog(status: OrderStatus): void {
    this.confirmSvc.confirm({
      header:   this.translate.instant('ORDERS.ACTIONS.STATUS_CONFIRM_TITLE'),
      message:  this.translate.instant('ORDERS.ACTIONS.STATUS_CONFIRM_MSG'),
      type:     'discard',
      btn1Text: this.translate.instant('ORDERS.ACTIONS.CONFIRM'),
      btn2Text: this.translate.instant('COMMON.ACTIONS.CANCEL'),
      btn1Action: () => {
        this.confirmSvc.isBtn1Loading.set(true);
        this.facade.changeOrderStatus(this.order()._id, { status });
      },
      btn2Action: () => this.confirmSvc.close(),
    });
  }

  // ── Cancel with reason dialog ────────────────────────────────────────────────
  private openCancelDialog(): void {
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
        this.facade.changeOrderStatus(this.order()._id, {
          status: OrderStatus.CANCELLED,
          cancellationReason: reason.trim(),
        });
      },
      btn2Action: () => this.confirmSvc.close(),
    });
  }
}
