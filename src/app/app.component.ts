import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { StoreService } from './store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  store: StoreService = inject(StoreService);
  router = inject(Router);

  logout() {
    this.store.logout();
    this.router.navigate(['/login']);
  }
}