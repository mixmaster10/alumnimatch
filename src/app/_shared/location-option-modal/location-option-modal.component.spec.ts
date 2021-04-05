import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationOptionModalComponent } from './location-option-modal.component';

describe('LocationOptionModalComponent', () => {
  let component: LocationOptionModalComponent;
  let fixture: ComponentFixture<LocationOptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationOptionModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationOptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
