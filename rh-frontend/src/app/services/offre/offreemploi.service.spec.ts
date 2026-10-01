import { TestBed } from '@angular/core/testing';

import { OffreemploiService } from '../app/services/offreemploi.service';

describe('OffreemploiService', () => {
  let service: OffreemploiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffreemploiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
