import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStockMovementComponent } from './register-stock-movement.component';

describe('RegisterStockMovementComponent', () => {
  let component: RegisterStockMovementComponent;
  let fixture: ComponentFixture<RegisterStockMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterStockMovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterStockMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
