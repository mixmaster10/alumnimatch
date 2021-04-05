import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClGenderAgeEthnicityComponent } from './cl-gender-age-ethnicity.component';

describe('ClGenderAgeEthnicityComponent', () => {
  let component: ClGenderAgeEthnicityComponent;
  let fixture: ComponentFixture<ClGenderAgeEthnicityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClGenderAgeEthnicityComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClGenderAgeEthnicityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
