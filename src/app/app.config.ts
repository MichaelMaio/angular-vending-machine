import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { LoginComponent } from './login.component';
import { InventoryComponent } from './inventory.component';
import { CartComponent } from './cart.component';
import { CheckoutComponent } from './checkout.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      { path: 'login', component: LoginComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' }
    ], withEnabledBlockingInitialNavigation())
  ]
};
