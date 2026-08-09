import { Component, input, computed } from "@angular/core";
import { CommonModule } from "@angular/common";

export type StatusVariant = "success" | "danger" | "warning" | "info" | "default";

export interface StatusOption {
    value: string;
    label: string;
    variant: StatusVariant;
}

@Component({
    selector: "app-status-cell",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./status-cell.html",
    styleUrl: "./status-cell.scss",
})
export class StatusCell {
    value = input<string>("");
    options = input<StatusOption[]>([]);

    resolved = computed<StatusOption>(() => {
        const match = this.options().find((o) => o.value === this.value());
        return match ?? { value: this.value(), label: this.value(), variant: "default" };
    });
}
