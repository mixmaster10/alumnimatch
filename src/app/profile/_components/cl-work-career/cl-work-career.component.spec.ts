import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClWorkCareerComponent } from './cl-work-career.component';

describe('ClWorkCareerComponent', () => {
  let component: ClWorkCareerComponent;
  let fixture: ComponentFixture<ClWorkCareerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClWorkCareerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClWorkCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
