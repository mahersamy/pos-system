import {Component, signal, inject} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {UserInfo} from "../components/user-info/user-info";
import {AuthFacade} from "../../../core/services/auth/auth.facade";

@Component({
    selector: "app-user-profile",
    imports: [UserInfo, TranslateModule],
    templateUrl: "./user-profile.html",
    styleUrl: "./user-profile.scss",
})
export class UserProfile {
    private readonly _authFacade = inject(AuthFacade);

    activeView = signal<"user-info">("user-info");

    switchView(view: "user-info") {
        this.activeView.set(view);
    }

    /**
     * Executes the secure logout protocol via the authentication facade
     */
    logout() {
        this._authFacade.logout();
    }
}
