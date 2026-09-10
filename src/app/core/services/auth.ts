import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authKey = 'banking_portal_auth';
  private readonly authenticated = signal(localStorage.getItem(this.authKey) === 'true');

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  login(email: string, password: string): boolean {
    if (!email || !password) {
      return false;
    }

    localStorage.setItem(this.authKey, 'true');
    this.authenticated.set(true);

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.authKey);
    this.authenticated.set(false);
  }
}
