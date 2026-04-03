import { TestBed } from '@angular/core/testing';

import { UploadFile } from './upload-file';

describe('UploadFile', () => {
  let service: UploadFile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadFile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
