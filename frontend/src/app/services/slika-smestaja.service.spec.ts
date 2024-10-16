import { TestBed } from '@angular/core/testing';

import { SlikaSmestajaService } from './slika-smestaja.service';

describe('SlikaSmestajaService', () => {
  let service: SlikaSmestajaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlikaSmestajaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
