import { Injectable } from "@angular/core";
import { BaseState } from "../../../core/base/base-state.base";
import { Menu } from "../model/menu.model";

@Injectable({ providedIn: "root" })
export class MenuState extends BaseState<Menu> {
    // Add any menu-specific signals here in future
}
