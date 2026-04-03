import { TestBed } from '@angular/core/testing';

import { Themes } from './themes';

describe('Themes', () => {
  let service: Themes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Themes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
