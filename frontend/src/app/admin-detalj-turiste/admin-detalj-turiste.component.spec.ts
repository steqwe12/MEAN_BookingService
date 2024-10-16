import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetaljTuristeComponent } from './admin-detalj-turiste.component';

describe('AdminDetaljTuristeComponent', () => {
  let component: AdminDetaljTuristeComponent;
  let fixture: ComponentFixture<AdminDetaljTuristeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDetaljTuristeComponent]
    });
    fixture = TestBed.createComponent(AdminDetaljTuristeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
