import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikUnesiSmestajComponent } from './vlasnik-unesi-smestaj.component';

describe('VlasnikUnesiSmestajComponent', () => {
  let component: VlasnikUnesiSmestajComponent;
  let fixture: ComponentFixture<VlasnikUnesiSmestajComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikUnesiSmestajComponent]
    });
    fixture = TestBed.createComponent(VlasnikUnesiSmestajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
