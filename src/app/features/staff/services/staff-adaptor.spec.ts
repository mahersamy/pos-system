import { TestBed } from '@angular/core/testing';

import { StaffAdaptor } from './staff-adaptor';

describe('StaffAdaptor', () => {
  let service: StaffAdaptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffAdaptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
