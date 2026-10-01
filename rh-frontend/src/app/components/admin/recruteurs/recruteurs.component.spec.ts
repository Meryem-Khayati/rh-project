import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruteursComponent } from './recruteurs.component';

describe('RecruteursComponent', () => {
  let component: RecruteursComponent;
  let fixture: ComponentFixture<RecruteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruteursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
