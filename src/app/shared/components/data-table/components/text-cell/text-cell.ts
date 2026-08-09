import {Component, input} from "@angular/core";

@Component({
    selector: "app-text-cell",
    imports: [],
    templateUrl: "./text-cell.html",
    styleUrl: "./text-cell.scss",
})
export class TextCell {
    field = input<string>("");
    classes = input<string>("");
    suffix = input<string>("");
}
