import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { Sidebar } from "../sidebar/sidebar";
import { MainHeader } from "../main-header/main-header";

@Component({
    selector: "app-main-layout",
    imports: [CommonModule, RouterOutlet, Sidebar, MainHeader],
    templateUrl: "./main-layout.html",
    styleUrl: "./main-layout.scss",
})
export class MainLayout {
}
