import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { StoreService } from './store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private store: StoreService, private router: Router) {}

  login() {
    if (this.store.login(this.username.trim(), this.password.trim())) {
      this.router.navigate(['/inventory']);
      return;
    }

    // show a message box on invalid login
    alert('Invalid username or password.');
  }
}
