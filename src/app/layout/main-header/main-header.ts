import {Component, inject} from "@angular/core";
import {LayoutService} from "../../core/services/layout/layout";

@Component({
    selector: "app-main-header",
    imports: [],
    templateUrl: "./main-header.html",
    styleUrl: "./main-header.scss",
})
export class MainHeader {
    layoutService = inject(LayoutService);
    title = this.layoutService.title;
}
