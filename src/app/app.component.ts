import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoneySlotComponent } from './money-slot.component';
import { ProductListComponent } from './product-list.component';
import { ErrorMessageComponent } from './error-message.component';

interface Product {
  name: string;
  image: string;
  price: number;
  remaining: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [
    CommonModule,
    MoneySlotComponent,
    ProductListComponent,
    ErrorMessageComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  products: Product[] = [
    { name: 'Coke', image: 'coke.png', price: 1.25, remaining: 5 },
    { name: 'Pepsi', image: 'pepsi.png', price: 0.75, remaining: 10 }
  ];

  amountInserted = 0;
  errorMessage = '';

  insertQuarter() {
    this.amountInserted += 0.25;
    this.errorMessage = '';
  }

  purchase(index: number) {
    const product = this.products[index];

    if (product.remaining === 0) {
      this.errorMessage = `Sorry, ${product.name} is out of stock.`;
      return;
    }

    if (this.amountInserted < product.price) {
      this.errorMessage = `Insufficient funds. ${product.name} costs $${product.price}.`;
      return;
    }

    this.errorMessage = '';
    this.products[index].remaining -= 1;
    this.amountInserted -= product.price;
  }
}