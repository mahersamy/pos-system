import { Injectable } from '@angular/core';
import { Adaptor } from '../../../core/models/adaptor.model';
import { Staff } from '../models/staff';
import { StaffAdaptModel } from '../models/staff-adapt.model';

@Injectable({
  providedIn: 'root',
})
export class StaffAdaptor implements Adaptor {
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
      DateOfBirth: data.DateOfBirth,
      timing: `${data.startShiftTiming} to ${data.endShiftTiming}`,
    };
  }
}
