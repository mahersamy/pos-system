import { TestBed } from '@angular/core/testing';

import { Platform } from './platform';

describe('Platform', () => {
  let service: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Platform);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
