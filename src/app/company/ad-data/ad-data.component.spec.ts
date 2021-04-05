import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDataComponent } from './ad-data.component';

describe('AdDataComponent', () => {
  let component: AdDataComponent;
  let fixture: ComponentFixture<AdDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdDataComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
