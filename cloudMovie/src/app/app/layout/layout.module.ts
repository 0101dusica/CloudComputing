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

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    MainPageComponent,
    MovieDetailsComponent,
    HomeComponent,
    AdminNavComponent,
    UserNavComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    NavBarComponent,
    FooterComponent,
    MainPageComponent,
    HomeComponent
  ]
})

export class LayoutModule { }
