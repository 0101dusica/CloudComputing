import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent {
  isPopupVisible = false;
  constructor(private router: Router) {}

  onProfilePictureClick(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  onPopupClick(event: Event): void {
    if (this.isPopupVisible && event.target instanceof HTMLElement && !event.target.closest('.admin-dropdown')) {
       this.isPopupVisible = false;
    }
  }
  
  navigateTo(route: string): void {
    this.isPopupVisible = false;
    this.router.navigate([route]);
  }

  logOut(): void {
    this.router.navigate(['/']);
  }

}
