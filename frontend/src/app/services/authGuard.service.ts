import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario && usuario.email) {
      return true; // usuario logueado
    } else {
      this.router.navigate(['/iniciar-sesion']);
      return false;
    }
  }
}

