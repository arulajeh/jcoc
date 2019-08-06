import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchedulePage } from './add-schedule.page';

describe('AddSchedulePage', () => {
  let component: AddSchedulePage;
  let fixture: ComponentFixture<AddSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
