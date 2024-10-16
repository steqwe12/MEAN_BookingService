import { TestBed } from '@angular/core/testing';

import { KuponService } from './kupon.service';

describe('KuponService', () => {
  let service: KuponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KuponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
