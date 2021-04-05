import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsAthleteComponent } from './ps-athlete.component';

describe('PsAthleteComponent', () => {
  let component: PsAthleteComponent;
  let fixture: ComponentFixture<PsAthleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsAthleteComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsAthleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
