import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedInputComponent } from './interested-input.component';

describe('InterestedInputComponent', () => {
  let component: InterestedInputComponent;
  let fixture: ComponentFixture<InterestedInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestedInputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
