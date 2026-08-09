import {Component, computed, input} from "@angular/core";

@Component({
    selector: "app-user-cell",
    imports: [],
    templateUrl: "./user-cell.html",
    styleUrl: "./user-cell.scss",
})
export class UserCell {
    name = input<string>("");
    subtitle = input<string>("");
    image = input<string>("");
    subtitleColor = input<string>("");

    initials = computed(() =>
        this.name()
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
    );
}
