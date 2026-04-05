import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCard } from './notification-card';

describe('NotificationCard', () => {
  let component: NotificationCard;
  let fixture: ComponentFixture<NotificationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
