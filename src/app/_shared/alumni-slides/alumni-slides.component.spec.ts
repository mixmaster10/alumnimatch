import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniSlidesComponent } from './alumni-slides.component';

describe('AlumniSlidesComponent', () => {
  let component: AlumniSlidesComponent;
  let fixture: ComponentFixture<AlumniSlidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumniSlidesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumniSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
