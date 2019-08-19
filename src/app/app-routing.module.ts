import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'music-detail', loadChildren: './pages/music-detail/music-detail.module#MusicDetailPageModule' },
  { path: 'view-lyric', loadChildren: './pages/view-lyric/view-lyric.module#ViewLyricPageModule' },
  { path: 'edit-music', loadChildren: './pages/edit-music/edit-music.module#EditMusicPageModule' },
  { path: 'view-schedule', loadChildren: './pages/view-schedule/view-schedule.module#ViewSchedulePageModule' },
  { path: 'member-update', loadChildren: './pages/member-update/member-update.module#MemberUpdatePageModule' },  { path: 'articles-all', loadChildren: './pages/articles-all/articles-all.module#ArticlesAllPageModule' },
  { path: 'articles-add', loadChildren: './pages/articles-add/articles-add.module#ArticlesAddPageModule' },
  { path: 'articles-update', loadChildren: './pages/articles-update/articles-update.module#ArticlesUpdatePageModule' },
  { path: 'schedule-update', loadChildren: './pages/schedule-update/schedule-update.module#ScheduleUpdatePageModule' }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
