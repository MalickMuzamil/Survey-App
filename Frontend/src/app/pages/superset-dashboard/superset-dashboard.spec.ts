import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupersetDashboard } from './superset-dashboard';

describe('SupersetDashboard', () => {
  let component: SupersetDashboard;
  let fixture: ComponentFixture<SupersetDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupersetDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupersetDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
