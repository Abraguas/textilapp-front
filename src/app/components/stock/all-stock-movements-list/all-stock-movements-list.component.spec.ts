import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStockMovementsListComponent } from './all-stock-movements-list.component';

describe('AllStockMovementsListComponent', () => {
  let component: AllStockMovementsListComponent;
  let fixture: ComponentFixture<AllStockMovementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllStockMovementsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllStockMovementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
