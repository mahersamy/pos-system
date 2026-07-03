import { Component, inject, input, OnInit, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';

// PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { KeyFilterModule } from 'primeng/keyfilter';

import { FormFieldConfig } from './interfaces/form-config.type';
import { DynamicFormFactory } from './services/dynamic-form.factory';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    FileUploadModule,
    IconFieldModule,
    InputIconModule,
    FileUploadComponent,
    KeyFilterModule,
    ValidationMessagesComponent,
  ],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.scss',
})
export class DynamicForm implements OnInit {
  private readonly dynamicFormFactory = inject(DynamicFormFactory);

  configArr = input.required<FormFieldConfig[]>();
  form=output<FormGroup>()

  genaricForm!: FormGroup;

  private _formBuilder() {
    this.genaricForm = this.dynamicFormFactory.createForm(this.configArr());
    this.form.emit(this.genaricForm)
  }

  ngOnInit(): void {
    this._formBuilder();
  }
}
