import { TestBed } from '@angular/core/testing';

import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  let service: UserProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
