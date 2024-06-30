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
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  login(): void {
    const emailControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    if (!emailControl || !passwordControl) {
      console.error('Form controls not found');
      return;
    }

    const emailValue = emailControl.value?.trim();
    const passwordValue = passwordControl.value?.trim();

    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Information',
        text: 'Please enter both email and password.',
      });
      return;
    }

    if (emailValue == "admin" && passwordValue == "admin"){
      this.router.navigate(['/']);
    }else if (emailValue == "user" && passwordValue == "user"){
      this.router.navigate(['/']);
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Incorrect Information',
        text: 'Email or password is not correct. Try again!',
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
