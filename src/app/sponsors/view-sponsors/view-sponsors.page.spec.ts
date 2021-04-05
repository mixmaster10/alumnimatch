import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSponsorsPage } from './view-sponsors.page';

describe('ViewSponsorsPage', () => {
  let component: ViewSponsorsPage;
  let fixture: ComponentFixture<ViewSponsorsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSponsorsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSponsorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
