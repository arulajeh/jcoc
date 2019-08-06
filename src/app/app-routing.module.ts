import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
<<<<<<< HEAD
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },

=======
  { path: 'add-music', loadChildren: './pages/add-music/add-music.module#AddMusicPageModule' },
>>>>>>> 7ea4420b81ce4fa070f64e30174d43de78c438eb

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
