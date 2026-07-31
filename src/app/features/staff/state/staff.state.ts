import { Injectable } from "@angular/core";
import { BaseState } from "../../../core/base/base-state.base";
import { StaffAdaptModel } from "../models/staff-adapt.model";

@Injectable({ providedIn: "root" })
export class StaffState extends BaseState<StaffAdaptModel> {
    // Add any staff-specific signals here in future
}
