import {Component, signal} from "@angular/core";
import {UserInfo} from "./components/user-info/user-info";

@Component({
    selector: "app-user-profile",
    imports: [UserInfo],
    templateUrl: "./user-profile.html",
    styleUrl: "./user-profile.scss",
})
export class UserProfile {
    activeView = signal<"user-info">("user-info");

    switchView(view: "user-info") {
        this.activeView.set(view);
    }
}
