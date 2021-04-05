import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClReligionModalComponent } from './cl-religion-modal.component';

describe('ClReligionModalComponent', () => {
  let component: ClReligionModalComponent;
  let fixture: ComponentFixture<ClReligionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClReligionModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClReligionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
