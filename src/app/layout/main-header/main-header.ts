import {Component, inject, OnInit, DestroyRef} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LayoutService} from "../../core/services/layout/layout";
import {Router, NavigationEnd} from "@angular/router";
import {filter} from "rxjs/operators";
import {Location} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
    selector: "app-main-header",
    imports: [RouterLink],
    templateUrl: "./main-header.html",
    styleUrl: "./main-header.scss",
})
export class MainHeader implements OnInit {
    private readonly _layoutService = inject(LayoutService);
    private readonly _router = inject(Router);

    private readonly _location = inject(Location);
    private readonly _destroyRef = inject(DestroyRef);

    /** Active title value managed by the layout state */
    title = this._layoutService.title;

    ngOnInit() {
        this.updateTitle();

        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(() => {
                this.updateTitle();
            });
    }

    /**
     * Resolves the deepest active route property to update the layout title dynamically.
     * Overrides with predefined route snapshots if accessible.
     */
    private updateTitle() {
        let activeRoute = this._router.routerState.root;
        while (activeRoute.firstChild) {
            activeRoute = activeRoute.firstChild;
        }
        const title = activeRoute.snapshot.data["title"];
        if (title) {
            this._layoutService.setTitle(title);
        }
    }

    /**
     * Reverts navigation back recursively through the browser location stack matrix
     */
    goBack() {
        this._location.back();
    }
}
