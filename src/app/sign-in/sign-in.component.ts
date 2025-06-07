import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-sign-in', // Standalone component
    imports: [CommonModule, FormsModule], // Make sure FormsModule is imported
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  signIn() {
    this.userService.signIn(this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/surveys']);  // Redirect after successful sign-in
      },
      error: (err) => {
        // this.notify.showMessage({ message: 'Sign in failed. Please try again.', duration: 0 });
      }
    });
  }
}