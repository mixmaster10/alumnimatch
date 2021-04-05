import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSmComponent } from './ad-sm.component';

describe('AdSmComponent', () => {
  let component: AdSmComponent;
  let fixture: ComponentFixture<AdSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdSmComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
