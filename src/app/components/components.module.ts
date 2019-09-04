import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LyricChordComponent} from './lyric-chord/lyric-chord.component';

const PAGES_COMPONENTS = [
  LyricChordComponent
];
@NgModule({
  declarations: [PAGES_COMPONENTS],
  imports: [
    CommonModule
  ],
  exports: [
    PAGES_COMPONENTS
  ],
  entryComponents: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule { }
