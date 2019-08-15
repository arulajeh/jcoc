import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMusicPage } from './edit-music.page';

describe('EditMusicPage', () => {
  let component: EditMusicPage;
  let fixture: ComponentFixture<EditMusicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMusicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
