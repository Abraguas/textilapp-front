import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighestSellingProductsComponent } from './highest-selling-products.component';

describe('HighestSellingProductsComponent', () => {
  let component: HighestSellingProductsComponent;
  let fixture: ComponentFixture<HighestSellingProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighestSellingProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighestSellingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
