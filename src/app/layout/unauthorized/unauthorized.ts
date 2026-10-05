import {Component, inject} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: "app-unauthorized",
    imports: [TranslateModule],
    templateUrl: "./unauthorized.html",
    styleUrl: "./unauthorized.scss",
})
export class Unauthorized {
    private readonly _router = inject(Router);

    /**
     * Directs the unauthorized user back to the primary authenticated entry point.
     */
    goHome() {
        this._router.navigate(["/main"]);
    }
}
