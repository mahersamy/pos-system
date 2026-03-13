import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextCell } from './text-cell';

describe('TextCell', () => {
  let component: TextCell;
  let fixture: ComponentFixture<TextCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextCell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
