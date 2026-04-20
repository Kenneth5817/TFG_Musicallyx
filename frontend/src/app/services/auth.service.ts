// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  rol?: 'ADMIN' | 'USER';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  user: Usuario | null = null;
  isLoggedIn$ = this.loggedIn.asObservable();

  private baseUrl = 'https://tfg-musicallyx.onrender.com/v1/api/auth';

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('usuario');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.loggedIn.next(true);
    }
  }

  redirectByRole(user: Usuario) {
    this.router.navigate([
      user.rol === 'ADMIN'
        ? '/admin/panel-administracion'
        : '/admin/clases-usuario'
    ]);
  }

  getUser(): Usuario | null {
    if (this.user) return this.user;

    const stored = localStorage.getItem('usuario');
    if (!stored) return null;

    this.user = JSON.parse(stored);
    return this.user;
  }

  // 🔹 Nuevo método
  isLoggedIn(): boolean {
    const email = localStorage.getItem('email');
    return !!email && email.trim() !== '' && email !== 'null' && email !== 'undefined';
  }

  loginBackend(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true });
  }

  setUser(usuario: Usuario) {
    this.user = usuario;
    this.loggedIn.next(true);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('email', usuario.email);
    localStorage.setItem('rol', usuario.rol || 'USER');
  }

  register(usuario: { password: any; nombre: any; email: any }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, usuario, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  login(email: string, password: string) {
    return this.http.post<Usuario>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((usuario: Usuario) => {
          this.setUser(usuario);

          if (usuario.rol === 'ADMIN') {
            this.router.navigate(['/admin/panel-administracion']);
          } else {
            this.router.navigate(['/admin/clases-usuario']);
          }
        })
      );
  }

  logout() {
    this.user = null;
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
    this.loggedIn.next(false);
  }
  validarSesionBackend(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/validar-sesion`, { withCredentials: true });
  }

  isAdmin(): boolean {
    const email = localStorage.getItem('email');
    const rol = localStorage.getItem('rol');
    return !!email && rol === 'ADMIN';
  }

  sendResetPasswordEmail(email: string): Observable<string> {
    return this.http.post('https://tfg-musicallyx.onrender.com/api/email/reset-password-request',
      { email },
      { responseType: 'text', withCredentials: true }
    );
  }

}
