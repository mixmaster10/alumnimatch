import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClHomeBaseLocationComponent } from './cl-home-base-location.component';

describe('ClHomeBaseLocationComponent', () => {
  let component: ClHomeBaseLocationComponent;
  let fixture: ComponentFixture<ClHomeBaseLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClHomeBaseLocationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClHomeBaseLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
