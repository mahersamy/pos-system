import { TestBed } from '@angular/core/testing';

import { Confirmation } from './confirmation';

describe('Confirmation', () => {
  let service: Confirmation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Confirmation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
