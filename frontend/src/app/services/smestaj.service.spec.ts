import { TestBed } from '@angular/core/testing';

import { SmestajService } from './smestaj.service';

describe('SmestajService', () => {
  let service: SmestajService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmestajService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
