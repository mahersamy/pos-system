import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {MainHeader} from "../main-header/main-header";

@Component({
    selector: "app-main-layout",
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, MainHeader],
    templateUrl: "./main-layout.component.html",
    styleUrl: "./main-layout.component.scss",
})
export class MainLayoutComponent {}
