import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllmusicPage } from './allmusic.page';

describe('AllmusicPage', () => {
  let component: AllmusicPage;
  let fixture: ComponentFixture<AllmusicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllmusicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllmusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
