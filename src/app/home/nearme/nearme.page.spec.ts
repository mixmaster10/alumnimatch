import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearmePage } from './nearme.page';

describe('NearmePage', () => {
  let component: NearmePage;
  let fixture: ComponentFixture<NearmePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearmePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearmePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
