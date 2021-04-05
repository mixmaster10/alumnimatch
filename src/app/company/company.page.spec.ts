import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPage } from './company.page';

describe('CompanyPage', () => {
  let component: CompanyPage;
  let fixture: ComponentFixture<CompanyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
