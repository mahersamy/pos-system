import {Component, signal, inject} from "@angular/core";
import {UserInfo} from "./components/user-info/user-info";
import {AuthService} from "../../core/services/auth/auth";

@Component({
    selector: "app-user-profile",
    imports: [UserInfo],
    templateUrl: "./user-profile.html",
    styleUrl: "./user-profile.scss",
})
export class UserProfile {
    private readonly _authService = inject(AuthService);

    activeView = signal<"user-info">("user-info");

    switchView(view: "user-info") {
        this.activeView.set(view);
    }

    /**
     * Executes the secure logout protocol via the authentication service
     */
    logout() {
        this._authService.logout();
    }
}
