import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required], // Assuming dob is a date input in your form
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { firstName, lastName, dob, username, email, password } = this.registerForm.value;
    const dobDate = new Date(dob);

    this.authService.register(firstName, lastName, dobDate, username, email, password, (err, result) => {
      if (err) {
        console.error('Registration error:', err);
        alert('Registration error! Please try again.');
      } else {
        console.log('Registration successful:', result);
        alert('Registration successful! Please check and verify your email.');
        this.router.navigate(['/login']);
      }
    });
  }
}
