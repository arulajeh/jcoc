import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserPage } from './all-user.page';

describe('AllUserPage', () => {
  let component: AllUserPage;
  let fixture: ComponentFixture<AllUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
