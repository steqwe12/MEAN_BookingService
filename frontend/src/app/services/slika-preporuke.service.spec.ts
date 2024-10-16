import { TestBed } from '@angular/core/testing';

import { SlikaPreporukeService } from './slika-preporuke.service';

describe('SlikaPreporukeService', () => {
  let service: SlikaPreporukeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlikaPreporukeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
