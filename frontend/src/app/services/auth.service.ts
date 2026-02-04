// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  private baseUrl = 'http://localhost:8080/v1/api/auth';

  constructor(private http: HttpClient) {
    // Inicializar estado de login según localStorage
    const usuario = localStorage.getItem('usuario');
    this.loggedIn.next(!!usuario);
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
    return this.http.post('http://localhost:8080/api/email/reset-password',
      { email },
      { responseType: 'text', withCredentials: true }
    );
  }
}
