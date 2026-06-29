import { Component, input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig } from '../../interfaces/form-config.type';

@Component({
  selector: 'app-file-upload',
  imports: [ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnInit {
  control = input.required<FormControl>();
  config = input.required<FormFieldConfig>();
  previewUrl = signal<string | ArrayBuffer | null>(null);

  ngOnInit() {
    const initialValue = this.control().value;
    if (typeof initialValue === 'string') {
      this.previewUrl.set(initialValue);
    }
  }

  onFileSelected(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files && inputEl.files.length > 0) {
      const file = inputEl.files[0];
      this.control().setValue(file);
      this.control().markAsDirty();

      // Image preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewUrl.set(reader.result);
      };

      inputEl.value = '';
    }
  }
}
