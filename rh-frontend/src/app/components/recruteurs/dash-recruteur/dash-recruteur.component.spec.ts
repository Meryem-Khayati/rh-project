import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashRecruteurComponent } from './dash-recruteur.component';

describe('DashRecruteurComponent', () => {
  let component: DashRecruteurComponent;
  let fixture: ComponentFixture<DashRecruteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashRecruteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
