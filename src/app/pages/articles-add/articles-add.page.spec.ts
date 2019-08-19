import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesAddPage } from './articles-add.page';

describe('ArticlesAddPage', () => {
  let component: ArticlesAddPage;
  let fixture: ComponentFixture<ArticlesAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
