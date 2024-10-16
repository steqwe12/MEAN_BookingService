import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeregistrovanPregledSmestajaComponent } from './neregistrovan-pregled-smestaja.component';

describe('NeregistrovanPregledSmestajaComponent', () => {
  let component: NeregistrovanPregledSmestajaComponent;
  let fixture: ComponentFixture<NeregistrovanPregledSmestajaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeregistrovanPregledSmestajaComponent]
    });
    fixture = TestBed.createComponent(NeregistrovanPregledSmestajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
