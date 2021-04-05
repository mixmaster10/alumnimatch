import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsCollegesComponent } from './ps-colleges.component';

describe('PsCollegesComponent', () => {
  let component: PsCollegesComponent;
  let fixture: ComponentFixture<PsCollegesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsCollegesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsCollegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
