import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuristaRezervisiComponent } from './turista-rezervisi.component';

describe('TuristaRezervisiComponent', () => {
  let component: TuristaRezervisiComponent;
  let fixture: ComponentFixture<TuristaRezervisiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TuristaRezervisiComponent]
    });
    fixture = TestBed.createComponent(TuristaRezervisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
