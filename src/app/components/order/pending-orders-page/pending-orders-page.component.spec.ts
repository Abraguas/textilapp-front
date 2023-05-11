import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingOrdersPageComponent } from './pending-orders-page.component';

describe('PendingOrdersPageComponent', () => {
  let component: PendingOrdersPageComponent;
  let fixture: ComponentFixture<PendingOrdersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingOrdersPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingOrdersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
