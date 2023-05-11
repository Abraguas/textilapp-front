import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayOrderButtonComponent } from './pay-order-button.component';

describe('PayOrderButtonComponent', () => {
  let component: PayOrderButtonComponent;
  let fixture: ComponentFixture<PayOrderButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayOrderButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayOrderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
