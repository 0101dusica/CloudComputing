import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { HomeComponent } from './home/home.component';
import { AdminNavComponent } from './nav-bar/admin-nav/admin-nav.component';
import { UserNavComponent } from './nav-bar/user-nav/user-nav.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AllSubscriptionsComponent } from './all-subscriptions/all-subscriptions.component';
import { AddNewMovieComponent } from './add-new-movie/add-new-movie.component';
import { AddNewTvShowComponent } from './add-new-tv-show/add-new-tv-show.component';
import { AddNewEpisodeComponent } from './add-new-episode/add-new-episode.component';
import { AddNewPeopleComponent } from './add-new-people/add-new-people.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { TvShowDetailsComponent } from './tv-show-details/tv-show-details.component';
import { SearchComponent } from './search/search.component';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    MainPageComponent,
    MovieDetailsComponent,
    HomeComponent,
    AdminNavComponent,
    UserNavComponent,
    NotificationsComponent,
    AllSubscriptionsComponent,
    AddNewMovieComponent,
    AddNewTvShowComponent,
    AddNewEpisodeComponent,
    AddNewPeopleComponent,
    TvShowDetailsComponent,
    SearchComponent,
    ReviewDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
  ],
  exports:[
    NavBarComponent,
    FooterComponent,
    MainPageComponent,
    HomeComponent,
  ]
})

export class LayoutModule { }
