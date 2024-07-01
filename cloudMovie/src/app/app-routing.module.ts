import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './app/layout/main-page/main-page.component';
import { LoginComponent } from './app/auth/login/login.component';
import { RegisterComponent } from './app/auth/register/register.component';
import { MovieDetailsComponent } from './app/layout/movie-details/movie-details.component';
import { HomeComponent } from './app/layout/home/home.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'home/:id', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movie-details', component: MovieDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
