import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAbmPageComponent } from './category-abm-page.component';

describe('CategoryAbmPageComponent', () => {
  let component: CategoryAbmPageComponent;
  let fixture: ComponentFixture<CategoryAbmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryAbmPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAbmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
