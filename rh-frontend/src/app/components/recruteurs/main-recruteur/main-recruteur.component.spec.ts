import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRecruteurComponent } from './main-recruteur.component';

describe('MainRecruteurComponent', () => {
  let component: MainRecruteurComponent;
  let fixture: ComponentFixture<MainRecruteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainRecruteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
