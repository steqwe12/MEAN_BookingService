import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuristaDetaljiRezervacijeComponent } from './turista-detalji-rezervacije.component';

describe('TuristaDetaljiRezervacijeComponent', () => {
  let component: TuristaDetaljiRezervacijeComponent;
  let fixture: ComponentFixture<TuristaDetaljiRezervacijeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TuristaDetaljiRezervacijeComponent]
    });
    fixture = TestBed.createComponent(TuristaDetaljiRezervacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
