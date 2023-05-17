import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalEarningsPerMonthComponent } from './total-earnings-per-month.component';

describe('TotalEarningsPerMonthComponent', () => {
  let component: TotalEarningsPerMonthComponent;
  let fixture: ComponentFixture<TotalEarningsPerMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalEarningsPerMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalEarningsPerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
