import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCandidatComponent } from './main-candidat.component';

describe('MainCandidatComponent', () => {
  let component: MainCandidatComponent;
  let fixture: ComponentFixture<MainCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCandidatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
