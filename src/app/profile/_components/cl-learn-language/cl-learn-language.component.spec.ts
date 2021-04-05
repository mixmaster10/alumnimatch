import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClLearnLanguageComponent } from './cl-learn-language.component';

describe('ClLearnLanguageComponent', () => {
  let component: ClLearnLanguageComponent;
  let fixture: ComponentFixture<ClLearnLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClLearnLanguageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClLearnLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
