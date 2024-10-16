import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetaljVlasnikaPreporukaComponent } from './admin-detalj-vlasnika-preporuka.component';

describe('AdminDetaljVlasnikaPreporukaComponent', () => {
  let component: AdminDetaljVlasnikaPreporukaComponent;
  let fixture: ComponentFixture<AdminDetaljVlasnikaPreporukaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDetaljVlasnikaPreporukaComponent]
    });
    fixture = TestBed.createComponent(AdminDetaljVlasnikaPreporukaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
