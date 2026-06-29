import { Component, OnInit, signal, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
    FilterFieldType,
    FilterConfig,
    FilterFieldConfig,
    FilterOutput,
} from "../interface/filter-panel.models";
import { TranslateModule } from "@ngx-translate/core";

export { FilterFieldType };
export type { FilterConfig, FilterFieldConfig, FilterOutput };

@Component({
    selector: "app-filter-panel",
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: "./filter-panel.html",
    styleUrl: "./filter-panel.scss",
})
export class FilterPanel implements OnInit {
    configs = input.required<FilterConfig[]>();
    searchQuery = input.required<string>();

    applyFilter = output<FilterOutput>();

    readonly FilterFieldType = FilterFieldType;

    isOpen = signal(false);
    sortDirection = signal<"asc" | "desc" | null>("desc");
    fieldValues = signal<Record<string, any>>({});
    activeCount = signal(0);

    ngOnInit() {
        this.initValues();
    }

    initValues() {
        const initial: Record<string, any> = {};
        this.configs().forEach((c) => {
            if (c.type === FilterFieldType.RANGE) {
                initial[c.controlName] = { min: null, max: null };
            } else {
                initial[c.controlName] = null;
            }
        });
        this.fieldValues.set(initial);
    }

    updateFieldValue(key: string, value: any) {
        this.fieldValues.update((prev) => ({ ...prev, [key]: value }));
    }

    updateRangeField(key: string, subKey: "min" | "max", value: any) {
        this.fieldValues.update((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [subKey]: value,
            },
        }));
    }

    toggle() {
        this.isOpen.update((v) => !v);
    }

    apply() {
        const result: FilterOutput = {
            search: this.searchQuery(),
            sort: this.sortDirection() ?? "asc",
        };

        const currentValues = this.fieldValues();
        this.configs().forEach((c) => {
            const val = currentValues[c.controlName];
            if (c.type === FilterFieldType.RANGE) {
                if (val && (val.min !== null || val.max !== null)) {
                    result[c.controlName] = {
                        min: val.min ?? 0,
                        max: val.max ?? 999999999,
                    };
                }
            } else {
                if (val !== null && val !== "" && val !== undefined) {
                    result[c.controlName] = val;
                }
            }
        });

        this.activeCount.set(
            Object.keys(result).filter((k) => k !== "search" && k !== "sort" && result[k] !== null)
                .length
        );

        console.log("Filter output:", result);
        this.applyFilter.emit(result);
        this.isOpen.set(false);
    }

    reset() {
        this.initValues();
        this.sortDirection.set("asc");
        this.activeCount.set(0);
        this.applyFilter.emit({ search: this.searchQuery(), sort: "asc" });
    }
}
