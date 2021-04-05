import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPage } from './ad.page';

describe('AdPage', () => {
  let component: AdPage;
  let fixture: ComponentFixture<AdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
