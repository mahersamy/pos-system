import {Staff} from "./staff";

export interface StaffAdaptModel extends Partial<Staff> {
    _id: string;
    staffProfile: {
        fullname: string;
        position: string;
        image?: string;
    };

    dateOfBirth: string;
    timing: string;
    address?: string;
}
