import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClCausesComponent } from './cl-causes.component';

describe('ClCausesComponent', () => {
  let component: ClCausesComponent;
  let fixture: ComponentFixture<ClCausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClCausesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClCausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
