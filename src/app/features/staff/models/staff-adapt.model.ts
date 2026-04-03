import { Staff } from "./staff";

export interface StaffAdaptModel extends Partial<Staff> {
  staffProfile: {
    fullname: string;
    position: string;
    image?: string;
  };

  timing: string;
}
