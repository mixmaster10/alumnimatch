import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClHobbiesComponent } from './cl-hobbies.component';

describe('ClHobbiesComponent', () => {
  let component: ClHobbiesComponent;
  let fixture: ComponentFixture<ClHobbiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClHobbiesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClHobbiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
