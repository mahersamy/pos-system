import { Injectable } from "@angular/core";
import { BaseState } from "../../../core/base/base-state.base";
import { Inventory } from "../model/inventory.model";

@Injectable({ providedIn: "root" })
export class InventoryState extends BaseState<Inventory> {
}
