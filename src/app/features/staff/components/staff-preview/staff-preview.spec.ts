import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPreview } from './staff-preview';

describe('StaffPreview', () => {
  let component: StaffPreview;
  let fixture: ComponentFixture<StaffPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
