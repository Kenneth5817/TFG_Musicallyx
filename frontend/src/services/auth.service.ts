// auth.service.ts

import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn$.asObservable();
  public user: any = null;

  private baseUrl = 'http://localhost'; // puerto 80 por tu backend

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this._isLoggedIn$.next(true);
    }
  }

  loginBackend(email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8080/v1/api/auth/login`, { email, password })
      .pipe(
        tap(usuario => this.setUser(usuario))
      );
  }

  setUser(usuario: any) {
    this.user = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this._isLoggedIn$.next(true);
  }

  logout() {
    this.user = null;
    localStorage.removeItem('usuario');
    this._isLoggedIn$.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('usuario');
  }
}
