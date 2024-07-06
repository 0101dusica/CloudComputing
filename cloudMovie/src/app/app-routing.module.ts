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

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'tv-show-details/:movieId', component: TvShowDetailsComponent },
  { path: 'movie-details/:movieId', component: MovieDetailsComponent },

  { path: 'all-subscriptions', component: AllSubscriptionsComponent },

  { path: 'add-new-movie', component: AddNewMovieComponent },
  { path: 'add-new-tv-show', component: AddNewTvShowComponent },
  { path: 'add-new-episode/:seriesId', component: AddNewEpisodeComponent },
  { path: 'add-new-people', component: AddNewPeopleComponent },

  { path: 'edit-movie/:movieId', component: EditMovieComponent },
  { path: 'edit-show/:movieId', component: EditTvShowComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
