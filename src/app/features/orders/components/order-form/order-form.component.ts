import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, Validators } from '@angular/forms';
import { OrderType } from '../../enums/order-type.enum';
import { DynamicForm } from '../../../../shared/components/forms/dynamic-form/dynamic-form';
import { FormFieldConfig } from '../../../../shared/components/forms/dynamic-form/interfaces/form-config.type';
import { FormInputType } from '../../../../shared/components/forms/dynamic-form/enum/form.enum';
import { Subscription } from 'rxjs';
import { Loading } from '../../../../shared/directives/loading/loading';

@Component({
  selector: 'app-order-form',
  imports: [CommonModule, FormsModule, DynamicForm, Loading],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {
  readonly OrderType = OrderType;

  orderType = input<OrderType>(OrderType.DINE_IN);
  table = input<string>('');
  guestName = input<string>('');
  phoneNumber = input<string>('');
  deliveryInfo = input<string>('');
  isCreating = input<boolean>(false);
  cartIsEmpty = input<boolean>(true);

  orderTypeChange = output<OrderType>();
  tableChange = output<string>();
  guestNameChange = output<string>();
  phoneNumberChange = output<string>();
  deliveryInfoChange = output<string>();
  placeOrder = output<void>();

  readonly dineInConfig: FormFieldConfig[] = [
    {
      controlName: 'table',
      label: 'Table Number',
      placeholder: 'e.g. T-12',
      type: FormInputType.number,
      min: 1,
      max: 100,
      minFractionDigits: 0,
      maxFractionDigits: 0,
      step: 1,
      validators: [Validators.required],
      errorMessages: { required: 'Table number is required.' }
    },
    {
      controlName: 'guestName',
      label: 'Guest Name (optional)',
      placeholder: 'Guest name',
      type: FormInputType.text,
    }
  ];

  readonly deliveryConfig: FormFieldConfig[] = [
    {
      controlName: 'guestName',
      label: 'Customer Name',
      placeholder: 'Customer name',
      type: FormInputType.text,
      validators: [Validators.required],
      errorMessages: { required: 'Customer name is required.' }
    },
    {
      controlName: 'phoneNumber',
      label: 'Phone Number',
      placeholder: '01555073945',
      type: FormInputType.phone,
      validators: [Validators.required, Validators.minLength(11)],
      errorMessages: {
        required: 'Phone number is required.',
        minlength: 'Phone number must be 11 digits.'
      }
    },
    {
      controlName: 'deliveryInfo',
      label: 'Delivery Address',
      placeholder: 'Full delivery address',
      type: FormInputType.textarea,
      validators: [Validators.required],
      errorMessages: { required: 'Delivery address is required.' }
    }
  ];

  currentForm: FormGroup | null = null;
  private valueChangesSub?: Subscription;

  onDineInFormCreated(form: FormGroup) {
    this.subscribeToForm(form, (values) => {
      if (values.table !== undefined) this.tableChange.emit(values.table);
      if (values.guestName !== undefined) this.guestNameChange.emit(values.guestName);
    });
  }

  onDeliveryFormCreated(form: FormGroup) {
    this.subscribeToForm(form, (values) => {
      if (values.guestName !== undefined) this.guestNameChange.emit(values.guestName);
      if (values.phoneNumber !== undefined) this.phoneNumberChange.emit(values.phoneNumber);
      if (values.deliveryInfo !== undefined) this.deliveryInfoChange.emit(values.deliveryInfo);
    });
  }

  private subscribeToForm(form: FormGroup, syncFn: (values: any) => void) {
    this.currentForm = form;
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }
    syncFn(form.value);
    this.valueChangesSub = form.valueChanges.subscribe(syncFn);
  }

  onOrderTypeChange(type: OrderType) {
    this.orderTypeChange.emit(type);
  }

  onPlaceOrder() {
    if (this.currentForm) {
      this.currentForm.markAllAsTouched();
      if (this.currentForm.invalid) return;
    }
    this.placeOrder.emit();
  }

  resetForm() {
    if (this.currentForm) {
      this.currentForm.reset();
    }
  }
}
