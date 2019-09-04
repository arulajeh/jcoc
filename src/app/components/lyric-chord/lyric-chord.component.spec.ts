import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LyricChordComponent } from './lyric-chord.component';

describe('LyricChordComponent', () => {
  let component: LyricChordComponent;
  let fixture: ComponentFixture<LyricChordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LyricChordComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LyricChordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
