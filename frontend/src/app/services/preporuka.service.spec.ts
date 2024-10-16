import { TestBed } from '@angular/core/testing';

import { PreporukaService } from './preporuka.service';

describe('PreporukaService', () => {
  let service: PreporukaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreporukaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
