import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetaljVlasnikaSmestajComponent } from './admin-detalj-vlasnika-smestaj.component';

describe('AdminDetaljVlasnikaSmestajComponent', () => {
  let component: AdminDetaljVlasnikaSmestajComponent;
  let fixture: ComponentFixture<AdminDetaljVlasnikaSmestajComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDetaljVlasnikaSmestajComponent]
    });
    fixture = TestBed.createComponent(AdminDetaljVlasnikaSmestajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
