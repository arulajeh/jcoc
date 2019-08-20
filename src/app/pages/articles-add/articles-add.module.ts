import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ArticlesAddPage } from './articles-add.page';

import { IonicSelectableModule } from "ionic-selectable";

const routes: Routes = [
  {
    path: '',
    component: ArticlesAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule
  ],
  declarations: [ArticlesAddPage]
})
export class ArticlesAddPageModule {}
