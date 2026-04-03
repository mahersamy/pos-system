import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetail } from './notification-detail';

describe('NotificationDetail', () => {
  let component: NotificationDetail;
  let fixture: ComponentFixture<NotificationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
