import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSearchBarComponent } from './appointment-search-bar.component';

describe('AppointmentSearchBarComponent', () => {
  let component: AppointmentSearchBarComponent;
  let fixture: ComponentFixture<AppointmentSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
