import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClHometownComponent } from './cl-hometown.component';

describe('ClHometownComponent', () => {
  let component: ClHometownComponent;
  let fixture: ComponentFixture<ClHometownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClHometownComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClHometownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
