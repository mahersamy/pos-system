export interface Staff {
    _id: string;
    fullname: string;
    email: string;
    position: string;
    phoneNumber: string;
    salary: number;
    age: number;
    DateOfBirth: string;
    startShiftTiming: string;
    endShiftTiming: string;
    profilePicture: {
        secure_url: string;
    };
    createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        fullName: string;
        id: string;
    };
}
