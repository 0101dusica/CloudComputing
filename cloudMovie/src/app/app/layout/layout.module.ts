import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent,
    MainPageComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    NavBarComponent,
    FooterComponent,
    MainPageComponent
  ]
})

export class LayoutModule { }
