import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './app/layout/main-page/main-page.component';
import { LoginComponent } from './app/auth/login/login.component';
import { RegisterComponent } from './app/auth/register/register.component';
import { MovieDetailsComponent } from './app/layout/movie-details/movie-details.component';
import { HomeComponent } from './app/layout/home/home.component';
import { AllSubscriptionsComponent } from './app/layout/all-subscriptions/all-subscriptions.component';
import { AddNewTvShowComponent } from './app/layout/add-new-tv-show/add-new-tv-show.component';
import { AddNewMovieComponent } from './app/layout/add-new-movie/add-new-movie.component';
import { AddNewEpisodeComponent } from './app/layout/add-new-episode/add-new-episode.component';
import { AddNewPeopleComponent } from './app/layout/add-new-people/add-new-people.component';
import { TvShowDetailsComponent } from './app/layout/tv-show-details/tv-show-details.component';
import { SearchComponent } from './app/layout/search/search.component';
import { EditTvShowComponent } from './app/layout/edit-tv-show/edit-tv-show.component';
import { EditMovieComponent } from './app/layout/edit-movie/edit-movie.component';
import { AuthGuardService } from './app/auth/auth-guard.service';

const routes: Routes = [
  { path: '', component: MainPageComponent }, //all 
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] }, //user or admin
  { path: 'search', component: SearchComponent, canActivate: [AuthGuardService] }, //user or admin

  { path: 'login', component: LoginComponent }, //all 
  { path: 'register', component: RegisterComponent }, //all 

  { path: 'tv-show-details/:movieId', component: TvShowDetailsComponent, canActivate: [AuthGuardService] }, //user or admin
  { path: 'movie-details/:movieId', component: MovieDetailsComponent, canActivate: [AuthGuardService] }, //user or admin

  { path: 'all-subscriptions', component: AllSubscriptionsComponent, canActivate: [AuthGuardService], data: { roles: ['user', 'admin'] } }, //user

  { path: 'add-new-movie', component: AddNewMovieComponent, canActivate: [AuthGuardService], data: { roles: ['admin'] } }, //admin
  { path: 'add-new-tv-show', component: AddNewTvShowComponent, canActivate: [AuthGuardService], data: { roles: ['admin'] } }, //admin
  { path: 'add-new-episode/:seriesId', component: AddNewEpisodeComponent, canActivate: [AuthGuardService], data: { roles: ['admin'] } }, //admin
  { path: 'add-new-people', component: AddNewPeopleComponent, canActivate: [AuthGuardService], data: { roles: ['admin'] } }, //admin

  { path: 'edit-movie/:movieId', component: EditMovieComponent, canActivate: [AuthGuardService], data: { roles: ['admin'] } }, //admin
  { path: 'edit-show/:movieId', component: EditTvShowComponent, canActivate: [AuthGuardService], data: { roles: ['admin'] } }, //admin
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
