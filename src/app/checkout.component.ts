import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { StoreService } from './store.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  address = '';
  city = '';
  zip = '';
  cardNumber = '';
  expiry = '';
  cvv = '';
  error = '';
  success = false;
  confirmation = '';

  constructor(public store: StoreService, private router: Router) {
    if (!this.store.user.loggedIn) {
      this.router.navigate(['/login']);
    }

    if (!this.store.cartItems.length) {
      this.router.navigate(['/inventory']);
    }
  }

  submit() {
    // Basic required checks
    if (!this.address.trim() || !this.city.trim() || !this.zip.trim() || !this.cardNumber.trim() || !this.expiry.trim() || !this.cvv.trim()) {
      this.error = 'Please complete all fields.';
      return;
    }

    // Zip code validation (US 5-digit)
    const zipOk = /^\d{5}$/.test(this.zip.trim());
    if (!zipOk) {
      this.error = 'Please enter a valid 5-digit zip code.';
      return;
    }

    // Card number validation: digits only and acceptable length
    const card = this.cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(card)) {
      this.error = 'Please enter a valid card number.';
      return;
    }

    // Expiry validation: MM/YY or MM/YYYY and not expired
    if (!this.validateExpiry(this.expiry.trim())) {
      this.error = 'Please enter a valid expiry date (MM/YY).' ;
      return;
    }

    if (this.store.checkout(this.address.trim(), this.city.trim(), this.zip.trim(), card)) {
      this.success = true;
      this.confirmation = this.store.orderConfirmation;
      this.error = '';
    } else {
      this.error = 'Your cart is empty or the checkout failed.';
    }
  }

  private validateExpiry(value: string) {
    // Accept MM/YY or MM/YYYY
    const mmyy = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    const mmyyyy = /^(0[1-9]|1[0-2])\/(\d{4})$/;
    let month: number, year: number;
    const now = new Date();

    let match = value.match(mmyy);
    if (match) {
      month = parseInt(match[1], 10);
      year = 2000 + parseInt(match[2], 10);
    } else {
      match = value.match(mmyyyy);
      if (match) {
        month = parseInt(match[1], 10);
        year = parseInt(match[2], 10);
      } else {
        return false;
      }
    }

    // Expiry is end of month
    const exp = new Date(year, month, 1);
    // Set to first of following month, then compare to now
    if (exp.getFullYear() < now.getFullYear()) return false;
    if (exp.getFullYear() === now.getFullYear() && month <= now.getMonth()) return false;
    return true;
  }

  onCardInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value || this.cardNumber || '';
    // keep only digits, limit to 19 digits (max for card numbers)
    const digits = raw.replace(/\D/g, '').slice(0, 19);
    // group into fours
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber = formatted;
    // update the input element's value and move caret to end for simplicity
    input.value = formatted;
    try {
      const len = formatted.length;
      input.setSelectionRange(len, len);
    } catch (e) {
      // ignore
    }
  }
}
