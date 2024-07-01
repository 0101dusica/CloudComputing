import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isPasswordVisible: boolean = false;

  constructor(private router: Router) {
  }

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  onLogin() {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (emailControl && passwordControl) {
      const email = emailControl.value?.trim();
    const password = passwordControl.value?.trim();
      console.log("Ovde proveravam ",email, " ", password);
      if (email === 'admin' && password === 'admin') {
        this.router.navigate(['/home', 0]);
      } else if (email === 'user' && password === 'user') {
        this.router.navigate(['/home', 1]);
      } else {
        // Handle invalid login
        console.log('Invalid login');
      }
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
