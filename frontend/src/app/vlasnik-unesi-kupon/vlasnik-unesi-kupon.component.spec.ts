import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikUnesiKuponComponent } from './vlasnik-unesi-kupon.component';

describe('VlasnikUnesiKuponComponent', () => {
  let component: VlasnikUnesiKuponComponent;
  let fixture: ComponentFixture<VlasnikUnesiKuponComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikUnesiKuponComponent]
    });
    fixture = TestBed.createComponent(VlasnikUnesiKuponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
