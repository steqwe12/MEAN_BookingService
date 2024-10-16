import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetaljVlasnikaComponent } from './admin-detalj-vlasnika.component';

describe('AdminDetaljVlasnikaComponent', () => {
  let component: AdminDetaljVlasnikaComponent;
  let fixture: ComponentFixture<AdminDetaljVlasnikaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDetaljVlasnikaComponent]
    });
    fixture = TestBed.createComponent(AdminDetaljVlasnikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
