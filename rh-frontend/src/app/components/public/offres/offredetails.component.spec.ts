import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffredetailsComponent } from './offredetails.component';

describe('OffredetailsComponent', () => {
  let component: OffredetailsComponent;
  let fixture: ComponentFixture<OffredetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffredetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
