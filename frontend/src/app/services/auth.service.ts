import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  rol?: 'ADMIN' | 'USER';
  token?: string;
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

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const exp = decoded.exp * 1000;
        if (Date.now() > exp) {
          localStorage.removeItem('token');
        } else {
          this.loggedIn.next(true);
        }

      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }

  // 🔐 LOGIN REAL (JWT)
  loginBackend(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/login`,
      { email, password }
    );
  }


  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);

    return decoded.role || null;
  }

  getUser(): Usuario | null {

    if (this.user) return this.user;

    const stored = localStorage.getItem('usuario');
    if (!stored) return null;

    this.user = JSON.parse(stored);
    return this.user;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.getRoleFromToken() === 'ADMIN';
  }
  logout() {
    this.user = null;

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.loggedIn.next(false);
    this.router.navigate(['/iniciar-sesion']);
  }

  redirectByRole() {
    if (this.isAdmin()) {
      this.router.navigate(['/admin/panel-administracion']);
    } else {
      this.router.navigate(['/admin/clases-usuario']);
    }
  }

  setUser(response: any) {

    localStorage.setItem('token', response.token);

    const user = {
      idUsuario: response.idUsuario,
      nombre: response.nombre,
      email: response.email
    };

    localStorage.setItem('usuario', JSON.stringify(user));

    this.user = user;
    this.loggedIn.next(true);
  }

  // 📧 RESET PASSWORD (LO DEJAMOS IGUAL)
  sendResetPasswordEmail(email: string): Observable<string> {
    return this.http.post(
      'https://tfg-musicallyx.onrender.com/v1/api/email/reset-password-request',
      { email },
      { responseType: 'text' }
    );
  }
}
