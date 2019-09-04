import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewLyricPage } from './view-lyric.page';

import { ComponentsModule } from '../../components/components.module';



const routes: Routes = [
  {
    path: '',
    component: ViewLyricPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [ViewLyricPage]
})
export class ViewLyricPageModule {}
