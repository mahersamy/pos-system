import { Injectable } from "@angular/core";
import { BaseState } from "../../../core/base/base-state.base";
import { User } from "../model/user.model";

@Injectable({ providedIn: "root" })
export class UsersState extends BaseState<User> {
    // Add any users-specific signals here in future
}
