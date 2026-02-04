import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('email');
    if (!!user && user !== 'null' && user !== 'undefined') {
      return true; // usuario logueado
    } else {
      // no logueado → redirigir a login
      this.router.navigate(['/iniciar-sesion']);
      return false;
    }
  }
}

