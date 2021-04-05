import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumniModalComponent } from './alumni-modal.component';

describe('AlumniModalComponent', () => {
  let component: AlumniModalComponent;
  let fixture: ComponentFixture<AlumniModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumniModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumniModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
