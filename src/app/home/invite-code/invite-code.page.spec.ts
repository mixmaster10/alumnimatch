import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteCodePage } from './invite-code.page';

describe('InviteCodePage', () => {
  let component: InviteCodePage;
  let fixture: ComponentFixture<InviteCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
