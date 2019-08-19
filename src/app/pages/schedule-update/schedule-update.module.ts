import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScheduleUpdatePage } from './schedule-update.page';

import { IonicSelectableModule } from "ionic-selectable";

const routes: Routes = [
  {
    path: '',
    component: ScheduleUpdatePage
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
  declarations: [ScheduleUpdatePage]
})
export class ScheduleUpdatePageModule {}
