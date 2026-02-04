// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  public user: { email: string, name: string } | null = null;

  constructor() {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.user = { email: storedEmail, name: storedEmail.split('@')[0] };
      this._isLoggedIn$.next(true);
    }
  }

  login(email: string, name: string) {
    this.user = { email, name };
    localStorage.setItem('email', email);
    this._isLoggedIn$.next(true);
  }

  logout() {
    this.user = null;
    localStorage.removeItem('email');
    this._isLoggedIn$.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('email');
  }
}
