import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromenaPodatakaComponent } from './promena-podataka.component';

describe('PromenaPodatakaComponent', () => {
  let component: PromenaPodatakaComponent;
  let fixture: ComponentFixture<PromenaPodatakaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromenaPodatakaComponent]
    });
    fixture = TestBed.createComponent(PromenaPodatakaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
