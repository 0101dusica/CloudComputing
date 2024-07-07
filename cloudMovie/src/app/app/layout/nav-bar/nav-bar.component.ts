import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  role: string | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.role = this.authService.role;
  }
}
