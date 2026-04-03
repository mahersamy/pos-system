import {Component, inject} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "app-not-found",
    imports: [],
    templateUrl: "./not-found.html",
    styleUrl: "./not-found.scss",
})
export class NotFound {
    private readonly _router = inject(Router);

    /**
     * Executes the navigation protocol back to the dashboard.
     * Directs the lost user back to the primary authenticated entry point.
     */
    goHome() {
        this._router.navigate(["/main"]);
    }
}
