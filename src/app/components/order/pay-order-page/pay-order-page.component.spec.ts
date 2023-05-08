import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayOrderPageComponent } from './pay-order-page.component';

describe('PayOrderPageComponent', () => {
  let component: PayOrderPageComponent;
  let fixture: ComponentFixture<PayOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayOrderPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
