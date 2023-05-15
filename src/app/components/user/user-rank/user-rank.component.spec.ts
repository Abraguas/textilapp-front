import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRankComponent } from './user-rank.component';

describe('UserRankComponent', () => {
  let component: UserRankComponent;
  let fixture: ComponentFixture<UserRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
