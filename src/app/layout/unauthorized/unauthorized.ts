import {Component, inject} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {PermissionsService} from "../../core/services/permissions/permissions";

@Component({
    selector: "app-unauthorized",
    imports: [TranslateModule],
    templateUrl: "./unauthorized.html",
    styleUrl: "./unauthorized.scss",
})
export class Unauthorized {
    private readonly _router = inject(Router);
    private readonly _permissionsService = inject(PermissionsService);

    /**
     * Directs the user to the first page they actually have permission to access.
     * Prevents cashiers from being stuck in an unauthorized ↔ dashboard loop.
     */
    goHome() {
        const destination = this._permissionsService.getFirstAccessibleRoute();
        this._router.navigate([destination]);
    }
}
