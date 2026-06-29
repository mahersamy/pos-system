import { Injectable } from "@angular/core";
import { Adaptor } from "../../../core/models/adaptor.model";
import { Staff } from "../models/staff.model";
import { StaffAdaptModel } from "../models/staff-adapt.model";

@Injectable({
    providedIn: "root",
})
export class StaffAdaptor implements Adaptor {
    /**
     * Morphs raw backend staff data into a unified frontend structure
     * @param {Staff} data - The raw API response
     * @returns {StaffAdaptModel} The securely typed UI target definition
     */
    adapt(data: Staff): StaffAdaptModel {
        return {
            staffProfile: {
                fullname: data.fullname,
                position: data.position,
                image: data.profilePicture?.secure_url,
            },
            _id: data._id,
            age: data.age,
            email: data.email,
            phoneNumber: data.phoneNumber,
            salary: data.salary,
            dateOfBirth: data.dateOfBirth,
            address: data.address,
            timing: `${data.startShiftTiming} to ${data.endShiftTiming}`,
        };
    }
}
