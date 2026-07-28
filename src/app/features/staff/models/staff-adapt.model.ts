
export interface StaffAdaptModel {
    _id: string;
    staffProfile: {
        fullname: string;
        position: string;
        image?: string;
    };
    age: number;
    email: string;
    phoneNumber: string;
    salary: number;
    dateOfBirth: string;
    timing: string;       
    address?: string;
}
