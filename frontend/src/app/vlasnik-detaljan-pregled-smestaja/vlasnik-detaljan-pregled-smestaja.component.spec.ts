import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikDetaljanPregledSmestajaComponent } from './vlasnik-detaljan-pregled-smestaja.component';

describe('VlasnikDetaljanPregledSmestajaComponent', () => {
  let component: VlasnikDetaljanPregledSmestajaComponent;
  let fixture: ComponentFixture<VlasnikDetaljanPregledSmestajaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikDetaljanPregledSmestajaComponent]
    });
    fixture = TestBed.createComponent(VlasnikDetaljanPregledSmestajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
