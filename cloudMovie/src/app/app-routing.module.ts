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

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'home/:id', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movie-details/:movieId', component: MovieDetailsComponent },
  { path: 'all-subscriptions', component: AllSubscriptionsComponent },
  { path: 'add-new-movie', component: AddNewMovieComponent },
  { path: 'add-new-tv-show', component: AddNewTvShowComponent },
  { path: 'add-new-episode', component: AddNewEpisodeComponent },
  { path: 'add-new-people', component: AddNewPeopleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
