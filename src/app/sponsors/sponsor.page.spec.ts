import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorPage } from './sponsor.page';

describe('SponsorPage', () => {
  let component: SponsorPage;
  let fixture: ComponentFixture<SponsorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
