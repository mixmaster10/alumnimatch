import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsDegreeComponent } from './ps-degree.component';

describe('PsDegreeComponent', () => {
  let component: PsDegreeComponent;
  let fixture: ComponentFixture<PsDegreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsDegreeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
