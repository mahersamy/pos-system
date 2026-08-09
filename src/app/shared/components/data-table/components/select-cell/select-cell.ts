import { Component, input, output } from "@angular/core";
import { SelectModule } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-select-cell",
    imports: [SelectModule, FormsModule, TranslateModule],
    templateUrl: "./select-cell.html",
    styleUrl: "./select-cell.scss",
})
export class SelectCell {
    value = input<string>();
    options = input<{label: string, value: any}[]>([]);
    
    valueChange = output<any>();

    onChange(event: any) {
        this.valueChange.emit(event.value);
    }
}
