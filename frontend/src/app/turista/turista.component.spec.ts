import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuristaComponent } from './turista.component';

describe('TuristaComponent', () => {
  let component: TuristaComponent;
  let fixture: ComponentFixture<TuristaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TuristaComponent]
    });
    fixture = TestBed.createComponent(TuristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
