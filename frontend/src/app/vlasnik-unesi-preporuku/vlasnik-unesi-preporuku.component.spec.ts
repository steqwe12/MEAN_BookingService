import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikUnesiPreporukuComponent } from './vlasnik-unesi-preporuku.component';

describe('VlasnikUnesiPreporukuComponent', () => {
  let component: VlasnikUnesiPreporukuComponent;
  let fixture: ComponentFixture<VlasnikUnesiPreporukuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikUnesiPreporukuComponent]
    });
    fixture = TestBed.createComponent(VlasnikUnesiPreporukuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
