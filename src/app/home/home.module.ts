import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomePage,
    children: [
      { path: 'add-music', loadChildren: '../pages/add-music/add-music.module#AddMusicPageModule' },
      // { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
      { path: 'all-music', loadChildren: '../pages/allmusic/allmusic.module#AllmusicPageModule' },
      { path: 'add-user', loadChildren: '../pages/add-user/add-user.module#AddUserPageModule' },
      { path: 'all-user', loadChildren: '../pages/all-user/all-user.module#AllUserPageModule' },
      { path: 'all-schedule', loadChildren: '../pages/all-schedule/all-schedule.module#AllSchedulePageModule' },
      { path: 'add-schedule', loadChildren: '../pages/add-schedule/add-schedule.module#AddSchedulePageModule' },
      { path: 'content', loadChildren: '../pages/content/content.module#ContentPageModule' },
      { path: 'dashboard', loadChildren: '../pages/dashboard/dashboard.module#DashboardPageModule' },
      { path: 'logout', loadChildren: '../pages/logout/logout.module#LogoutPageModule' },
      { path: 'articles-all', loadChildren: '../pages/articles-all/articles-all.module#ArticlesAllPageModule' },
      { path: 'articles-add', loadChildren: '../pages/articles-add/articles-add.module#ArticlesAddPageModule' },
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
    // RouterModule.forChild([
    //   {
    //     path: '',
    //     component: HomePage
    //   }
    // ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
