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
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [Date, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onRegisterSubmit(): void {
    const { firstName, lastName, dob, email, password } = this.registerForm.value;
    const dobDate = new Date(dob);

    this.authService.register(firstName, lastName, dobDate, email, password, false, (err, result) => {
      if (err) {
        console.error('Registration error:', err);
      } else {
        console.log('Registration successful:', result);
      }
    });
  }

}
