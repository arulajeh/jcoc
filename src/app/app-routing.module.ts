import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'add-music', loadChildren: './pages/add-music/add-music.module#AddMusicPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'allmusic', loadChildren: './pages/allmusic/allmusic.module#AllmusicPageModule' },
  { path: 'add-user', loadChildren: './pages/add-user/add-user.module#AddUserPageModule' },
  { path: 'all-user', loadChildren: './pages/all-user/all-user.module#AllUserPageModule' },
  { path: 'all-schedule', loadChildren: './pages/all-schedule/all-schedule.module#AllSchedulePageModule' },
  { path: 'add-schedule', loadChildren: './pages/add-schedule/add-schedule.module#AddSchedulePageModule' },
  { path: 'content', loadChildren: './pages/content/content.module#ContentPageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
