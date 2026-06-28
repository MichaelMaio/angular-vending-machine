import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductListComponent } from './product-list.component';
import { StoreService } from './store.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './inventory.component.html'
})
export class InventoryComponent {
  message = '';

  constructor(public store: StoreService, private router: Router) {
    if (!this.store.user.loggedIn) {
      this.router.navigate(['/login']);
    }
  }

  addToCart(index: number) {
    const product = this.store.products[index];
    if (!product) {
      return;
    }

    if (this.store.addToCart(product.id)) {
      this.message = `${product.name} was added to your cart.`;
    } else {
      this.message = `${product.name} is out of stock.`;
    }
  }
}
