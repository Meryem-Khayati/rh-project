import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCandidatComponent } from './dash-candidat.component';

describe('DashCandidatComponent', () => {
  let component: DashCandidatComponent;
  let fixture: ComponentFixture<DashCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashCandidatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
