import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationList } from './notification-list';

describe('NotificationList', () => {
  let component: NotificationList;
  let fixture: ComponentFixture<NotificationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
