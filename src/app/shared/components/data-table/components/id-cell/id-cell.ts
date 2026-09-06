import {Component, input, computed} from "@angular/core";
import {TooltipModule} from "primeng/tooltip";

@Component({
    selector: "app-id-cell",
    imports: [TooltipModule],
    templateUrl: "./id-cell.html",
    styleUrl: "./id-cell.scss",
})
export class IdCell {
    field = input<string>("");
    shortId = computed(() => this.field()?.substring(0, 4) || "");
}
