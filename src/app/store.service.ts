import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
  remaining: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  user = { name: '', loggedIn: false };

  products: Product[] = [
    { id: 1, name: 'Coke', image: 'coke.png', price: 1.25, remaining: 5 },
    { id: 2, name: 'Pepsi', image: 'pepsi.png', price: 0.75, remaining: 10 }
  ];

  cart: CartItem[] = [];
  orderConfirmation = '';

  login(username: string, password: string) {
    if (username === 'standard_user' && password === 'standard_password') {
      this.user = { name: 'Standard User', loggedIn: true };
      return true;
    }
    return false;
  }

  logout() {
    this.user = { name: '', loggedIn: false };
    this.cart = [];
    this.orderConfirmation = '';
  }

  findProduct(id: number) {
    return this.products.find((product) => product.id === id);
  }

  get cartItems() {
    return this.cart
      .map((item) => {
        const product = this.findProduct(item.productId);
        return {
          product,
          quantity: item.quantity
        };
      })
      .filter((item) => item.product);
  }

  get cartQuantity() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal() {
    return this.cartItems.reduce((total, item) => total + (item.product!.price * item.quantity), 0);
  }

  addToCart(productId: number) {
    const product = this.findProduct(productId);
    if (!product || product.remaining === 0) {
      return false;
    }

    product.remaining -= 1;
    const existing = this.cart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ productId, quantity: 1 });
    }

    return true;
  }

  removeFromCart(productId: number) {
    const item = this.cart.find((cartItem) => cartItem.productId === productId);
    const product = this.findProduct(productId);
    if (!item || !product) {
      return;
    }

    item.quantity -= 1;
    product.remaining += 1;

    if (item.quantity <= 0) {
      this.cart = this.cart.filter((cartItem) => cartItem.productId !== productId);
    }
  }

  checkout(address: string, city: string, zip: string, cardNumber: string) {
    if (!this.cart.length) {
      return false;
    }

    this.orderConfirmation = `Order received for ${this.user.name}. Total: $${this.cartTotal.toFixed(2)}. Shipping to ${address}, ${city} ${zip}. Payment card ending in ${cardNumber.slice(-4)}.`;
    this.cart = [];
    return true;
  }
}
