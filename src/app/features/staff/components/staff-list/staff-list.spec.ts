import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffList } from './staff-list';

describe('StaffList', () => {
  let component: StaffList;
  let fixture: ComponentFixture<StaffList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
