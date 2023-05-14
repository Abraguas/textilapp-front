import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandAbmPageComponent } from './brand-abm-page.component';

describe('BrandAbmPageComponent', () => {
  let component: BrandAbmPageComponent;
  let fixture: ComponentFixture<BrandAbmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandAbmPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandAbmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
