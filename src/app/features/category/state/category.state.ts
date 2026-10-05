import { Injectable } from "@angular/core";
import { BaseState } from "../../../core/base/base-state.base";
import { Category } from "../model/category.model";

@Injectable({ providedIn: "root" })
export class CategoryState extends BaseState<Category> {
    // Add any category-specific signals here in future
}
