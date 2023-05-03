import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailButtonComponent } from './order-detail-button.component';

describe('OrderDetailButtonComponent', () => {
  let component: OrderDetailButtonComponent;
  let fixture: ComponentFixture<OrderDetailButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
