export interface StaffCreateDto {
    fullname: string;
    email: string;
    position: string;
    phoneNumber: string;
    salary: number;
    age: number;
    dateOfBirth: string;
    startShiftTiming: string;
    endShiftTiming: string;
    address?: string;
}