import {Component, OnInit, input, output, DestroyRef, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
    selector: "app-search-bar",
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./search-bar.html",
    styleUrl: "./search-bar.scss",
})
export class SearchBar implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);

    // ─── Configurable placeholder ────────────────────────────
    placeholder = input<string>("Search...");
    searchOnType = input<boolean>(true);

    searchChange = output<string>();
    searchEnter = output<string>();

    searchControl = new FormControl("");

    ngOnInit() {
        if (this.searchOnType()) {
            this.searchControl.valueChanges
                .pipe(
                    debounceTime(300),
                    distinctUntilChanged(),
                    takeUntilDestroyed(this._destroyRef)
                )
                .subscribe(() => {
                    this.emitSearch();
                });
        }
    }

    emitSearch() {
        this.searchChange.emit(this.searchControl.value ?? "");
    }

    emitEnter() {
        this.searchEnter.emit(this.searchControl.value ?? "");
    }

    clear() {
        this.searchControl.setValue("");
    }
}
