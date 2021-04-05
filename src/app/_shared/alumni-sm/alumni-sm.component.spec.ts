import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniSmComponent } from './alumni-sm.component';

describe('AlumniSmComponent', () => {
  let component: AlumniSmComponent;
  let fixture: ComponentFixture<AlumniSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumniSmComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumniSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
