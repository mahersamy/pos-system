export interface Staff {
  _id: string;
  fullname: string;
  email: string;
  position: string;
  phoneNumber: string;
  salary: number;
  dateOfBirth: string;
  startShiftTiming: string;
  endShiftTiming: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    id: string;
  };
}
