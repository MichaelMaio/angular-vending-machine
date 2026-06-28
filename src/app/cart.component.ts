import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { StoreService } from './store.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  constructor(public store: StoreService, private router: Router) {
    if (!this.store.user.loggedIn) {
      this.router.navigate(['/login']);
    }
  }

  remove(productId: number) {
    this.store.removeFromCart(productId);
  }
}
