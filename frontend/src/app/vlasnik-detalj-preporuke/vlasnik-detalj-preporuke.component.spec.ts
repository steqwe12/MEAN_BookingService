import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnikDetaljPreporukeComponent } from './vlasnik-detalj-preporuke.component';

describe('VlasnikDetaljPreporukeComponent', () => {
  let component: VlasnikDetaljPreporukeComponent;
  let fixture: ComponentFixture<VlasnikDetaljPreporukeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VlasnikDetaljPreporukeComponent]
    });
    fixture = TestBed.createComponent(VlasnikDetaljPreporukeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
