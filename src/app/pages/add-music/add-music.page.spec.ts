import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMusicPage } from './add-music.page';

describe('AddMusicPage', () => {
  let component: AddMusicPage;
  let fixture: ComponentFixture<AddMusicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMusicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
