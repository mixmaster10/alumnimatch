import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClRelationshipInviteModalComponent } from './cl-relationship-invite-modal.component';

describe('ClRelationshipInviteModalComponent', () => {
  let component: ClRelationshipInviteModalComponent;
  let fixture: ComponentFixture<ClRelationshipInviteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClRelationshipInviteModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClRelationshipInviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
