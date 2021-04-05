import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSlidesComponent } from './ad-slides.component';

describe('AdSlidesComponent', () => {
  let component: AdSlidesComponent;
  let fixture: ComponentFixture<AdSlidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdSlidesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
